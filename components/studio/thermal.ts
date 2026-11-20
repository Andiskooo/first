import { isBufferId, isHeatPumpId, isHeatingConsumerId } from '@/components/studio/registry';
import { MAX_SUPPLY_C, clamp } from '@/components/studio/temperature';
import type { GraphNode, SimResult } from '@/components/studio/types';

/**
 * Simplified educational heating dynamics. While hot water actively
 * circulates through a tank or heating consumer, its body/zone temperature
 * rises at a fixed rate per simulated second. No flow means no heating, and
 * there is no cool-down in this iteration: temperatures simply hold still.
 */

/** Degrees gained per simulated second of active hot-water circulation. */
export const THERMAL_HEAT_RATE = 3;
/** Rest temperature a tank starts from before it first sees flow. */
export const THERMAL_TANK_START = 30;
/** Rest temperature a heating zone starts from before it first sees flow. */
export const THERMAL_ZONE_START = 18;
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

function seedTemp(node: GraphNode): number {
  // Tanks rest cold and zones rest cool until flow first reaches them, so a
  // fresh run always climbs the documented 30 → 45 °C in five seconds.
  if (isBufferId(node.componentId) || node.componentId === 'dhw-tank') return THERMAL_TANK_START;
  return THERMAL_ZONE_START;
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
    const value = heated ? Math.min(cap, base + step) : base;
    if (stored === undefined || Math.abs(value - stored) > 1e-9) {
      if (!next) next = { ...prev };
      next[id] = value;
    }
  }
  return next ?? prev;
}
