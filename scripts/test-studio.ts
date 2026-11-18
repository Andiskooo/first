import assert from 'node:assert/strict';
import { computeOpenings } from '../components/studio/control';
import { buildExample } from '../components/studio/example';
import { createPlacedPart, droppedPartId, pointerGesture, pointInRect } from '../components/studio/place';
import { COMPONENTS } from '../components/studio/registry';
import { simulate } from '../components/studio/simulation';
import { validateConnection } from '../components/studio/validation';
import type { GraphEdge, GraphNode } from '../components/studio/types';

function near(actual: number, expected: number, tol: number, label: string) {
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} not within ${tol} of ${expected}`);
}

function graphOf(kind: 'direct' | 'buffer' = 'direct') {
  const example = buildExample(kind);
  return { nodes: example.nodes as GraphNode[], edges: example.edges };
}

function main() {
  const direct = graphOf('direct');
  const solved = simulate(direct.nodes, direct.edges);
  assert.equal(solved.mode, 'direct');
  assert.equal(solved.ok, true, solved.issues.map((issue) => issue.code).join(','));
  assert.equal(solved.limited, false);
  near(solved.supplyC ?? 0, 45, 0.6, 'direct supply');
  near(solved.deliveredKw, 7, 0.35, 'direct heat');
  near(solved.primaryFlowLph, 1440, 1, 'direct flow');
  const hk = solved.nodes.hk;
  const fbh = solved.nodes.fbh;
  assert.ok(hk && fbh, 'both consumers solved');
  assert.ok(hk.dt > fbh.dt + 0.4, `hk ΔT ${hk.dt} should exceed fbh ΔT ${fbh.dt}`);
  assert.ok(hk.tOut < fbh.tOut, 'higher demand returns cooler');
  near(hk.flowLph, 720, 1, 'equal split');
  near(fbh.flowLph, 720, 1, 'equal split');

  const hotter = structuredClone(direct);
  const hkNode = hotter.nodes.find((node) => node.id === 'hk');
  assert.ok(hkNode);
  const before = hk.tOut;
  hkNode.params = { ...hkNode.params, demand: 8 };
  const raised = simulate(hotter.nodes, hotter.edges);
  near(raised.supplyC ?? 0, 45, 0.8, 'supply holds under capacity');
  near(raised.deliveredKw, 11, 0.4, 'demand added');
  assert.ok((raised.nodes.hk?.tOut ?? 99) < before - 1, 'return temperature falls when demand rises');

  const slow = structuredClone(direct);
  const pump = slow.nodes.find((node) => node.id === 'p');
  assert.ok(pump);
  pump.params = { ...pump.params, speed: 40 };
  const slowed = simulate(slow.nodes, slow.edges);
  near(slowed.primaryFlowLph, 720, 1, 'half speed');
  assert.ok((slowed.nodes.hk?.dt ?? 0) > hk.dt * 1.7, 'lower flow widens ΔT');

  const overloaded = structuredClone(direct);
  overloaded.nodes.forEach((node) => {
    if (node.id === 'hp') node.params = { ...node.params, capacity: 6 };
    if (node.id === 'hk' || node.id === 'fbh') node.params = { ...node.params, demand: 8 };
  });
  const sag = simulate(overloaded.nodes, overloaded.edges);
  assert.equal(sag.limited, true);
  assert.ok((sag.supplyC ?? 45) < 40, `supply should sag, was ${sag.supplyC}`);
  near(sag.deliveredKw, 6, 0.45, 'capped heat');

  const reversed: { nodes: GraphNode[]; edges: GraphEdge[] } = structuredClone(direct);
  reversed.edges = reversed.edges.map((item) => {
    if (item.id !== 'e-hp-p' && item.id !== 'e-p-ts') return item;
    if (item.source === 'p') return { ...item, sourceHandle: item.sourceHandle === 'out' ? 'in' : 'out' };
    if (item.target === 'p') return { ...item, targetHandle: item.targetHandle === 'in' ? 'out' : 'in' };
    return item;
  });
  const backwards = simulate(reversed.nodes, reversed.edges);
  assert.ok(backwards.issues.some((issue) => issue.code === 'reversed-pump'));
  near(backwards.primaryFlowLph, 0, 0.1, 'reversed pump stops flow');

  const buffered = graphOf('buffer');
  const tank = simulate(buffered.nodes, buffered.edges);
  assert.equal(tank.mode, 'buffered', tank.issues.map((issue) => issue.code).join(','));
  assert.equal(tank.ok, true);
  near(tank.primaryFlowLph, 1260, 1, 'primary flow');
  near(tank.secondaryFlowLph, 990, 1, 'secondary flow');
  near(tank.supplyC ?? 0, 45, 0.8, 'buffer supply');
  assert.ok((tank.tankC ?? 0) < (tank.supplyC ?? 0) - 1, 'mixed tank is cooler than supply');
  assert.ok((tank.nodes.hk?.tOut ?? 99) < (tank.tankC ?? 0), 'consumer cools the tank water');
  assert.ok((tank.nodes.hk?.dt ?? 0) > (tank.nodes.fbh?.dt ?? 0), 'buffer branch ΔT follows demand');
  near(tank.deliveredKw, 8, 0.45, 'buffer heat');

  const fasterUsers = structuredClone(buffered);
  const secondary = fasterUsers.nodes.find((node) => node.id === 'p2');
  assert.ok(secondary);
  secondary.params = { ...secondary.params, speed: 90 };
  const sped = simulate(fasterUsers.nodes, fasterUsers.edges);
  near(sped.primaryFlowLph, tank.primaryFlowLph, 1, 'primary flow stays put');
  assert.ok(sped.secondaryFlowLph > tank.secondaryFlowLph + 200, 'secondary flow rises');
  assert.ok((sped.nodes.hk?.dt ?? 99) < (tank.nodes.hk?.dt ?? 0) - 1, 'faster secondary pump shrinks ΔT');

  const moreHeat = structuredClone(buffered);
  const bufferHk = moreHeat.nodes.find((node) => node.id === 'hk');
  assert.ok(bufferHk);
  bufferHk.params = { ...bufferHk.params, demand: 9 };
  const more = simulate(moreHeat.nodes, moreHeat.edges);
  assert.ok((more.nodes.hk?.tOut ?? 99) < (tank.nodes.hk?.tOut ?? 0) - 1, 'buffer consumer return falls');

  const internalOnly: { nodes: GraphNode[]; edges: GraphEdge[] } = {
    nodes: buffered.nodes.filter((node) => node.id !== 'p1').map((node) => (
      node.id === 'hp' ? { ...node, params: { ...node.params, internalPump: 1, internalSpeed: 100 } } : node
    )),
    edges: buffered.edges
      .filter((item) => item.id !== 'e-hp-p1' && item.id !== 'e-p1-ps')
      .concat([{ id: 'e-hp-ps', source: 'hp', target: 'ps', sourceHandle: 'supply-out', targetHandle: 'pri-in' }]),
  };
  const internal = simulate(internalOnly.nodes, internalOnly.edges);
  assert.equal(internal.mode, 'buffered');
  near(internal.primaryFlowLph, 1500, 1, 'internal circulator');

  const nodes = direct.nodes;
  const edges = direct.edges;
  assert.equal(validateConnection(nodes, edges, 'hk', 'supply-in', 'hp', 'return-in').ok, false);
  assert.equal(validateConnection(nodes, [], 'hp', 'supply-out', 'hk', 'supply-in').ok, true);
  assert.equal(validateConnection(nodes, [], 'hp', 'supply-out', 'hk', 'return-out').ok, false);

  const bare = buffered.nodes.filter((node) => node.id === 'hp' || node.id === 'ps' || node.id === 'hk');
  const none: GraphEdge[] = [];
  assert.equal(validateConnection(bare, none, 'hp', 'supply-out', 'ps', 'pri-in').ok, true);
  assert.equal(validateConnection(bare, none, 'ps', 'pri-out', 'hp', 'return-in').ok, true);
  assert.equal(validateConnection(bare, none, 'ps', 'sec-out-1', 'hk', 'supply-in').ok, true);
  assert.equal(validateConnection(bare, none, 'hk', 'return-out', 'ps', 'sec-in-1').ok, true);
  assert.equal(validateConnection(bare, none, 'hp', 'supply-out', 'ps', 'sec-out-1').ok, false);
  assert.equal(validateConnection(bare, none, 'hk', 'supply-in', 'ps', 'pri-in').ok, false);
  assert.equal(validateConnection(bare, none, 'hp', 'return-in', 'ps', 'pri-in').ok, false);
  assert.equal(validateConnection(bare, none, 'ps', 'sec-out-1', 'hk', 'return-out').ok, false);
  assert.equal(validateConnection(bare, none, 'ps', 'pri-out', 'hp', 'supply-out').ok, false);

  const withTee: GraphNode[] = [
    ...bare,
    buffered.nodes.find((node) => node.id === 'p1')!,
    buffered.nodes.find((node) => node.id === 'ts')!,
  ];
  const pumpIn: GraphEdge[] = [{ id: 'x', source: 'hp', target: 'p1', sourceHandle: 'supply-out', targetHandle: 'in' }];
  assert.equal(validateConnection(withTee, pumpIn, 'p1', 'out', 'ps', 'pri-in').ok, true);
  const userTee: GraphEdge[] = [{ id: 'y', source: 'ts', target: 'hk', sourceHandle: 'b', targetHandle: 'supply-in' }];
  assert.equal(validateConnection(withTee, userTee, 'ts', 'a', 'ps', 'pri-in').ok, false);
  assert.equal(validateConnection(withTee, userTee, 'ts', 'a', 'ps', 'sec-out-2').ok, true);

  const blocked = structuredClone(direct);
  blocked.nodes.push({ id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 0 } });
  blocked.edges = blocked.edges
    .filter((item) => item.id !== 'e-ts-hk')
    .concat([
      { id: 'e-ts-v', source: 'ts', target: 'v', sourceHandle: 'b', targetHandle: 'in' },
      { id: 'e-v-hk', source: 'v', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
    ]);
  const shut = simulate(blocked.nodes, blocked.edges);
  near(shut.nodes.hk?.flowLph ?? 0, 0, 1, 'closed valve stops its branch');
  near(shut.nodes.fbh?.flowLph ?? 0, 1440, 30, 'open branch takes the flow');

  const thermoNodes: GraphNode[] = [
    { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 16 } },
    { id: 'v3', componentId: 'valve-3way', params: {} },
    { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 1, opening: 100 } },
  ];
  const thermoEdges: GraphEdge[] = [
    { id: 's', source: 'rt', target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
  ];
  assert.equal(computeOpenings({ nodes: thermoNodes, edges: thermoEdges, held: {} }).v3, 0);
  thermoNodes[0] = { ...thermoNodes[0], params: { roomSet: 21, ambient: 24 } };
  assert.equal(computeOpenings({ nodes: thermoNodes, edges: thermoEdges, held: {} }).v3, 1);
  assert.equal(validateConnection(thermoNodes, [], 'rt', 'sig', 'v3', 'ctl').ok, true);
  assert.equal(validateConnection(thermoNodes, [], 'rt', 'sig', 'v', 'ctl').ok, false);

  const header: GraphNode[] = [
    { id: 'ms', componentId: 'manifold-supply', params: { branches: 3 } },
    { id: 'mr', componentId: 'manifold-return', params: { branches: 3 } },
    { id: 'hk', componentId: 'radiator', params: { demand: 2 } },
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45 } },
  ];
  assert.equal(validateConnection(header, [], 'ms', 'out-1', 'hk', 'supply-in').ok, true);
  assert.equal(validateConnection(header, [], 'ms', 'in', 'hk', 'return-out').ok, false);
  assert.equal(validateConnection(header, [], 'hk', 'return-out', 'mr', 'in-1').ok, true);
  assert.equal(validateConnection(header, [], 'mr', 'out', 'hp', 'return-in').ok, true);
  assert.equal(validateConnection(thermoNodes, [], 'rt', 'sig', 'v3', 'ab').ok, false);
  const bridged: GraphNode[] = [
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45 } },
    { id: 'v3', componentId: 'valve-3way', params: {} },
    { id: 'hk', componentId: 'radiator', params: { demand: 3 } },
  ];
  const supplySide: GraphEdge[] = [{ id: 'w', source: 'hp', target: 'v3', sourceHandle: 'supply-out', targetHandle: 'ab' }];
  assert.equal(validateConnection(bridged, supplySide, 'v3', 'a', 'hk', 'return-out').ok, true);
  assert.equal(validateConnection(bridged, supplySide, 'v3', 'b', 'hk', 'supply-in').ok, true);

  const diverted = buildExample('control');
  const cold = simulate(diverted.nodes, diverted.edges, computeOpenings({ nodes: diverted.nodes, edges: diverted.edges, held: {} }));
  assert.ok((cold.nodes.hk?.flowLph ?? 0) > 100, 'default port A feeds the radiator');
  near(cold.nodes.fbh?.flowLph ?? 0, 0, 1, 'port B is idle below setpoint');
  const warmNodes = diverted.nodes.map((node) => node.id === 'rt' ? { ...node, params: { ...node.params, ambient: 24 } } : node);
  const warm = simulate(warmNodes, diverted.edges, computeOpenings({ nodes: warmNodes, edges: diverted.edges, held: {} }));
  near(warm.nodes.hk?.flowLph ?? 0, 0, 1, 'port A is idle once ambient exceeds setpoint');
  assert.ok((warm.nodes.fbh?.flowLph ?? 0) > 100, 'flow follows port B');

  const manualNodes = warmNodes.map((node) => node.id === 'v3'
    ? { ...node, params: { ...node.params, controlMode: 1, manualPort: 0 } }
    : node);
  assert.equal(computeOpenings({ nodes: manualNodes, edges: diverted.edges, held: {} }).v3, 0);
  const heldManual = simulate(manualNodes, diverted.edges, computeOpenings({ nodes: manualNodes, edges: diverted.edges, held: {} }));
  assert.ok((heldManual.nodes.hk?.flowLph ?? 0) > 100, 'manual port A overrides a warm thermostat');
  near(heldManual.nodes.fbh?.flowLph ?? 0, 0, 1, 'manual port A leaves port B idle');

  const unlinkedNodes = diverted.nodes.map((node) => node.id === 'v3'
    ? { ...node, params: { ...node.params, controlMode: 0, manualPort: 1 } }
    : node);
  const unlinkedEdges = diverted.edges.filter((edge) => edge.kind !== 'signal');
  assert.equal(computeOpenings({ nodes: unlinkedNodes, edges: unlinkedEdges, held: {} }).v3, 1, 'without a thermostat the toggle wins');

  const mixerNodes: GraphNode[] = [
    { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 18 } },
    { id: 'mv', componentId: 'mixer', params: { mix: 50 } },
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45 } },
    { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
  ];
  const mixerSignal = validateConnection(mixerNodes, [], 'rt', 'sig', 'mv', 'h');
  assert.equal(mixerSignal.ok, false);
  if (!mixerSignal.ok) assert.equal(mixerSignal.code, 'mixer-manual');
  const hotSide: GraphEdge[] = [{ id: 'w', source: 'hp', target: 'mv', sourceHandle: 'supply-out', targetHandle: 'h' }];
  assert.equal(validateConnection(mixerNodes, hotSide, 'mv', 'c', 'hk', 'return-out').ok, true);
  assert.equal(validateConnection(mixerNodes, hotSide, 'mv', 'out', 'hk', 'supply-in').ok, true);

  function mixedAt(percent: number) {
    const example = buildExample('mix');
    const nodes = example.nodes.map((node) => node.id === 'mv' ? { ...node, params: { ...node.params, mix: percent } } : node);
    return simulate(nodes, example.edges, computeOpenings({ nodes, edges: example.edges, held: {} }));
  }
  const half = mixedAt(50);
  assert.equal(half.ok, true, half.issues.map((issue) => issue.code).join(','));
  const hotEdge = half.edges['e-ts-mv'];
  const coldEdge = half.edges['e-hk-mv'];
  const outEdge = half.edges['e-mv-fbh'];
  assert.ok(hotEdge && coldEdge && outEdge, 'mixer edges are solved');
  assert.ok(hotEdge.flowLph > 50 && coldEdge.flowLph > 50, 'both inlets carry flow at mid ratio');
  const hotT = hotEdge.flowFromSource ? hotEdge.tTarget : hotEdge.tSource;
  const coldT = coldEdge.flowFromSource ? coldEdge.tTarget : coldEdge.tSource;
  assert.ok(hotT > coldT + 8, `inlets should differ, hot ${hotT} cold ${coldT}`);
  const expected = (hotEdge.flowLph * hotT + coldEdge.flowLph * coldT) / (hotEdge.flowLph + coldEdge.flowLph);
  near(half.nodes.mv?.tOut ?? 0, expected, 0.8, 'mixer outlet is the flow-weighted mix');
  near(half.nodes.mv?.flowLph ?? 0, hotEdge.flowLph + coldEdge.flowLph, 5, 'mixer outlet flow is the sum');
  const outT = outEdge.flowFromSource ? outEdge.tSource : outEdge.tTarget;
  near(outT, expected, 0.8, 'outlet pipe starts at the mixed temperature');
  assert.ok(expected > 33 && expected < 38, `mixed temperature ${expected} should sit in the orange band`);

  const allCold = mixedAt(0);
  assert.ok((allCold.edges['e-ts-mv']?.flowLph ?? 0) < 1, '0% hot shuts the hot inlet');
  near(allCold.nodes.mv?.tOut ?? 0, allCold.nodes.hk?.tOut ?? 0, 0.8, '0% hot leaves the cold stream');
  const allHot = mixedAt(100);
  assert.ok((allHot.nodes.hk?.flowLph ?? 0) < 1, '100% hot shuts the cold inlet');
  near(allHot.nodes.mv?.tOut ?? 0, allHot.supplyC ?? 45, 1.5, '100% hot is the supply temperature');

  const withCheckNodes = direct.nodes.concat([{ id: 'cv', componentId: 'check', params: {} }]);
  const withCheckEdges = direct.edges.flatMap((item) => item.id === 'e-p-ts'
    ? [
      { id: 'e-p-cv', source: 'p', target: 'cv', sourceHandle: 'out', targetHandle: 'out' },
      { id: 'e-cv-ts', source: 'cv', target: 'ts', sourceHandle: 'in', targetHandle: 'a' },
    ]
    : [item]);
  const reversedCheck = simulate(withCheckNodes, withCheckEdges);
  near(reversedCheck.primaryFlowLph, 0, 1, 'check valve blocks reverse flow');

  const seen = new Set<string>();
  for (const [index, def] of COMPONENTS.entries()) {
    const payload = {
      types: ['text/plain', 'application/x-ecotek-part'],
      getData: (type: string) => (type === 'application/x-ecotek-part' || type === 'text/plain' ? def.id : ''),
    };
    assert.equal(droppedPartId(payload), def.id, `${def.id} survives the drop payload`);
    const placed = createPlacedPart(def.id, 240 + index * 15, 180, index + 1);
    assert.ok(placed, `${def.id} can be placed`);
    if (!placed) continue;
    assert.equal(placed.componentId, def.id);
    assert.equal(placed.id, `${def.code}-${index + 1}`);
    assert.ok(placed.width > 0 && placed.height > 0, `${def.id} has a size`);
    for (const param of def.params) {
      assert.equal(placed.params[param.id], param.defaultValue, `${def.id} default ${param.id}`);
    }
    const lone: GraphNode = { id: placed.id, componentId: placed.componentId, params: placed.params };
    const opened = computeOpenings({ nodes: [lone], edges: [], held: {} });
    const solved = simulate([lone], [], opened);
    assert.ok(solved, `${def.id} simulates after placement`);
    assert.ok(!seen.has(def.id));
    seen.add(def.id);
  }
  assert.equal(droppedPartId({ types: ['text/plain'], getData: () => 'https://example.com/symbol.svg' }), null);
  assert.equal(droppedPartId({
    types: ['text/uri-list'],
    getData: (type) => (type === 'text/uri-list' ? 'heat-pump' : ''),
  }), null);
  assert.equal(droppedPartId(null), null);
  assert.ok(seen.has('mixer') && seen.has('valve-3way') && seen.has('heat-pump'));
  assert.equal(pointerGesture(2, 3), 'tap');
  assert.equal(pointerGesture(8, 0), 'drag');
  assert.equal(pointerGesture(0, 7), 'tap');
  assert.equal(pointInRect(10, 10, { left: 0, top: 0, right: 20, bottom: 20 }), true);
  assert.equal(pointInRect(21, 10, { left: 0, top: 0, right: 20, bottom: 20 }), false);

  console.log('PASS studio simulation and connection rules');
}

main();
