import { getComponent } from '@/components/studio/registry';
import type { GraphEdge, GraphNode } from '@/components/studio/types';

export interface SavedSystemNode extends GraphNode {
  x: number;
  y: number;
  rotation: number;
  size?: { width: number; height: number };
}

export interface SavedSystem {
  id: string;
  name: string;
  createdAt: number;
  nodes: SavedSystemNode[];
  edges: GraphEdge[];
}

const STORAGE_KEY = 'ecotek.studio.savedSystems.v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readRaw(): SavedSystem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedSystem);
  } catch {
    return [];
  }
}

function isSavedSystem(value: unknown): value is SavedSystem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.name === 'string'
    && Array.isArray(item.nodes)
    && Array.isArray(item.edges);
}

function writeRaw(systems: SavedSystem[]): void {
  if (!isBrowser()) throw new Error('storage-unavailable');
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
}

/** All user-saved systems, newest last. Corrupted entries are skipped, never thrown. */
export function listSavedSystems(): SavedSystem[] {
  return readRaw();
}

export function getSavedSystem(id: string): SavedSystem | null {
  return readRaw().find((item) => item.id === id) ?? null;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `saved-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

/**
 * Persist the current canvas configuration (components, positions, settings,
 * and all pipe/sense/signal connections). Throws on storage failure so the
 * caller can keep the canvas untouched and show an error.
 */
export function saveSystem(name: string, nodes: SavedSystemNode[], edges: GraphEdge[]): SavedSystem {
  const label = name.trim();
  if (!label) throw new Error('name-required');
  if (!nodes.length) throw new Error('empty-canvas');
  // Drop transient UI state; keep everything needed to rebuild the system.
  const cleanNodes: SavedSystemNode[] = nodes.map((node) => ({
    id: node.id,
    componentId: node.componentId,
    params: { ...(node.params ?? {}) },
    x: node.x,
    y: node.y,
    rotation: node.rotation ?? 0,
    ...(node.size ? { size: { ...node.size } } : {}),
  }));
  const cleanEdges: GraphEdge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    kind: edge.kind ?? 'pipe',
  }));
  const system: SavedSystem = { id: newId(), name: label, createdAt: Date.now(), nodes: cleanNodes, edges: cleanEdges };
  const systems = readRaw();
  systems.push(system);
  try {
    writeRaw(systems);
  } catch {
    throw new Error('storage-failed');
  }
  return system;
}

export function deleteSavedSystem(id: string): void {
  try {
    writeRaw(readRaw().filter((item) => item.id !== id));
  } catch {
    throw new Error('storage-failed');
  }
}

/** Validate a saved payload before loading: unknown components or broken links. */
export function validateSavedSystem(system: SavedSystem): { ok: true } | { ok: false; code: string } {
  if (!system.nodes.length) return { ok: false, code: 'empty-canvas' };
  const ids = new Set(system.nodes.map((node) => node.id));
  for (const node of system.nodes) {
    if (!getComponent(node.componentId)) return { ok: false, code: 'unknown-component' };
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return { ok: false, code: 'corrupt-system' };
  }
  for (const edge of system.edges) {
    if (!edge.sourceHandle || !edge.targetHandle) return { ok: false, code: 'corrupt-system' };
    if (!ids.has(edge.source) || !ids.has(edge.target)) return { ok: false, code: 'corrupt-system' };
  }
  return { ok: true };
}
