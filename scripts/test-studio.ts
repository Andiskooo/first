import assert from 'node:assert/strict';
import { HP_RESTART_DEBOUNCE_MS, computeOpenings, isGenuineHpRestart } from '../components/studio/control';
import { buildExample } from '../components/studio/example';
import { createPlacedPart, droppedPartId, pointerGesture, pointInRect } from '../components/studio/place';
import { COMPONENTS } from '../components/studio/registry';
import { FLOW_ACTIVE_LPH, THERMAL_HEAT_RATE, advanceThermal, isThermalNode } from '../components/studio/thermal';
import { chargeBuffer, simulate } from '../components/studio/simulation';
import { temperatureColor } from '../components/studio/temperature';
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
  assert.equal(validateConnection(bare, none, 'hk', 'supply-in', 'ps', 'pri-in').ok, true);
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
  assert.equal(validateConnection(withTee, userTee, 'ts', 'a', 'ps', 'pri-in').ok, true);
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
  assert.equal(validateConnection(thermoNodes, [], 'rt', 'sig', 'v', 'ctl').ok, true);
  assert.equal(computeOpenings({ nodes: thermoNodes, edges: [{ id: 's2', source: 'rt', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }], held: {} }).v, 0, 'a warm thermostat closes the two-way valve');
  thermoNodes[0] = { ...thermoNodes[0], params: { roomSet: 21, ambient: 16 } };
  assert.equal(computeOpenings({ nodes: thermoNodes, edges: [{ id: 's2', source: 'rt', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }], held: {} }).v, 1, 'at or below the setpoint the two-way valve stays open');

  function zoneLoop(ambient: number, valveParams: Record<string, number>, withSignal = true) {
    const example = buildExample('direct');
    const nodes: GraphNode[] = [
      ...example.nodes,
      { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 1, opening: 100, controlMode: 0, manualOpen: 1, ...valveParams } },
      { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient } },
    ];
    const edges: GraphEdge[] = example.edges
      .filter((edge) => edge.id !== 'e-ts-hk')
      .concat([
        { id: 'e-ts-v', source: 'ts', target: 'v', sourceHandle: 'b', targetHandle: 'in' },
        { id: 'e-v-hk', source: 'v', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        ...(withSignal ? [{ id: 's-v', source: 'rt', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' as const }] : []),
      ]);
    return simulate(nodes, edges, computeOpenings({ nodes, edges, held: {} }));
  }
  const zoneOpen = zoneLoop(16, {});
  assert.equal(zoneOpen.ok, true, zoneOpen.issues.map((issue) => issue.code).join(','));
  near(zoneOpen.nodes.hk?.flowLph ?? 0, 720, 30, 'an open two-way valve shares the radiator branch');
  near(zoneOpen.nodes.fbh?.flowLph ?? 0, 720, 30, 'the parallel branch keeps its share while the valve is open');
  const zoneShut = zoneLoop(24, {});
  assert.equal(zoneShut.ok, true, zoneShut.issues.map((issue) => issue.code).join(','));
  assert.ok(!zoneShut.issues.some((issue) => issue.level === 'warn' || issue.level === 'error'), 'a closed branch is not an error');
  near(zoneShut.nodes.hk?.flowLph ?? 0, 0, 1, 'the thermostat closes the two-way valve');
  near(zoneShut.nodes.fbh?.flowLph ?? 0, 1440, 30, 'the open branch takes the flow when the valve closes');
  const heldOpen = zoneLoop(24, { controlMode: 1, manualOpen: 1 });
  near(heldOpen.nodes.hk?.flowLph ?? 0, 720, 30, 'manual Open overrides a warm thermostat');
  const heldShut = zoneLoop(16, { controlMode: 1, manualOpen: 0 });
  near(heldShut.nodes.hk?.flowLph ?? 0, 0, 1, 'manual Closed overrides a cool thermostat');
  const bareZone = zoneLoop(16, { opening: 50, manualOpen: 1 }, false);
  assert.ok((bareZone.nodes.hk?.flowLph ?? 0) > 200, 'without a thermostat a half-open valve still passes water');
  assert.ok((bareZone.nodes.fbh?.flowLph ?? 0) > (bareZone.nodes.hk?.flowLph ?? 0) + 100, 'the fully open branch takes more than the half-open valve');
  const bareClosed = zoneLoop(16, { opening: 0 }, false);
  near(bareClosed.nodes.hk?.flowLph ?? 0, 0, 1, 'without a thermostat the opening percentage can still shut the branch');

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
  const mixEdges = buildExample('mix').edges;
  const edgeAt = (sim: ReturnType<typeof simulate>, nodeId: string, portId: string) => {
    const found = mixEdges.find((edge) =>
      (edge.target === nodeId && edge.targetHandle === portId) || (edge.source === nodeId && edge.sourceHandle === portId));
    return found ? sim.edges[found.id] : undefined;
  };
  const hotEdge = edgeAt(half, 'mv', 'h');
  const coldEdge = edgeAt(half, 'mv', 'c');
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
  assert.ok((edgeAt(allCold, 'mv', 'h')?.flowLph ?? 0) < 1, '0% hot shuts the hot inlet');
  near(allCold.nodes.mv?.tOut ?? 0, allCold.nodes.hk?.tOut ?? 0, 0.8, '0% hot leaves the cold stream');
  const allHot = mixedAt(100);
  assert.ok((allHot.nodes.hk?.flowLph ?? 0) < 1, '100% hot shuts the cold inlet');
  near(allHot.nodes.mv?.tOut ?? 0, allHot.supplyC ?? 45, 1.5, '100% hot is the supply temperature');

  function solveMix(nodes: GraphNode[], edges: GraphEdge[]) {
    return simulate(nodes, edges, computeOpenings({ nodes, edges, held: {} }));
  }
  const fitted = buildExample('mix');
  const directColdNodes = fitted.nodes.filter((node) => node.id !== 'tc' && node.id !== 'j');
  const directColdEdges = fitted.edges
    .filter((edge) => edge.id !== 'e-hk-tc' && edge.id !== 'e-tc-j' && edge.id !== 'e-j-mv')
    .concat([{ id: 'e-hk-mv', source: 'hk', target: 'mv', sourceHandle: 'return-out', targetHandle: 'c' }]);
  const directCold = solveMix(directColdNodes, directColdEdges);
  const teeOnlyNodes = fitted.nodes.filter((node) => node.id !== 'j');
  const teeOnlyEdges = fitted.edges
    .filter((edge) => edge.id !== 'e-tc-j' && edge.id !== 'e-j-mv')
    .concat([{ id: 'e-tc-mv', source: 'tc', target: 'mv', sourceHandle: 'b', targetHandle: 'c' }]);
  const teeOnly = solveMix(teeOnlyNodes, teeOnlyEdges);
  const manifoldNodes: GraphNode[] = [...directColdNodes, { id: 'mr', componentId: 'manifold-return', params: { branches: 3 } }];
  const manifoldEdges = directColdEdges
    .filter((edge) => edge.id !== 'e-hk-mv')
    .concat([
      { id: 'e-hk-mr', source: 'hk', target: 'mr', sourceHandle: 'return-out', targetHandle: 'in-1' },
      { id: 'e-mr-mv', source: 'mr', target: 'mv', sourceHandle: 'out', targetHandle: 'c' },
    ]);
  const viaManifold = solveMix(manifoldNodes, manifoldEdges);
  const hotTeeNodes: GraphNode[] = [...directColdNodes, { id: 'th', componentId: 'tee', params: {} }];
  const hotTeeEdges = directColdEdges
    .filter((edge) => edge.id !== 'e-ts-mv')
    .concat([
      { id: 'e-ts-th', source: 'ts', target: 'th', sourceHandle: 'b', targetHandle: 'a' },
      { id: 'e-th-mv', source: 'th', target: 'mv', sourceHandle: 'b', targetHandle: 'h' },
    ]);
  const viaHotTee = solveMix(hotTeeNodes, hotTeeEdges);
  for (const [label, sample] of [['tee', teeOnly], ['tee+junction', half], ['manifold', viaManifold], ['hot tee', viaHotTee]] as const) {
    near(sample.nodes.mv?.tOut ?? 0, directCold.nodes.mv?.tOut ?? 0, 0.8, `${label} outlet temperature matches the direct mixer`);
    near(sample.nodes.mv?.flowLph ?? 0, directCold.nodes.mv?.flowLph ?? 0, 5, `${label} outlet flow matches the direct mixer`);
  }
  const rejoinedNodes: GraphNode[] = [...directColdNodes, { id: 'jc', componentId: 'junction', params: {} }];
  const rejoinedEdges = directColdEdges
    .filter((edge) => edge.id !== 'e-hk-mv' && edge.id !== 'e-fbh-tr' && edge.id !== 'e-tr-hp')
    .concat([
      { id: 'e-hk-jc', source: 'hk', target: 'jc', sourceHandle: 'return-out', targetHandle: 'w' },
      { id: 'e-jc-mv', source: 'jc', target: 'mv', sourceHandle: 'e', targetHandle: 'c' },
      { id: 'e-fbh-jc', source: 'fbh', target: 'jc', sourceHandle: 'return-out', targetHandle: 's' },
      { id: 'e-jc-hp', source: 'jc', target: 'hp', sourceHandle: 'n', targetHandle: 'return-in' },
    ]);
  const rejoined = solveMix(rejoinedNodes, rejoinedEdges);
  const rejoinCold = rejoined.edges['e-jc-mv'];
  assert.ok((rejoinCold?.flowLph ?? 0) > 50, 'cold water still reaches the mixer through a junction that the return also uses');
  const rejoinHot = rejoined.edges['e-ts-mv'];
  assert.ok(rejoinCold && rejoinHot);
  const rejoinColdT = rejoinCold.flowFromSource ? rejoinCold.tTarget : rejoinCold.tSource;
  const rejoinHotT = rejoinHot.flowFromSource ? rejoinHot.tTarget : rejoinHot.tSource;
  const rejoinOut = rejoined.nodes.mv?.tOut ?? 0;
  assert.ok(rejoinOut > Math.min(rejoinColdT, rejoinHotT) - 0.5 && rejoinOut < Math.max(rejoinColdT, rejoinHotT) + 0.5, 'rejoined mixer outlet is the mix of its inlets');

  const pumped = buildExample('direct');
  const thermoOn: GraphNode[] = [...pumped.nodes, { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 16 } }];
  const pumpSignalEdges: GraphEdge[] = pumped.edges.concat([{ id: 's-rt', source: 'rt', target: 'p', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }]);
  assert.equal(validateConnection(thermoOn, pumped.edges, 'rt', 'sig', 'p', 'ctl').ok, true);
  const mixerReject = validateConnection(
    [...thermoOn, { id: 'mv', componentId: 'mixer', params: { mix: 50 } }],
    pumpSignalEdges,
    'rt', 'sig', 'mv', 'c',
  );
  assert.equal(mixerReject.ok, false);
  if (!mixerReject.ok) assert.equal(mixerReject.code, 'mixer-manual');
  const pumpRunning = solveMix(thermoOn, pumpSignalEdges);
  assert.equal(computeOpenings({ nodes: thermoOn, edges: pumpSignalEdges, held: {} }).p, 1);
  assert.ok((pumpRunning.primaryFlowLph ?? 0) > 100, 'pump stays on at or below the room setpoint');
  const thermoOff = thermoOn.map((node) => node.id === 'rt' ? { ...node, params: { roomSet: 21, ambient: 24 } } : node);
  assert.equal(computeOpenings({ nodes: thermoOff, edges: pumpSignalEdges, held: {} }).p, 0);
  const pumpStopped = solveMix(thermoOff, pumpSignalEdges);
  near(pumpStopped.primaryFlowLph, 0, 1, 'pump stops when ambient is above the room setpoint');
  near(pumpStopped.nodes.hk?.flowLph ?? 0, 0, 1, 'the stopped pump puts no flow through its loop');
  const barePump = solveMix(pumped.nodes, pumped.edges);
  assert.ok((barePump.primaryFlowLph ?? 0) > 100, 'without a thermostat the pump still follows its speed');
  const bothEdges = diverted.edges.concat([{ id: 's-pump', source: 'rt', target: 'p', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }]);
  assert.equal(validateConnection(diverted.nodes, diverted.edges, 'rt', 'sig', 'p', 'ctl').ok, true);
  const bothCold = computeOpenings({ nodes: diverted.nodes, edges: bothEdges, held: {} });
  assert.equal(bothCold.v3, 0);
  assert.equal(bothCold.p, 1);
  const bothWarmNodes = diverted.nodes.map((node) => node.id === 'rt' ? { ...node, params: { ...node.params, ambient: 24 } } : node);
  const bothWarm = computeOpenings({ nodes: bothWarmNodes, edges: bothEdges, held: {} });
  assert.equal(bothWarm.v3, 1, 'the valve still diverts when the same thermostat also commands the pump');
  assert.equal(bothWarm.p, 0);

  const primaryNodes: GraphNode[] = [
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
    { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
    { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 16 } },
  ];
  const primaryEdges: GraphEdge[] = [
    { id: 'e-out', source: 'hp', target: 'ps', sourceHandle: 'supply-out', targetHandle: 'pri-in' },
    { id: 'e-back', source: 'ps', target: 'hp', sourceHandle: 'pri-out', targetHandle: 'return-in' },
  ];
  assert.equal(validateConnection(primaryNodes, [], 'hp', 'supply-out', 'ps', 'pri-in').ok, true);
  assert.equal(validateConnection(primaryNodes, [primaryEdges[0]], 'ps', 'pri-out', 'hp', 'return-in').ok, true);
  const charging = simulate(primaryNodes, primaryEdges);
  assert.ok(charging.ok, charging.issues.map((issue) => issue.code).join(','));
  assert.ok(!charging.issues.some((issue) => issue.level === 'warn' || issue.level === 'error'), 'a primary-only loop is not an error');
  assert.ok(charging.issues.some((issue) => issue.code === 'no-consumer'));
  assert.ok(charging.primaryFlowLph > 500, 'the internal circulator moves the primary loop');
  near(charging.secondaryFlowLph, 0, 1, 'the secondary side stays idle');
  assert.ok((charging.dtC ?? 0) > 4, 'a cold buffer still has a supply-return gradient');
  assert.ok((charging.edges['e-out']?.flowLph ?? 0) > 500, 'supply pipe shows flow');
  assert.ok((charging.edges['e-back']?.flowLph ?? 0) > 500, 'return pipe shows flow');
  const held = simulate(primaryNodes, primaryEdges, {}, { tankC: 44 });
  assert.ok((held.dtC ?? 99) < (charging.dtC ?? 0), 'the gradient narrows as the buffer warms');
  assert.ok((held.supplyC ?? 0) > 43 && (held.tankC ?? 0) > 43, 'with no load the heat pump holds near the setpoint');
  let warmed = 20;
  for (let step = 0; step < 240; step += 1) warmed = chargeBuffer(warmed, 45, 1500, 12, 200, 0.5);
  assert.ok(warmed > 40, 'the unloaded buffer charges toward the setpoint');
  const hpOffNodes = primaryNodes.map((node) => node.id === 'rt' ? { ...node, params: { roomSet: 21, ambient: 24 } } : node);
  const hpOffEdges = primaryEdges.concat([{ id: 's-hp', source: 'rt', target: 'hp', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }]);
  assert.equal(validateConnection(hpOffNodes, primaryEdges, 'rt', 'sig', 'hp', 'ctl').ok, true);
  assert.equal(computeOpenings({ nodes: hpOffNodes, edges: hpOffEdges, held: {} }).hp, 0);
  const hpStopped = simulate(hpOffNodes, hpOffEdges, computeOpenings({ nodes: hpOffNodes, edges: hpOffEdges, held: {} }));
  near(hpStopped.primaryFlowLph, 0, 1, 'a stopped heat pump does not circulate the primary loop');
  near(hpStopped.deliveredKw, 0, 0.05, 'a stopped heat pump adds no heat');
  const hpOnNodes = primaryNodes.map((node) => node.id === 'rt' ? { ...node, params: { roomSet: 21, ambient: 16 } } : node);
  assert.equal(computeOpenings({ nodes: hpOnNodes, edges: hpOffEdges, held: {} }).hp, 1);
  const shared = bothEdges.concat([{ id: 's-hp', source: 'rt', target: 'hp', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }]);
  assert.equal(validateConnection(diverted.nodes, bothEdges, 'rt', 'sig', 'hp', 'ctl').ok, true);
  const sharedWarm = computeOpenings({
    nodes: diverted.nodes.map((node) => node.id === 'rt' ? { ...node, params: { ...node.params, ambient: 24 } } : node),
    edges: shared,
    held: {},
  });
  assert.equal(sharedWarm.v3, 1);
  assert.equal(sharedWarm.p, 0);
  assert.equal(sharedWarm.hp, 0);
  const fanNodes: GraphNode[] = [...diverted.nodes, { id: 'v', componentId: 'valve', params: { opening: 100, controlMode: 0, manualOpen: 1 } }];
  const fanEdges = shared.concat([{ id: 's-v', source: 'rt', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }]);
  assert.equal(validateConnection(fanNodes, shared, 'rt', 'sig', 'v', 'ctl').ok, true);
  const fanWarm = computeOpenings({
    nodes: fanNodes.map((node) => node.id === 'rt' ? { ...node, params: { ...node.params, ambient: 24 } } : node),
    edges: fanEdges,
    held: {},
  });
  assert.equal(fanWarm.v, 0, 'one thermostat closes the two-way valve along with the pump and the heat pump');
  assert.equal(fanWarm.v3, 1);
  assert.equal(fanWarm.p, 0);
  assert.equal(fanWarm.hp, 0);

  function injectionCircuit(kind: 'tee' | 'junction' | 'manifold' | 'return-pump') {
    const nodes: GraphNode[] = [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
      { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
      { id: 'mv', componentId: 'mixer', params: { mix: 50 } },
      { id: 'p', componentId: 'pump', params: { speed: 60 } },
      { id: 'hk', componentId: 'radiator', params: { demand: 6 } },
      { id: 't', componentId: 'tee', params: {} },
    ];
    const edges: GraphEdge[] = [
      { id: 'e-hp-ps', source: 'hp', target: 'ps', sourceHandle: 'supply-out', targetHandle: 'pri-in' },
      { id: 'e-ps-hp', source: 'ps', target: 'hp', sourceHandle: 'pri-out', targetHandle: 'return-in' },
      { id: 'e-hot', source: 'ps', target: 'mv', sourceHandle: 'sec-out-1', targetHandle: 'h' },
      { id: 'e-back', source: 't', target: 'ps', sourceHandle: 'c', targetHandle: 'sec-in-1' },
    ];
    if (kind === 'return-pump') {
      edges.push(
        { id: 'e-loop', source: 'mv', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        { id: 'e-hk-p', source: 'hk', target: 'p', sourceHandle: 'return-out', targetHandle: 'in' },
        { id: 'e-p-t', source: 'p', target: 't', sourceHandle: 'out', targetHandle: 'a' },
        { id: 'e-recirc', source: 't', target: 'mv', sourceHandle: 'b', targetHandle: 'c' },
      );
    } else if (kind === 'junction') {
      nodes.push({ id: 'j', componentId: 'junction', params: {} });
      edges.push(
        { id: 'e-loop', source: 'mv', target: 'p', sourceHandle: 'out', targetHandle: 'in' },
        { id: 'e-p-hk', source: 'p', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        { id: 'e-hk-t', source: 'hk', target: 't', sourceHandle: 'return-out', targetHandle: 'a' },
        { id: 'e-t-j', source: 't', target: 'j', sourceHandle: 'b', targetHandle: 'w' },
        { id: 'e-recirc', source: 'j', target: 'mv', sourceHandle: 'e', targetHandle: 'c' },
      );
    } else if (kind === 'manifold') {
      nodes.push({ id: 'mr', componentId: 'manifold-return', params: { branches: 3 } });
      edges.push(
        { id: 'e-loop', source: 'mv', target: 'p', sourceHandle: 'out', targetHandle: 'in' },
        { id: 'e-p-hk', source: 'p', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        { id: 'e-hk-mr', source: 'hk', target: 'mr', sourceHandle: 'return-out', targetHandle: 'in-1' },
        { id: 'e-recirc', source: 'mr', target: 'mv', sourceHandle: 'in-2', targetHandle: 'c' },
        { id: 'e-mr-ps', source: 'mr', target: 'ps', sourceHandle: 'out', targetHandle: 'sec-in-1' },
      );
      const back = edges.findIndex((edge) => edge.id === 'e-back');
      edges.splice(back, 1);
    } else {
      edges.push(
        { id: 'e-loop', source: 'mv', target: 'p', sourceHandle: 'out', targetHandle: 'in' },
        { id: 'e-p-hk', source: 'p', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        { id: 'e-hk-t', source: 'hk', target: 't', sourceHandle: 'return-out', targetHandle: 'a' },
        { id: 'e-recirc', source: 't', target: 'mv', sourceHandle: 'b', targetHandle: 'c' },
      );
    }
    return { nodes, edges };
  }

  function assertInjection(kind: 'tee' | 'junction' | 'manifold' | 'return-pump') {
    const circuit = injectionCircuit(kind);
    let built: GraphEdge[] = [];
    for (const edge of circuit.edges) {
      const verdict = validateConnection(circuit.nodes, built, edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      assert.equal(verdict.ok, true, `${kind} ${edge.id} ${verdict.ok ? '' : verdict.code}`);
      built = built.concat(edge);
    }
    const sim = simulate(circuit.nodes, circuit.edges, computeOpenings({ nodes: circuit.nodes, edges: circuit.edges, held: {} }));
    assert.ok(!sim.issues.some((issue) => issue.level === 'warn' || issue.level === 'error'), `${kind} warnings ${sim.issues.map((issue) => issue.code).join(',')}`);
    const pumpFlow = sim.nodes.p?.flowLph ?? 0;
    const recirc = sim.edges['e-recirc']?.flowLph ?? 0;
    const drawn = sim.edges['e-hot']?.flowLph ?? 0;
    const returned = sim.edges[kind === 'manifold' ? 'e-mr-ps' : 'e-back']?.flowLph ?? 0;
    assert.ok(pumpFlow > 500, `${kind} pump flow ${pumpFlow}`);
    assert.ok(recirc > 50, `${kind} recirculation leg is idle (${recirc})`);
    near(recirc, pumpFlow * 0.5, 8, `${kind} recirculated flow`);
    near(drawn, pumpFlow * 0.5, 8, `${kind} buffer draw`);
    near(returned, drawn, 8, `${kind} buffer mass balance`);
    near(sim.secondaryFlowLph, drawn, 8, `${kind} secondary flow is the buffer exchange`);
    near(sim.nodes.hk?.flowLph ?? 0, pumpFlow, 8, `${kind} radiator sees the pump flow`);
    const hotEdge = sim.edges['e-hot'];
    const tHot = hotEdge ? (hotEdge.flowFromSource ? hotEdge.tSource : hotEdge.tTarget) : 0;
    const tMix = sim.nodes.mv?.tOut ?? 0;
    const tRad = sim.nodes.hk?.tOut ?? 0;
    assert.ok(tRad + 0.4 < tMix && tMix + 0.4 < tHot, `${kind} mix ${tMix} should sit between return ${tRad} and buffer ${tHot}`);
    assert.ok(Number.isFinite(sim.edges['e-recirc']?.tSource), `${kind} cold line has a temperature`);
    assert.ok((sim.deliveredKw ?? 0) > 1, `${kind} delivers heat`);
  }
  assertInjection('tee');
  assertInjection('junction');
  assertInjection('manifold');
  assertInjection('return-pump');

  function parallelBufferFloor(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: [
        { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
        { id: 't1', componentId: 'tee', params: {} },
        { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
        { id: 'fbh', componentId: 'underfloor', params: { demand: 3 } },
        { id: 't2', componentId: 'tee', params: {} },
      ],
      edges: [
        { id: 'e-hp-t1', source: 'hp', target: 't1', sourceHandle: 'supply-out', targetHandle: 'a' },
        { id: 'e-t1-ps', source: 't1', target: 'ps', sourceHandle: 'b', targetHandle: 'pri-in' },
        { id: 'e-t1-fbh', source: 't1', target: 'fbh', sourceHandle: 'c', targetHandle: 'supply-in' },
        { id: 'e-ps-t2', source: 'ps', target: 't2', sourceHandle: 'pri-out', targetHandle: 'a' },
        { id: 'e-fbh-t2', source: 'fbh', target: 't2', sourceHandle: 'return-out', targetHandle: 'b' },
        { id: 'e-t2-hp', source: 't2', target: 'hp', sourceHandle: 'c', targetHandle: 'return-in' },
      ],
    };
  }
  {
    const circuit = parallelBufferFloor();
    let built: GraphEdge[] = [];
    for (const edge of circuit.edges) {
      const verdict = validateConnection(circuit.nodes, built, edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      assert.equal(verdict.ok, true, `parallel ${edge.id} ${verdict.ok ? '' : verdict.code}`);
      built = built.concat(edge);
    }
    const sim = simulate(circuit.nodes, circuit.edges, computeOpenings({ nodes: circuit.nodes, edges: circuit.edges, held: {} }));
    assert.ok(!sim.issues.some((issue) => issue.level === 'warn' || issue.level === 'error'), `parallel warnings ${sim.issues.map((issue) => issue.code).join(',')}`);
    assert.equal(sim.mode, 'buffered');
    assert.equal(sim.ok, true);
    const branchPs = sim.edges['e-t1-ps']?.flowLph ?? 0;
    const branchFbh = sim.edges['e-t1-fbh']?.flowLph ?? 0;
    assert.ok(branchPs > 500, `buffer branch flows ${branchPs}`);
    assert.ok(branchFbh > 500, `floor branch flows ${branchFbh}`);
    near(branchPs, branchFbh, 5, 'parallel branches share the circulator equally');
    near(sim.nodes.fbh?.flowLph ?? 0, branchFbh, 5, 'floor heating sees its branch flow');
    near(sim.nodes.fbh?.qKw ?? 0, 3, 0.4, 'floor heating delivers its demand');
    assert.ok((sim.tankC ?? 0) > 35, `tank holds heat ${sim.tankC}`);
    near(sim.nodes.hp?.flowLph ?? 0, branchPs + branchFbh, 5, 'heat-pump mass balance');
    const tRet = sim.edges['e-t2-hp'] ? (sim.edges['e-t2-hp'].flowFromSource ? sim.edges['e-t2-hp'].tTarget : sim.edges['e-t2-hp'].tSource) : 0;
    near(tRet, sim.returnC ?? 0, 0.6, 'return shows the mixed temperature');
  }

  function valveLoop(opening: number, flip: boolean): ReturnType<typeof simulate> {
    const nodes: GraphNode[] = [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
      { id: 'p', componentId: 'pump', params: { speed: 70 } },
      { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening } },
      { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
    ];
    const edges: GraphEdge[] = flip ? [
      { id: 'a', source: 'hp', target: 'p', sourceHandle: 'supply-out', targetHandle: 'in' },
      { id: 'b', source: 'p', target: 'v', sourceHandle: 'out', targetHandle: 'out' },
      { id: 'c', source: 'v', target: 'hk', sourceHandle: 'in', targetHandle: 'supply-in' },
      { id: 'd', source: 'hk', target: 'hp', sourceHandle: 'return-out', targetHandle: 'return-in' },
    ] : [
      { id: 'a', source: 'hp', target: 'p', sourceHandle: 'supply-out', targetHandle: 'in' },
      { id: 'b', source: 'p', target: 'v', sourceHandle: 'out', targetHandle: 'in' },
      { id: 'c', source: 'v', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
      { id: 'd', source: 'hk', target: 'hp', sourceHandle: 'return-out', targetHandle: 'return-in' },
    ];
    for (const edge of edges) {
      assert.equal(validateConnection(nodes, [], edge.source, edge.sourceHandle, edge.target, edge.targetHandle).ok, true, `valve ${edge.id}`);
    }
    return simulate(nodes, edges, computeOpenings({ nodes, edges, held: {} }));
  }
  near(valveLoop(100, false).nodes.hk?.flowLph ?? 0, 1260, 5, 'valve passes flow when open');
  near(valveLoop(100, true).nodes.hk?.flowLph ?? 0, 1260, 5, 'reversed valve passes flow when open');
  near(valveLoop(0, false).nodes.hk?.flowLph ?? 0, 0, 1, 'valve still shuts its branch');
  near(valveLoop(0, true).nodes.hk?.flowLph ?? 0, 0, 1, 'reversed valve still shuts its branch');

  function tapCircuit(mix: number): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: [
        { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
        { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
        { id: 'mv', componentId: 'mixer', params: { mix } },
        { id: 'p2', componentId: 'pump', params: { speed: 60 } },
        { id: 'hk', componentId: 'radiator', params: { demand: 6 } },
      ],
      edges: [
        { id: 'e-hp-ps', source: 'hp', target: 'ps', sourceHandle: 'supply-out', targetHandle: 'pri-in' },
        { id: 'e-ps-hp', source: 'ps', target: 'hp', sourceHandle: 'pri-out', targetHandle: 'return-in' },
        { id: 'e-hot', source: 'ps', target: 'mv', sourceHandle: 'sec-out-1', targetHandle: 'h' },
        { id: 'e-loop', source: 'mv', target: 'p2', sourceHandle: 'out', targetHandle: 'in' },
        { id: 'e-p-hk', source: 'p2', target: 'hk', sourceHandle: 'out', targetHandle: 'supply-in' },
        { id: 'e-hk-ps', source: 'hk', target: 'ps', sourceHandle: 'return-out', targetHandle: 'sec-in-1' },
        { id: 'e-tap', source: 'ps', target: 'mv', sourceHandle: 'sec-in-2', targetHandle: 'c' },
      ],
    };
  }
  function assertTap(mix: number, hotShare: number, coldShare: number) {
    const circuit = tapCircuit(mix);
    let built: GraphEdge[] = [];
    for (const edge of circuit.edges) {
      const verdict = validateConnection(circuit.nodes, built, edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      assert.equal(verdict.ok, true, `tap mix=${mix} ${edge.id} ${verdict.ok ? '' : verdict.code}`);
      built = built.concat(edge);
    }
    const sim = simulate(circuit.nodes, circuit.edges, computeOpenings({ nodes: circuit.nodes, edges: circuit.edges, held: {} }));
    assert.equal(sim.mode, 'buffered');
    const pumpFlow = sim.nodes.p2?.flowLph ?? 0;
    assert.ok(pumpFlow > 500, `tap mix=${mix} pump flow ${pumpFlow}`);
    near(sim.edges['e-hot']?.flowLph ?? 0, pumpFlow * hotShare, 8, `tap mix=${mix} hot draw`);
    near(sim.edges['e-tap']?.flowLph ?? 0, pumpFlow * coldShare, 8, `tap mix=${mix} cold draw`);
    near(sim.edges['e-loop']?.flowLph ?? 0, pumpFlow, 8, `tap mix=${mix} loop flow`);
    near(sim.edges['e-hk-ps']?.flowLph ?? 0, pumpFlow, 8, `tap mix=${mix} loop return`);
    if (coldShare > 0) {
      assert.ok(Number.isFinite(sim.edges['e-tap']?.tSource), `tap mix=${mix} cold line has a temperature`);
      const tTap = sim.edges['e-tap']!.flowFromSource ? sim.edges['e-tap']!.tSource : sim.edges['e-tap']!.tTarget;
      near(tTap, sim.tankC ?? 0, 0.8, `tap mix=${mix} cold line is tank water`);
    }
  }
  assertTap(50, 0.5, 0.5);
  assertTap(100, 1, 0);

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

  const channel = (temp: number): [number, number, number] => {
    const match = temperatureColor(temp).match(/rgb\((\d+) (\d+) (\d+)\)/)!;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };
  let c = channel(25);
  assert.ok(c[2] > 180 && c[2] > c[0] + 60, `25C blue, got ${temperatureColor(25)}`);
  c = channel(30);
  assert.ok(c[2] > 180 && c[1] > 150, `30C light blue, got ${temperatureColor(30)}`);
  c = channel(35);
  assert.ok(c[1] > 150 && c[0] > 100 && c[2] < 200, `35C toward yellow, got ${temperatureColor(35)}`);
  c = channel(40);
  assert.ok(c[0] > 200 && c[1] > 120 && c[1] < 200 && c[2] < 100, `40C yellowish-orange, got ${temperatureColor(40)}`);
  c = channel(45);
  assert.ok(c[0] > 200 && c[1] >= 80 && c[1] <= 160 && c[2] < 80, `45C orange, got ${temperatureColor(45)}`);
  c = channel(50);
  assert.ok(c[0] > 200 && c[1] < 110 && c[2] < 60, `50C orange-red, got ${temperatureColor(50)}`);
  c = channel(55);
  assert.ok(c[0] > 190 && c[1] < 90 && c[2] < 60, `55C reddish, got ${temperatureColor(55)}`);
  c = channel(65);
  assert.ok(c[0] > 170 && c[1] < 70 && c[2] < 60, `65C intense red, got ${temperatureColor(65)}`);
  assert.equal(temperatureColor(75), 'rgb(153 27 27)', '75C dark red');
  assert.equal(temperatureColor(90), 'rgb(153 27 27)', 'above 75 clamps');
  assert.equal(temperatureColor(10), 'rgb(37 99 235)', 'below 25 clamps');
  let maxStep = 0;
  let prev = channel(20);
  for (let t = 20.5; t <= 80; t += 0.5) {
    const cur = channel(t);
    maxStep = Math.max(maxStep, ...cur.map((v, i) => Math.abs(v - prev[i])));
    prev = cur;
  }
  assert.ok(maxStep <= 16, `gradient step ${maxStep} is gradual`);

  // ---- Configurable heat up to 75 C through one shared limit. ----
  const setpoint = COMPONENTS.flatMap((def) => def.params).find((param) => param.id === 'setpoint');
  assert.ok(setpoint, 'heat pump setpoint exists');
  assert.equal(setpoint!.max, 75, 'setpoint accepts 75 C');
  assert.equal(setpoint!.min, 30, 'setpoint keeps its lower bound');
  const hot = structuredClone(direct);
  hot.nodes.find((node) => node.id === 'hp')!.params = { capacity: 12, setpoint: 75, internalPump: 1, internalSpeed: 100 };
  const boiled = simulate(hot.nodes, hot.edges);
  near(boiled.supplyC ?? 0, 75, 1.2, 'simulation holds a 75 C setpoint');

  // ---- Two-way valve: both hydraulic ports reachable without rotation. ----
  const valveDef = COMPONENTS.find((def) => def.id === 'valve');
  assert.ok(valveDef, 'two-way valve registered');
  const valveIn = valveDef!.ports.find((port) => port.id === 'in');
  const valveOut = valveDef!.ports.find((port) => port.id === 'out');
  assert.ok(valveIn && valveOut, 'valve has both hydraulic ports');
  assert.equal(valveIn!.x, 0, 'left port sits on the left edge');
  assert.equal(valveOut!.x, 1, 'right port sits on the right edge');
  assert.equal(valveIn!.y, valveOut!.y, 'ports share one pipe axis');
  const valveNodes: GraphNode[] = [
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
    { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 1, manualOpen: 1 } },
    { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
  ];
  assert.equal(validateConnection(valveNodes, [], 'hp', 'supply-out', 'v', 'in').ok, true, 'left port connects without rotation');
  assert.equal(validateConnection(valveNodes, [], 'v', 'out', 'ps', 'pri-in').ok, true, 'right port connects onward');

  // ---- Tank sonde registry, validation, and divert control. ----
  const sondeDef = COMPONENTS.find((def) => def.id === 'tank-sonde');
  assert.ok(sondeDef, 'tank sonde registered');
  assert.equal(sondeDef!.asset, '/studio/symbols/tank sonde.png', 'sonde reuses the shipped image');
  const senseIn = sondeDef!.ports.find((port) => port.id === 'sense');
  const sigOut = sondeDef!.ports.find((port) => port.id === 'sig');
  assert.ok(senseIn && senseIn.terminal === 'sense', 'sonde has a green measurement input');
  assert.ok(sigOut && sigOut.terminal === 'signal', 'sonde has a purple control output');
  for (const tank of ['buffer-tank', 'buffer-tank-3', 'buffer-tank-2', 'dhw-tank']) {
    const def = COMPONENTS.find((item) => item.id === tank);
    assert.ok(def && def.ports.some((port) => port.terminal === 'sense'), `${tank} exposes a measurement port`);
  }
  const sondeNodes: GraphNode[] = [
    { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
    { id: 'tws', componentId: 'dhw-tank', params: { demand: 3 } },
    { id: 'sn', componentId: 'tank-sonde', params: { tankSet: 45 } },
    { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
    { id: 'p', componentId: 'pump', params: { speed: 60 } },
    { id: 'hk', componentId: 'radiator', params: { demand: 3 } },
  ];
  assert.equal(validateConnection(sondeNodes, [], 'ps', 'sense', 'sn', 'sense').ok, true, 'buffer measurement reaches the sonde');
  assert.equal(validateConnection(sondeNodes, [], 'sn', 'sense', 'tws', 'sense').ok, true, 'either drag direction lands the measurement');
  assert.equal(validateConnection(sondeNodes, [], 'sn', 'sig', 'v3', 'ctl').ok, true, 'sonde drives the three-way valve');
  assert.equal(validateConnection(sondeNodes, [], 'sn', 'sig', 'p', 'ctl').ok, true, 'sonde drives the circulation pump');
  assert.equal(validateConnection(sondeNodes, [], 'hk', 'supply-in', 'sn', 'sense').ok, false, 'pipes cannot land on the measurement port');
  assert.equal(validateConnection(sondeNodes, [], 'ps', 'sense', 'hk', 'supply-in').ok, false, 'tanks cannot sense a heat user');

  function sondeCircuit(tankSet: number): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: [
        { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
        { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
        { id: 'p2', componentId: 'pump', params: { speed: 60 } },
        { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
        { id: 'hk', componentId: 'radiator', params: { demand: 5 } },
        { id: 'fbh', componentId: 'underfloor', params: { demand: 3 } },
        { id: 'tr', componentId: 'tee', params: {} },
        { id: 'sn', componentId: 'tank-sonde', params: { tankSet } },
      ],
      edges: [
        { id: 'e-hp-ps', source: 'hp', target: 'ps', sourceHandle: 'supply-out', targetHandle: 'pri-in' },
        { id: 'e-ps-hp', source: 'ps', target: 'hp', sourceHandle: 'pri-out', targetHandle: 'return-in' },
        { id: 'e-ps-p2', source: 'ps', target: 'p2', sourceHandle: 'sec-out-1', targetHandle: 'in' },
        { id: 'e-p2-v3', source: 'p2', target: 'v3', sourceHandle: 'out', targetHandle: 'ab' },
        { id: 'e-v3-hk', source: 'v3', target: 'hk', sourceHandle: 'a', targetHandle: 'supply-in' },
        { id: 'e-v3-fbh', source: 'v3', target: 'fbh', sourceHandle: 'b', targetHandle: 'supply-in' },
        { id: 'e-hk-tr', source: 'hk', target: 'tr', sourceHandle: 'return-out', targetHandle: 'b' },
        { id: 'e-fbh-tr', source: 'fbh', target: 'tr', sourceHandle: 'return-out', targetHandle: 'c' },
        { id: 'e-tr-ps', source: 'tr', target: 'ps', sourceHandle: 'a', targetHandle: 'sec-in-1' },
        { id: 'm-ps-sn', source: 'ps', target: 'sn', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
        { id: 's-sn-v3', source: 'sn', target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
      ],
    };
  }
  {
    const circuit = sondeCircuit(45);
    let built: GraphEdge[] = [];
    for (const edge of circuit.edges) {
      const verdict = validateConnection(circuit.nodes, built, edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      assert.equal(verdict.ok, true, `sonde circuit ${edge.id} ${verdict.ok ? '' : verdict.code}`);
      built = built.concat(edge);
    }
  }
  // The default 45 C target sits above the mixed tank, so the valve holds port A;
  // a 35 C target sits below it, so the same water diverts to port B.
  const coolTarget = sondeCircuit(45);
  const settledA = simulate(coolTarget.nodes, coolTarget.edges, computeOpenings({ nodes: coolTarget.nodes, edges: coolTarget.edges, held: {} }));
  assert.equal(settledA.ok, true, settledA.issues.map((issue) => issue.code).join(','));
  const tankAfterA = settledA.tankC ?? 0;
  assert.ok(tankAfterA > 30 && tankAfterA < 45, `mixed tank settles below target, was ${tankAfterA}`);
  const reopenA = computeOpenings({ nodes: coolTarget.nodes, edges: coolTarget.edges, held: {}, result: settledA });
  assert.equal(reopenA.v3, 0, 'a cool tank holds the default port');
  near(settledA.nodes.hk?.flowLph ?? 0, settledA.secondaryFlowLph, 8, 'port A feeds the radiator');
  near(settledA.nodes.fbh?.flowLph ?? 0, 0, 1, 'port B is idle below target');
  assert.ok(Number.isFinite(settledA.nodes.sn?.tIn ?? Number.NaN), 'the sonde publishes its reading');

  const warmTarget = sondeCircuit(35);
  const settledB = simulate(warmTarget.nodes, warmTarget.edges, computeOpenings({ nodes: warmTarget.nodes, edges: warmTarget.edges, held: {} }));
  const reopenB = computeOpenings({ nodes: warmTarget.nodes, edges: warmTarget.edges, held: {}, result: settledB });
  assert.equal(reopenB.v3, 1, 'a tank at target diverts to the alternative port');
  const switched = simulate(warmTarget.nodes, warmTarget.edges, reopenB);
  near(switched.nodes.fbh?.flowLph ?? 0, switched.secondaryFlowLph, 8, 'port B feeds the floor loop after the switch');
  near(switched.nodes.hk?.flowLph ?? 0, 0, 1, 'port A is idle after the switch');
  near(switched.nodes.sn?.tIn ?? 0, switched.tankC ?? 0, 0.6, 'the sonde reads the tank it is tied to');

  // A disconnected sonde never guesses: the valve keeps its manual port.
  const orphan = sondeCircuit(35);
  const orphanEdges = orphan.edges.filter((edge) => edge.id !== 'm-ps-sn');
  const orphanOpen = computeOpenings({ nodes: orphan.nodes, edges: orphanEdges, held: {} });
  assert.equal(orphanOpen.v3, 0, 'without a measurement the toggle stays in charge');
  const orphanSim = simulate(orphan.nodes, orphanEdges, orphanOpen);
  assert.ok(!('sn' in orphanSim.nodes) || !Number.isFinite(orphanSim.nodes.sn?.tIn ?? Number.NaN), 'no reading without a tank link');

  // ---- Return-circuit pipes stay attachable from either end.
  // A pipe between two inlet (`in`) ports — lower two-way valve `in` and
  // heat-pump `return-in` — must validate in both drag directions and carry
  // simulated flow. (ReactFlow only resolves an edge's source handle against
  // source-type handles, so every studio handle registers as `source`; see
  // HydronicNode. Without that, this exact link validated and simulated yet
  // never painted.)
  const loopNodes: GraphNode[] = [
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
    { id: 'v1', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 1, manualOpen: 1 } },
    { id: 'ps', componentId: 'buffer-tank-2', params: { volume: 200 } },
    { id: 'v2', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 1, manualOpen: 1 } },
  ];
  const loopEdges: GraphEdge[] = [
    { id: 'e-hp-v1', source: 'hp', target: 'v1', sourceHandle: 'supply-out', targetHandle: 'in' },
    { id: 'e-v1-ps', source: 'v1', target: 'ps', sourceHandle: 'out', targetHandle: 'pri-in' },
    { id: 'e-ps-v2', source: 'ps', target: 'v2', sourceHandle: 'pri-out', targetHandle: 'out' },
    { id: 'e-v2-hp', source: 'v2', target: 'hp', sourceHandle: 'in', targetHandle: 'return-in' },
  ];
  {
    let built: GraphEdge[] = [];
    for (const edge of loopEdges) {
      const verdict = validateConnection(loopNodes, built, edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
      assert.equal(verdict.ok, true, `return loop ${edge.id} ${verdict.ok ? '' : verdict.code}`);
      built = built.concat(edge);
    }
  }
  assert.equal(validateConnection(loopNodes, loopEdges.slice(0, 3), 'hp', 'return-in', 'v2', 'in').ok, true, 'the return link validates in the reverse drag direction');
  // A static solve starts the tank at room temperature (supply then sits one
  // primary ΔT above it); a charged tank is the running-state fixture.
  const looped = simulate(loopNodes, loopEdges, computeOpenings({ nodes: loopNodes, edges: loopEdges, held: {} }), { tankC: 44 });
  assert.equal(looped.ok, true, looped.issues.map((issue) => issue.code).join(','));
  near(looped.supplyC ?? 0, 45, 0.8, 'supply holds across both inline valves');
  for (const edge of loopEdges) {
    assert.ok((looped.edges[edge.id]?.flowLph ?? 0) > 500, `${edge.id} carries the primary flow`);
  }

  // ---- Live body/zone temperatures: +2 C per simulated second of flow. ----
  assert.equal(THERMAL_HEAT_RATE, 2, 'documented heating rate');
  assert.ok(isThermalNode('dhw-tank') && isThermalNode('buffer-tank') && isThermalNode('radiator')
    && isThermalNode('underfloor') && isThermalNode('fancoil'), 'tanks and consumers all tracked');
  assert.ok(!isThermalNode('heat-pump') && !isThermalNode('valve') && !isThermalNode('thermostat'), 'only heated bodies tracked');
  const dhwLoop: { nodes: GraphNode[]; edges: GraphEdge[] } = {
    nodes: [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
      { id: 'tws', componentId: 'dhw-tank', params: { demand: 3 } },
    ],
    edges: [
      { id: 'e-hp-tws', source: 'hp', target: 'tws', sourceHandle: 'supply-out', targetHandle: 'supply-in' },
      { id: 'e-tws-hp', source: 'tws', target: 'hp', sourceHandle: 'return-out', targetHandle: 'return-in' },
    ],
  };
  const dhwSim = simulate(dhwLoop.nodes, dhwLoop.edges, computeOpenings({ nodes: dhwLoop.nodes, edges: dhwLoop.edges, held: {} }));
  assert.ok((dhwSim.nodes.tws?.flowLph ?? 0) > FLOW_ACTIVE_LPH, 'dhw sees active circulation');
  let heat: Record<string, number> = {};
  heat = advanceThermal(heat, dhwLoop.nodes, dhwSim, 1);
  near(heat.tws ?? 0, 2, 1e-9, 'one second of flow adds 2 C');
  heat = advanceThermal(heat, dhwLoop.nodes, dhwSim, 4);
  near(heat.tws ?? 0, 10, 1e-9, 'five seconds of flow reach 10 C from zero');
  heat = advanceThermal(heat, dhwLoop.nodes, dhwSim, 100);
  near(heat.tws ?? 0, 45, 1e-9, 'a tank never passes its heat source');
  assert.equal(advanceThermal(heat, [], dhwSim, 10), heat, 'no tracked nodes keeps the record untouched');

  // A disconnected tank resets to zero: no flow, no heating.
  const drySim = simulate(dhwLoop.nodes, []);
  const seeded = advanceThermal({}, dhwLoop.nodes, drySim, 1);
  near(seeded.tws ?? 0, 0, 1e-9, 'a tank rests at zero without flow');
  assert.equal(advanceThermal(seeded, dhwLoop.nodes, drySim, 5), seeded, 'without flow the temperature stays at zero');
  const cooling = advanceThermal({ tws: 24 }, dhwLoop.nodes, drySim, 1);
  near(cooling.tws ?? -1, 0, 1e-9, 'losing flow resets a heated body to zero');

  // Heating consumers warm their zones the same way, capped by the source.
  const radLoop: { nodes: GraphNode[]; edges: GraphEdge[] } = {
    nodes: [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
      { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
    ],
    edges: [
      { id: 'e-hp-hk', source: 'hp', target: 'hk', sourceHandle: 'supply-out', targetHandle: 'supply-in' },
      { id: 'e-hk-hp', source: 'hk', target: 'hp', sourceHandle: 'return-out', targetHandle: 'return-in' },
    ],
  };
  const radSim = simulate(radLoop.nodes, radLoop.edges, computeOpenings({ nodes: radLoop.nodes, edges: radLoop.edges, held: {} }));
  let zone: Record<string, number> = advanceThermal({}, radLoop.nodes, radSim, 2);
  near(zone.hk ?? 0, 4, 1e-9, 'two seconds of flow lift a zone from 0 C to 4 C');
  zone = advanceThermal(zone, radLoop.nodes, radSim, 1000);
  near(zone.hk ?? 0, 45, 1e-9, 'a zone never passes its heat source');

  // ---- Measurement validation: tanks pair with sondes, consumers with thermostats. ----
  const senseNodes: GraphNode[] = [
    { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
    { id: 'tws', componentId: 'dhw-tank', params: { demand: 3 } },
    { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
    { id: 'fc', componentId: 'fancoil', params: { demand: 2.5 } },
    { id: 'fbh', componentId: 'underfloor', params: { demand: 3 } },
    { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 16 } },
    { id: 'sn', componentId: 'tank-sonde', params: { tankSet: 45 } },
    { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 0, manualOpen: 1 } },
    { id: 'p', componentId: 'pump', params: { speed: 60 } },
    { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
  ];
  for (const consumer of ['hk', 'fc', 'fbh']) {
    assert.equal(validateConnection(senseNodes, [], consumer, 'sense', 'rt', 'sense').ok, true, `${consumer} measurement reaches the thermostat`);
    assert.equal(validateConnection(senseNodes, [], 'rt', 'sense', consumer, 'sense').ok, true, `${consumer} links in the reverse drag direction`);
    assert.equal(validateConnection(senseNodes, [], consumer, 'sense', 'sn', 'sense').ok, true, `${consumer} measurement reaches the tank sonde`);
  }
  assert.equal(validateConnection(senseNodes, [], 'sn', 'sense', 'hk', 'sense').ok, true, 'either drag direction lands a consumer measurement');
  assert.equal(validateConnection(senseNodes, [], 'ps', 'sense', 'rt', 'sense').ok, false, 'tanks cannot sense a thermostat');
  assert.equal(validateConnection(senseNodes, [], 'tws', 'sense', 'rt', 'sense').ok, false, 'dhw pairs with a sonde, not a thermostat');
  assert.equal(validateConnection(senseNodes, [], 'hk', 'supply-in', 'rt', 'sense').ok, false, 'pipes cannot land on a measurement port');
  assert.equal(validateConnection(senseNodes, [], 'sn', 'sig', 'v', 'ctl').ok, true, 'a sonde drives a two-way valve');
  assert.equal(validateConnection(senseNodes, [], 'sn', 'sig', 'p', 'ctl').ok, true, 'a sonde drives a circulation pump');
  assert.equal(validateConnection(senseNodes, [], 'sn', 'sig', 'hp', 'ctl').ok, false, 'a sonde never drives the heat pump');

  // ---- Sonde actuation from live temperatures: valves and pumps. ----
  const tankPair: GraphNode[] = [
    { id: 'ps', componentId: 'buffer-tank', params: { volume: 200 } },
    { id: 'sn', componentId: 'tank-sonde', params: { tankSet: 45 } },
    { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 0, manualOpen: 1 } },
  ];
  const halfPair = tankPair.map((node) => node.id === 'v' ? { ...node, params: { ...node.params, opening: 50 } } : node);
  const tankSense: GraphEdge[] = [
    { id: 'm', source: 'ps', target: 'sn', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
  ];
  const sondeToValve: GraphEdge[] = [...tankSense, { id: 's', source: 'sn', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }];
  assert.equal(computeOpenings({ nodes: tankPair, edges: sondeToValve, held: {}, temps: { ps: 30 } }).v, 1, 'a cool tank holds the valve open');
  assert.equal(computeOpenings({ nodes: halfPair, edges: sondeToValve, held: {}, temps: { ps: 30 } }).v, 0.5, 'the opening percentage still applies');
  assert.equal(computeOpenings({ nodes: tankPair, edges: sondeToValve, held: {}, temps: { ps: 45 } }).v, 0, 'the valve shuts at the target');
  assert.equal(computeOpenings({ nodes: tankPair, edges: [{ id: 's', source: 'sn', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }], held: {} }).v, 1, 'without a measurement the toggle stays in charge');

  const pumpPair: GraphNode[] = [...tankPair, { id: 'p', componentId: 'pump', params: { speed: 60 } }];
  const sondeToPump: GraphEdge[] = [...tankSense, { id: 's', source: 'sn', target: 'p', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }];
  assert.equal(computeOpenings({ nodes: pumpPair, edges: sondeToPump, held: {}, temps: { ps: 30 } }).p, 0, 'a buffer-fed pump stays OFF while the buffer is cold');
  assert.equal(computeOpenings({ nodes: pumpPair, edges: sondeToPump, held: { p: 0 }, temps: { ps: 45 } }).p, 1, 'the buffer-fed pump turns ON at the target');
  assert.equal(computeOpenings({ nodes: pumpPair, edges: sondeToPump, held: { p: 1 }, temps: { ps: 44 } }).p, 1, 'hysteresis holds the pump ON just below target');
  assert.equal(computeOpenings({ nodes: pumpPair, edges: sondeToPump, held: { p: 1 }, temps: { ps: 40 } }).p, 0, 'the pump drops OFF below the restart threshold');
  assert.ok(!('p' in computeOpenings({ nodes: pumpPair, edges: [{ id: 's', source: 'sn', target: 'p', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' }], held: {} })), 'without a measurement the pump follows its speed');

  // ---- Thermostat actuation from a measured zone, with ambient fallback. ----
  const zoneNodes: GraphNode[] = [
    { id: 'rt', componentId: 'thermostat', params: { roomSet: 21, ambient: 16 } },
    { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
    { id: 'v', componentId: 'valve', params: { behavior: 0, motorized: 0, opening: 100, controlMode: 0, manualOpen: 1 } },
    { id: 'p', componentId: 'pump', params: { speed: 60 } },
    { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
  ];
  const zoneWires: GraphEdge[] = [
    { id: 'm', source: 'hk', target: 'rt', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
    { id: 's-v', source: 'rt', target: 'v', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
    { id: 's-p', source: 'rt', target: 'p', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
    { id: 's-v3', source: 'rt', target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
  ];
  const coolZone = computeOpenings({ nodes: zoneNodes, edges: zoneWires, held: {}, temps: { hk: 18 } });
  assert.equal(coolZone.v, 1, 'a cool zone holds the valve open');
  assert.equal(coolZone.p, 1, 'a cool zone runs the pump');
  assert.equal(coolZone.v3, 0, 'a cool zone keeps the default port');
  const warmZone = computeOpenings({ nodes: zoneNodes, edges: zoneWires, held: {}, temps: { hk: 24 } });
  assert.equal(warmZone.v, 0, 'the valve closes at the room setpoint');
  assert.equal(warmZone.p, 0, 'the pump stops at the room setpoint');
  assert.equal(warmZone.v3, 1, 'the valve diverts at the room setpoint');
  const noReading = computeOpenings({ nodes: zoneNodes, edges: zoneWires, held: {}, temps: {} });
  assert.equal(noReading.v3, 0, 'without a zone reading the ambient numbers still decide');

  // ---- Interchangeable purple command inputs on the three-way valve. ----
  function dualBranchCircuit(wireA: 'snA' | 'snB', wireB: 'snA' | 'snB'): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 } },
      { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
      { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
      { id: 'tws', componentId: 'dhw-tank', params: { demand: 3 } },
      { id: 'snA', componentId: 'tank-sonde', params: { tankSet: 40 } },
      { id: 'snB', componentId: 'tank-sonde', params: { tankSet: 40 } },
    ];
    const edges: GraphEdge[] = [
      { id: 'e-a', source: 'v3', target: 'hk', sourceHandle: 'a', targetHandle: 'supply-in' },
      { id: 'e-b', source: 'v3', target: 'tws', sourceHandle: 'b', targetHandle: 'supply-in' },
      { id: 'm-a', source: 'hk', target: 'snA', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
      { id: 'm-b', source: 'tws', target: 'snB', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
      { id: 's-a', source: wireA, target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
      { id: 's-b', source: wireB, target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl2', kind: 'signal' },
    ];
    return { nodes, edges };
  }
  // Test A/B: a single sonde behaves identically on the left vs right purple input.
  for (const handle of ['ctl', 'ctl2'] as const) {
    const nodes: GraphNode[] = [
      { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
      { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
      { id: 'sn', componentId: 'tank-sonde', params: { tankSet: 40 } },
    ];
    const edges: GraphEdge[] = [
      { id: 'm', source: 'hk', target: 'sn', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
      { id: 's', source: 'sn', target: 'v3', sourceHandle: 'sig', targetHandle: handle, kind: 'signal' },
    ];
    assert.equal(computeOpenings({ nodes, edges, held: {}, temps: { hk: 20 } }).v3, 0, `single sonde on ${handle} holds A below target`);
    assert.equal(computeOpenings({ nodes, edges, held: {}, temps: { hk: 45 } }).v3, 1, `single sonde on ${handle} diverts to B at target`);
    assert.equal(computeOpenings({ nodes, edges, held: { v3: 1 }, temps: { hk: 20 } }).v3, 0, `single sonde on ${handle} returns B->A when cool`);
  }
  // Test C: both purple ports connected; wiring order must not matter.
  for (const [wireA, wireB] of [['snA', 'snB'], ['snB', 'snA']] as const) {
    const { nodes, edges } = dualBranchCircuit(wireA, wireB);
    assert.equal(
      computeOpenings({ nodes, edges, held: {}, temps: { hk: 20, tws: 20 } }).v3, 0,
      `dual sondes (${wireA}/ctl) seed to A when cold`,
    );
    assert.equal(
      computeOpenings({ nodes, edges, held: { v3: 0 }, temps: { hk: 45, tws: 20 } }).v3, 1,
      `dual sondes (${wireA}/ctl) switch A->B when the A branch reaches target`,
    );
    assert.equal(
      computeOpenings({ nodes, edges, held: { v3: 0 }, temps: { hk: 20, tws: 45 } }).v3, 0,
      `dual sondes (${wireA}/ctl) ignore a stale hot reading on the inactive B branch`,
    );
    assert.equal(
      computeOpenings({ nodes, edges, held: { v3: 1 }, temps: { hk: 45, tws: 45 } }).v3, 0,
      `dual sondes (${wireA}/ctl) switch B->A when the B branch reaches target`,
    );
    assert.equal(
      computeOpenings({ nodes, edges, held: { v3: 1 }, temps: { hk: 20, tws: 20 } }).v3, 1,
      `dual sondes (${wireA}/ctl) hold B while the B branch still needs heat`,
    );
  }
  // Test D/E: a stale manual port never overrides sensor AUTO.
  {
    const { nodes, edges } = dualBranchCircuit('snA', 'snB');
    const staleManual = nodes.map((node) => node.id === 'v3' ? { ...node, params: { controlMode: 1, manualPort: 1 } } : node);
    assert.equal(computeOpenings({ nodes: staleManual, edges, held: {}, temps: { hk: 20, tws: 20 } }).v3, 0, 'sensor AUTO seeds A despite a stored manual B');
    assert.equal(computeOpenings({ nodes: staleManual, edges, held: {}, temps: { hk: 45, tws: 20 } }).v3, 1, 'sensor AUTO still switches despite Manual mode stored');
    assert.equal(computeOpenings({ nodes: staleManual, edges, held: { v3: 1 }, temps: { hk: 20, tws: 20 } }).v3, 1, 'AUTO never re-forces A once B is active');
    assert.equal(computeOpenings({ nodes: staleManual, edges: [], held: { v3: 1 } }).v3, 1, 'with purple removed the preserved outlet is held');
  }
  // Full dual-temperature cycle: radiator (24 C target) on Port A, DHW tank
  // (40 C target) on Port B, both purple inputs driven. Mirrors the live
  // StudioApp evaluation (fresh-start body seeding to 0 C, two-pass solve,
  // committed held memory, 1 s thermal steps at 2 C/s). Expected timeline:
  // A first, A->B at 12 s, B->A at 32 s, A->B at 44 s, B->A at 64 s, A->B at 76 s.
  function dualCycleCircuit(wireA: 'snA' | 'snB', wireB: 'snA' | 'snB'): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
      { id: 'hp', componentId: 'heat-pump', params: { capacity: 12, setpoint: 45, internalPump: 0, internalSpeed: 0 } },
      { id: 'p', componentId: 'pump', params: { speed: 70 } },
      { id: 'v3', componentId: 'valve-3way', params: { controlMode: 0, manualPort: 0 } },
      { id: 'hk', componentId: 'radiator', params: { demand: 4 } },
      { id: 'tws', componentId: 'dhw-tank', params: { demand: 3 } },
      { id: 'tr', componentId: 'tee', params: {} },
      { id: 'snA', componentId: 'tank-sonde', params: { tankSet: 24 } },
      { id: 'snB', componentId: 'tank-sonde', params: { tankSet: 40 } },
    ];
    const pipe = (id: string, source: string, sh: string, target: string, th: string): GraphEdge =>
      ({ id, source, sourceHandle: sh, target, targetHandle: th, kind: 'pipe' });
    const edges: GraphEdge[] = [
      pipe('e-hp-p', 'hp', 'supply-out', 'p', 'in'),
      pipe('e-p-v3', 'p', 'out', 'v3', 'ab'),
      pipe('e-v3-hk', 'v3', 'a', 'hk', 'supply-in'),
      pipe('e-v3-tws', 'v3', 'b', 'tws', 'supply-in'),
      pipe('e-hk-tr', 'hk', 'return-out', 'tr', 'b'),
      pipe('e-tws-tr', 'tws', 'return-out', 'tr', 'c'),
      pipe('e-tr-hp', 'tr', 'a', 'hp', 'return-in'),
      { id: 'm-a', source: 'hk', target: 'snA', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
      { id: 'm-b', source: 'tws', target: 'snB', sourceHandle: 'sense', targetHandle: 'sense', kind: 'sense' },
      { id: 's-a', source: wireA, target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl', kind: 'signal' },
      { id: 's-b', source: wireB, target: 'v3', sourceHandle: 'sig', targetHandle: 'ctl2', kind: 'signal' },
    ];
    return { nodes, edges };
  }
  function runDualCycle(wireA: 'snA' | 'snB', wireB: 'snA' | 'snB'): { at: number; to: string }[] {
    const { nodes, edges } = dualCycleCircuit(wireA, wireB);
    let thermal: Record<string, number> = { hk: 0, tws: 0 };
    let held: Record<string, number> = {};
    let result: ReturnType<typeof simulate> | null = null;
    const switches: { at: number; to: string }[] = [];
    let last = -1;
    for (let t = 0; t <= 80; t++) {
      const input = { nodes, edges, held, temps: thermal };
      const first = computeOpenings({ ...input, result });
      let solved = simulate(nodes, edges, first);
      const second = computeOpenings({ ...input, result: solved });
      let openings = first;
      if (Object.keys(second).some((id) => second[id] !== first[id])) {
        solved = simulate(nodes, edges, second);
        openings = second;
      }
      result = solved;
      held = { ...openings };
      const v3 = openings.v3 ?? -1;
      if (last !== -1 && v3 !== last) switches.push({ at: t, to: v3 === 0 ? 'A' : 'B' });
      last = v3;
      thermal = advanceThermal(thermal, nodes, result, 1);
    }
    return switches;
  }
  const expectedCycle = [
    { at: 12, to: 'B' },
    { at: 32, to: 'A' },
    { at: 44, to: 'B' },
    { at: 64, to: 'A' },
    { at: 76, to: 'B' },
  ];
  for (const [wireA, wireB] of [['snA', 'snB'], ['snB', 'snA']] as const) {
    const switches = runDualCycle(wireA, wireB);
    assert.deepEqual(switches, expectedCycle, `full dual cycle alternates A->B->A->B with identical timing on either purple wiring (${wireA}/ctl)`);
  }
  // Heat-pump restart debounce: only a sustained OFF arms a genuine restart.
  assert.equal(isGenuineHpRestart(undefined, 1, 5000), false, 'first ON is not a restart');
  assert.equal(isGenuineHpRestart(1, 1, 5000), false, 'sustained ON is not a restart');
  assert.equal(isGenuineHpRestart(0, 0, 5000), false, 'sustained OFF is not a restart');
  assert.equal(isGenuineHpRestart(0, 1, 50), false, 'micro-OFF blip must not wipe the warm-up ramp');
  assert.equal(isGenuineHpRestart(0, 1, HP_RESTART_DEBOUNCE_MS), true, 'sustained OFF followed by ON restarts the ramp');
  assert.equal(isGenuineHpRestart(0, 1, 30000), true, 'long user-driven OFF followed by ON restarts the ramp');

  console.log('PASS studio simulation and connection rules');
}

main();
