import { isBufferId, isHeatPumpId, isHeatingConsumerId } from '@/components/studio/registry';
import { MAX_SUPPLY_C, clamp } from '@/components/studio/temperature';
import type { GraphNode, SimResult } from '@/components/studio/types';

/**
 * Simplified educational heating dynamics. While hot water actively
 * circulates through a tank or heating consumer, its body/zone temperature
 * rises at a fixed rate per simulated second. The moment active circulation
 * stops, the body resets to 0 C (an intentional teaching rule, not physical
 * cooling), so the next heating cycle always starts from zero.
 */

/** Degrees gained per simulated second of active hot-water circulation. */
export const THERMAL_HEAT_RATE = 2;
/** Rest temperature a tank starts from before it first sees flow. */
export const THERMAL_TANK_START = 0;
/** Rest temperature a heating zone starts from before it first sees flow. */
export const THERMAL_ZONE_START = 0;
/** Flow above this counts as active circulation. */
export const FLOW_ACTIVE_LPH = 1;

/** A tank or heating consumer carries one dynamic body/zone temperature. */
export function isThermalNode(componentId: string): boolean {
  return componentId === 'dhw-tank' || isBufferId(componentId) || isHeatingConsumerId(componentId);
}

/** Nothing can heat past the heat source; without one the global cap applies. */
function heatCap(nodes: GraphNode[]): number {
  const hp = nodes.find((node) => isHeatPumpId(node.componentId));
  return clamp(hp?.params.setpoint ?? MAX_SUPPLY_C, 0, MAX_SUPPLY_C);
}

function seedTemp(_node: GraphNode): number {
  // Every heat user rests at 0 C until flow first reaches it. Inactive
  // branches reset to the same value, so each heating cycle restarts at 0 C.
  void _node;
  return 0;
}

/**
 * Advances dynamic temperatures by `dtSec` simulated seconds. Only nodes
 * with active hydraulic flow gain temperature, capped at the heat source.
 * Returns the previous record untouched when nothing changes, so callers
 * can skip re-renders.
 */
export function advanceThermal(
  prev: Record<string, number>,
  nodes: GraphNode[],
  result: SimResult,
  dtSec: number,
): Record<string, number> {
  if (!(dtSec > 0)) return prev;
  const cap = heatCap(nodes);
  const step = THERMAL_HEAT_RATE * dtSec;
  let next: Record<string, number> | null = null;
  for (const node of nodes) {
    if (!isThermalNode(node.componentId)) continue;
    const id = node.id;
    const stored = prev[id];
    const base = stored ?? Math.min(seedTemp(node), cap);
    const heated = (result.nodes[id]?.flowLph ?? 0) > FLOW_ACTIVE_LPH;
    // Losing active circulation resets the body to 0 C immediately. The
    // finalized hydraulic flow state is the source of truth: callers pass the
    // committed solve, never an intermediate valve-transition state.
    const value = heated ? Math.min(cap, base + step) : 0;
    if (stored === undefined || Math.abs(value - stored) > 1e-9) {
      if (!next) next = { ...prev };
      next[id] = value;
    }
  }
  return next ?? prev;
}
