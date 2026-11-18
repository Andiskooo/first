import assert from 'node:assert/strict';
import { buildExample } from '../components/studio/example';
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

  console.log('PASS studio simulation and connection rules');
}

main();
