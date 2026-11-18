export type Locale = 'sq' | 'de' | 'en';

export type CategoryId = 'source' | 'storage' | 'consumer' | 'system' | 'valve' | 'control' | 'connector';

export type SymbolId =
  | 'heat-pump'
  | 'buffer'
  | 'radiator'
  | 'underfloor'
  | 'fancoil'
  | 'dhw'
  | 'pump'
  | 'tee'
  | 'junction'
  | 'manifold-supply'
  | 'manifold-return'
  | 'valve'
  | 'valve-3way'
  | 'mixer'
  | 'relief'
  | 'air-vent'
  | 'check'
  | 'thermostat';

export type PortSide = 'supply' | 'return' | 'neutral';

export type PortTerminal =
  | 'hp-supply'
  | 'hp-return'
  | 'consumer-supply'
  | 'consumer-return'
  | 'buffer-primary-in'
  | 'buffer-primary-out'
  | 'buffer-secondary-out'
  | 'buffer-secondary-in'
  | 'header-supply'
  | 'header-return'
  | 'relief-in'
  | 'relief-out'
  | 'signal'
  | 'passive';

export interface PortDef {
  id: string;
  /** Position inside the unrotated symbol, 0–1. */
  x: number;
  y: number;
  side: PortSide;
  direction: 'in' | 'out' | 'junction';
  terminal: PortTerminal;
  /** Unconnected required ports are highlighted. Buffer spares are optional. */
  required: boolean;
}

export interface ParamDef {
  id: string;
  kind: 'number' | 'select' | 'boolean';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  options?: number[];
}

export interface ComponentDef {
  id: string;
  code: string;
  category: CategoryId;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
  width: number;
  height: number;
  /**
   * Public URL of the artwork. When set, the node draws this image instead of
   * the built-in symbol. The heat pump uses it so the artwork can be swapped
   * without touching the port layout.
   */
  asset?: string;
  symbol: SymbolId;
  rotatable: boolean;
  ports: PortDef[];
  params: ParamDef[];
}

export interface GraphNode {
  id: string;
  componentId: string;
  params: Record<string, number>;
  x?: number;
  y?: number;
  rotation?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  /** Water pipe, or a dashed thermostat command. Omitted edges are pipes. */
  kind?: 'pipe' | 'signal';
}

export interface EdgeSim {
  flowLph: number;
  tSource: number;
  tTarget: number;
  flowFromSource: boolean;
}

export interface NodeSim {
  tIn: number;
  tOut: number;
  flowLph: number;
  qKw: number;
  dt: number;
  tankC?: number;
  storedKwh?: number;
  /** 0 closed … 1 open. Set on valves. */
  opening?: number;
  /** Simulated room temperature for a thermostat. */
  roomC?: number;
}

export interface SimIssue {
  level: 'info' | 'warn' | 'error';
  code: string;
}

export type SimMode = 'empty' | 'direct' | 'buffered' | 'incomplete';

export interface SimResult {
  ok: boolean;
  mode: SimMode;
  issues: SimIssue[];
  edges: Record<string, EdgeSim>;
  nodes: Record<string, NodeSim>;
  supplyC: number | null;
  returnC: number | null;
  dtC: number | null;
  primaryFlowLph: number;
  secondaryFlowLph: number;
  deliveredKw: number;
  demandKw: number;
  limited: boolean;
  tankC: number | null;
}
