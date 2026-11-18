import { clamp } from '@/components/studio/temperature';
import type { CategoryId, ComponentDef, Locale, ParamDef, PortDef } from '@/components/studio/types';

const capacity: ParamDef = {
  id: 'capacity', kind: 'select', min: 6, max: 20, step: 1, defaultValue: 12, unit: 'kW',
  options: [6, 9, 12, 16, 20],
};

const setpoint: ParamDef = {
  id: 'setpoint', kind: 'number', min: 30, max: 55, step: 1, defaultValue: 45, unit: '°C',
};

const internalPump: ParamDef = {
  id: 'internalPump', kind: 'boolean', min: 0, max: 1, step: 1, defaultValue: 1, unit: '',
};

const internalSpeed: ParamDef = {
  id: 'internalSpeed', kind: 'number', min: 0, max: 100, step: 5, defaultValue: 100, unit: '%',
};

function demand(defaultValue: number): ParamDef {
  return { id: 'demand', kind: 'number', min: 0, max: 15, step: 0.5, defaultValue, unit: 'kW' };
}

const speed: ParamDef = {
  id: 'speed', kind: 'number', min: 0, max: 100, step: 5, defaultValue: 70, unit: '%',
};

const volume: ParamDef = {
  id: 'volume', kind: 'number', min: 50, max: 1000, step: 10, defaultValue: 200, unit: 'L',
};

const opening: ParamDef = {
  id: 'opening', kind: 'number', min: 0, max: 100, step: 5, defaultValue: 100, unit: '%',
};

const motorized: ParamDef = {
  id: 'motorized', kind: 'boolean', min: 0, max: 1, step: 1, defaultValue: 0, unit: '',
};

const behavior: ParamDef = {
  id: 'behavior', kind: 'select', min: 0, max: 1, step: 1, defaultValue: 0, unit: '', options: [0, 1],
};

const limitC: ParamDef = {
  id: 'limitC', kind: 'number', min: 40, max: 95, step: 1, defaultValue: 75, unit: '°C',
};

const branches: ParamDef = {
  id: 'branches', kind: 'number', min: 3, max: 6, step: 1, defaultValue: 3, unit: '',
};

const roomSet: ParamDef = {
  id: 'roomSet', kind: 'number', min: 10, max: 28, step: 0.5, defaultValue: 21, unit: '°C',
};

const ambient: ParamDef = {
  id: 'ambient', kind: 'number', min: 5, max: 25, step: 0.5, defaultValue: 16, unit: '°C',
};

/** 0 = Auto (thermostat), 1 = Manual (the A/B toggle). */
const controlMode: ParamDef = {
  id: 'controlMode', kind: 'select', min: 0, max: 1, step: 1, defaultValue: 0, unit: '', options: [0, 1],
};

/** 0 = port A, 1 = port B. Used in Manual, and whenever no thermostat is connected. */
const manualPort: ParamDef = {
  id: 'manualPort', kind: 'boolean', min: 0, max: 1, step: 1, defaultValue: 0, unit: '',
};

/** Hot share of a mixer. 0 is all cold, 100 is all hot. */
const mix: ParamDef = {
  id: 'mix', kind: 'number', min: 0, max: 100, step: 5, defaultValue: 50, unit: '%',
};

const signalPort = (id: string, direction: 'in' | 'out'): PortDef => ({
  id, x: 0.5, y: 0, side: 'neutral', direction, terminal: 'signal', required: false,
});

function text(sq: string, de: string, en: string): Record<Locale, string> {
  return { sq, de, en };
}

const hpSupply: PortDef = {
  id: 'supply-out', x: 0.96, y: 0.58, side: 'supply', direction: 'out', terminal: 'hp-supply', required: true,
};
const hpReturn: PortDef = {
  id: 'return-in', x: 0.96, y: 0.76, side: 'return', direction: 'in', terminal: 'hp-return', required: true,
};

function consumerPorts(): PortDef[] {
  return [
    { id: 'supply-in', x: 0, y: 0.32, side: 'supply', direction: 'in', terminal: 'consumer-supply', required: true },
    { id: 'return-out', x: 0, y: 0.72, side: 'return', direction: 'out', terminal: 'consumer-return', required: true },
  ];
}

export const COMPONENTS: ComponentDef[] = [
  {
    id: 'heat-pump',
    code: 'WP',
    category: 'source',
    name: text('Pompë termike ajër-ujë', 'Luft-Wasser-Wärmepumpe', 'Air-to-water heat pump'),
    blurb: text(
      'Burimi i nxehtësisë. Dalja e kuqe është furnizimi, hyrja blu është kthimi.',
      'Wärmequelle. Roter Ausgang ist Vorlauf, blauer Eingang ist Rücklauf.',
      'Heat source. The red port is supply out, the blue port is return in.',
    ),
    width: 200,
    height: 154,
    asset: '/studio/symbols/heat-pump.webp',
    symbol: 'heat-pump',
    rotatable: false,
    ports: [hpSupply, hpReturn],
    params: [capacity, setpoint, internalPump, internalSpeed],
  },
  {
    id: 'buffer-tank',
    code: 'PS',
    category: 'storage',
    name: text('Depozitë akumuluese', 'Pufferspeicher', 'Buffer tank'),
    blurb: text(
      'Një vëllim i vetëm i përzier. Majtas pompa termike, djathtas konsumatorët. Pa spirale.',
      'Ein gemischtes Volumen. Links die Wärmepumpe, rechts die Verbraucher. Keine Schlange.',
      'One mixed volume. Heat pump on the left, heat users on the right. No coil.',
    ),
    width: 136,
    height: 228,
    symbol: 'buffer',
    rotatable: false,
    ports: [
      { id: 'pri-in', x: 0, y: 0.30, side: 'supply', direction: 'in', terminal: 'buffer-primary-in', required: false },
      { id: 'pri-out', x: 0, y: 0.70, side: 'return', direction: 'out', terminal: 'buffer-primary-out', required: false },
      { id: 'sec-out-1', x: 1, y: 0.14, side: 'supply', direction: 'out', terminal: 'buffer-secondary-out', required: false },
      { id: 'sec-out-2', x: 1, y: 0.28, side: 'supply', direction: 'out', terminal: 'buffer-secondary-out', required: false },
      { id: 'sec-out-3', x: 1, y: 0.42, side: 'supply', direction: 'out', terminal: 'buffer-secondary-out', required: false },
      { id: 'sec-out-4', x: 1, y: 0.56, side: 'supply', direction: 'out', terminal: 'buffer-secondary-out', required: false },
      { id: 'sec-in-1', x: 1, y: 0.74, side: 'return', direction: 'in', terminal: 'buffer-secondary-in', required: false },
      { id: 'sec-in-2', x: 1, y: 0.88, side: 'return', direction: 'in', terminal: 'buffer-secondary-in', required: false },
    ],
    params: [volume],
  },
  {
    id: 'radiator',
    code: 'HK',
    category: 'consumer',
    name: text('Radiator', 'Heizkörper', 'Radiator'),
    blurb: text('Konsumator. Furnizimi hyn sipër, kthimi del poshtë.', 'Verbraucher. Vorlauf oben, Rücklauf unten.', 'Heat user. Supply enters above, return leaves below.'),
    width: 144,
    height: 90,
    symbol: 'radiator',
    rotatable: true,
    ports: consumerPorts(),
    params: [demand(4)],
  },
  {
    id: 'underfloor',
    code: 'FBH',
    category: 'consumer',
    name: text('Ngrohje dyshemeje', 'Fußbodenheizung', 'Underfloor heating'),
    blurb: text('Qark nën dysheme me kërkesë të vet.', 'Flächenheizung mit eigener Leistung.', 'Floor circuit with its own heat demand.'),
    width: 144,
    height: 90,
    symbol: 'underfloor',
    rotatable: true,
    ports: consumerPorts(),
    params: [demand(3)],
  },
  {
    id: 'fancoil',
    code: 'FC',
    category: 'consumer',
    name: text('Fan coil', 'Gebläsekonvektor', 'Fan coil'),
    blurb: text('Konvektor me ventilator dhe bateri.', 'Konvektor mit Ventilator und Register.', 'Convector with a fan and a coil.'),
    width: 144,
    height: 90,
    symbol: 'fancoil',
    rotatable: true,
    ports: consumerPorts(),
    params: [demand(2.5)],
  },
  {
    id: 'dhw-tank',
    code: 'TWS',
    category: 'consumer',
    name: text('Bolier me spirale', 'Warmwasserspeicher mit Schlange', 'DHW tank with coil'),
    blurb: text('Ujë sanitar. Spiralja e brendshme është konsumatori.', 'Brauchwasser. Die innere Schlange ist der Verbraucher.', 'Domestic hot water. The internal coil is the heat user.'),
    width: 100,
    height: 148,
    symbol: 'dhw',
    rotatable: false,
    ports: [
      { id: 'supply-in', x: 0, y: 0.36, side: 'supply', direction: 'in', terminal: 'consumer-supply', required: true },
      { id: 'return-out', x: 0, y: 0.70, side: 'return', direction: 'out', terminal: 'consumer-return', required: true },
    ],
    params: [demand(3)],
  },
  {
    id: 'pump',
    code: 'P',
    category: 'system',
    name: text('Pompë qarkullimi', 'Umwälzpumpe', 'Circulation pump'),
    blurb: text('Shpejtësia cakton rrjedhën e qarkut ku është montuar.', 'Die Drehzahl setzt den Volumenstrom ihres Kreises.', 'Speed sets the flow of the loop it sits on.'),
    width: 84,
    height: 84,
    symbol: 'pump',
    rotatable: true,
    ports: [
      { id: 'in', x: 0, y: 0.5, side: 'neutral', direction: 'in', terminal: 'passive', required: true },
      { id: 'out', x: 1, y: 0.5, side: 'neutral', direction: 'out', terminal: 'passive', required: true },
    ],
    params: [speed],
  },
  {
    id: 'tee',
    code: 'T',
    category: 'connector',
    name: text('Degëzim T', 'T-Stück', 'Tee'),
    blurb: text('Ndane furnizimin ose mbledh kthimin për degë paralele.', 'Teilt den Vorlauf oder sammelt den Rücklauf.', 'Splits supply or collects return for parallel branches.'),
    width: 56,
    height: 56,
    symbol: 'tee',
    rotatable: true,
    ports: [
      { id: 'a', x: 0, y: 0.5, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'b', x: 1, y: 0.5, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'c', x: 0.5, y: 1, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
    ],
    params: [],
  },
  {
    id: 'junction',
    code: 'J',
    category: 'connector',
    name: text('Nyje', 'Kreuzstück', 'Junction'),
    blurb: text('Kryq me katër porta. Uji kalon në çdo drejtim.', 'Vier Wege. Wasser kann in jede Richtung.', 'Four-way junction. Water can pass any direction.'),
    width: 64,
    height: 64,
    symbol: 'junction',
    rotatable: false,
    ports: [
      { id: 'n', x: 0.5, y: 0, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'e', x: 1, y: 0.5, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 's', x: 0.5, y: 1, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'w', x: 0, y: 0.5, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
    ],
    params: [],
  },
  {
    id: 'manifold-supply',
    code: 'MS',
    category: 'connector',
    name: text('Kolektor furnizimi', 'Vorlaufverteiler', 'Supply manifold'),
    blurb: text('Kokë e nxehtë: një hyrje sipër dhe dalje të nxehta poshtë.', 'Warmer Verteiler: ein Eintritt oben, Auslässe unten.', 'Hot header: one inlet on top and hot outlets along the bottom.'),
    width: 180,
    height: 78,
    symbol: 'manifold-supply',
    rotatable: false,
    ports: supplyManifoldPorts(3),
    params: [branches],
  },
  {
    id: 'manifold-return',
    code: 'MR',
    category: 'connector',
    name: text('Kolektor kthimi', 'Rücklaufsammler', 'Return manifold'),
    blurb: text('Kokë e ftohtë: hyrje kthimi sipër dhe një dalje poshtë.', 'Kalter Sammler: Rückläufe oben, ein Austritt unten.', 'Cold header: return inlets on top and one outlet below.'),
    width: 180,
    height: 78,
    symbol: 'manifold-return',
    rotatable: false,
    ports: returnManifoldPorts(3),
    params: [branches],
  },
  {
    id: 'valve',
    code: 'V',
    category: 'valve',
    name: text('Valvul 2-rrugëshe', 'Zweiwegeventil', 'Two-way valve'),
    blurb: text('Hapje ose mbyllje e një dege. E mbyllur, e ndalon atë degë.', 'Auf oder zu für einen Strang. Geschlossen sperrt sie ihn.', 'On/off or modulating. Shut, it stops that branch.'),
    width: 92,
    height: 72,
    symbol: 'valve',
    rotatable: true,
    ports: [
      signalPort('ctl', 'in'),
      { id: 'in', x: 0, y: 0.62, side: 'neutral', direction: 'in', terminal: 'passive', required: true },
      { id: 'out', x: 1, y: 0.62, side: 'neutral', direction: 'out', terminal: 'passive', required: true },
    ],
    params: [behavior, motorized, opening],
  },
  {
    id: 'valve-3way',
    code: 'V3',
    category: 'valve',
    name: text('Valvul 3-rrugëshe', 'Dreiwegeventil', 'Three-way valve'),
    blurb: text(
      'Porta AB është e përbashkët dhe nuk përzien. Auto ndjek termostatin: mbi pikën e dhomës, 100% te B, përndryshe 100% te A. Manual përdor çelësin A/B. Pa termostat, çelësi vendos gjithmonë.',
      'AB ist der gemeinsame Anschluss und mischt nicht. Auto folgt dem Thermostat: über dem Soll 100 % nach B, sonst 100 % nach A. Hand nutzt den Schalter A/B. Ohne Thermostat gilt immer der Schalter.',
      'AB is the common port and it never mixes. Auto follows a thermostat: above the room setpoint, 100% goes to B, otherwise 100% to A. Manual uses the A/B toggle. With no thermostat, the toggle is always in charge.',
    ),
    width: 104,
    height: 96,
    symbol: 'valve-3way',
    rotatable: true,
    ports: [
      signalPort('ctl', 'in'),
      { id: 'ab', x: 0, y: 0.46, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'a', x: 1, y: 0.46, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'b', x: 0.5, y: 1, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
    ],
    params: [controlMode, manualPort],
  },
  {
    id: 'mixer',
    code: 'MV',
    category: 'valve',
    name: text('Përzierës', 'Mischer', 'Mixer'),
    blurb: text(
      'Vetëm manual. Uji i nxehtë dhe i ftohtë hyjnë njëkohësisht. Rrëshqitësi është pjesa e nxehtë: temperatura e daljes është përzierja sipas rrjedhës, dhe rrjedha e daljes është shuma. Nuk pranon termostat.',
      'Nur von Hand. Warm und kalt dürfen gleichzeitig anliegen. Der Regler ist der Warmanteil: die Austrittstemperatur ist die strömungsgewichtete Mischung, der Austrittsstrom die Summe. Kein Thermostat.',
      'Manual only. Hot and cold can connect at the same time. The slider is the hot share: outlet temperature is the flow-weighted mix, and outlet flow is the sum. It does not take a thermostat.',
    ),
    width: 104,
    height: 96,
    symbol: 'mixer',
    rotatable: true,
    ports: [
      { id: 'h', x: 0, y: 0.32, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'c', x: 0, y: 0.68, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
      { id: 'out', x: 1, y: 0.5, side: 'neutral', direction: 'junction', terminal: 'passive', required: false },
    ],
    params: [mix],
  },
  {
    id: 'relief',
    code: 'RV',
    category: 'valve',
    name: text('Valvul shkarkimi', 'Sicherheitsventil', 'Relief valve'),
    blurb: text('Qëndron e mbyllur. Hapet kur uji kalon kufirin — modeli s’ka presion, përdor temperaturën.', 'Bleibt zu. Öffnet über dem Grenzwert. Das Modell nutzt Temperatur statt Druck.', 'Stays shut. Opens above its limit. This model uses temperature as the stand-in for pressure.'),
    width: 92,
    height: 72,
    symbol: 'relief',
    rotatable: true,
    ports: [
      { id: 'in', x: 0, y: 0.55, side: 'supply', direction: 'in', terminal: 'relief-in', required: true },
      { id: 'out', x: 1, y: 0.55, side: 'return', direction: 'out', terminal: 'relief-out', required: true },
    ],
    params: [limitC],
  },
  {
    id: 'air-vent',
    code: 'AV',
    category: 'valve',
    name: text('Valvul ajrimi', 'Entlüfter', 'Air vent'),
    blurb: text('Vetëm vizuale. Uji kalon pa u penguar.', 'Nur Darstellung. Das Wasser fließt ungehindert.', 'Visual only. Water passes straight through.'),
    width: 72,
    height: 78,
    symbol: 'air-vent',
    rotatable: false,
    ports: [
      { id: 'in', x: 0, y: 0.72, side: 'neutral', direction: 'in', terminal: 'passive', required: true },
      { id: 'out', x: 1, y: 0.72, side: 'neutral', direction: 'out', terminal: 'passive', required: true },
    ],
    params: [],
  },
  {
    id: 'check',
    code: 'CV',
    category: 'valve',
    name: text('Valvul moskthimi', 'Rückflussverhinderer', 'Backflow preventer'),
    blurb: text('Lë ujin vetëm përpara. Rrjedha mbrapsht bllokohet.', 'Wasser nur vorwärts. Rückfluss wird gesperrt.', 'Water only flows forward. Reverse flow is blocked.'),
    width: 92,
    height: 64,
    symbol: 'check',
    rotatable: true,
    ports: [
      { id: 'in', x: 0, y: 0.5, side: 'neutral', direction: 'in', terminal: 'passive', required: true },
      { id: 'out', x: 1, y: 0.5, side: 'neutral', direction: 'out', terminal: 'passive', required: true },
    ],
    params: [],
  },
  {
    id: 'thermostat',
    code: 'RT',
    category: 'control',
    name: text('Termostat dhome', 'Raumthermostat', 'Room thermostat'),
    blurb: text(
      'Vetëm komandë për një valvul 3-rrugëshe në Auto. Nëse ambienti është mbi pikën e dhomës, gjithë uji shkon te porta B, përndryshe te A. Përzierësi nuk e pranon.',
      'Nur ein Befehl für ein Dreiwegeventil auf Auto. Liegt die Umgebung über dem Soll, geht der ganze Strom nach B, sonst nach A. Ein Mischer nimmt das Signal nicht an.',
      'A command only, for a three-way valve in Auto. If ambient is above the room setpoint, all the flow goes to port B, otherwise to A. A mixer will not take this signal.',
    ),
    width: 88,
    height: 88,
    symbol: 'thermostat',
    rotatable: false,
    ports: [
      { id: 'sig', x: 0.5, y: 1, side: 'neutral', direction: 'out', terminal: 'signal', required: false },
    ],
    params: [roomSet, ambient],
  },
];

const BY_ID = new Map(COMPONENTS.map((component) => [component.id, component]));

export const CATEGORY_ORDER: CategoryId[] = ['source', 'storage', 'consumer', 'system', 'valve', 'control', 'connector'];

export function branchCount(params: Record<string, number> | undefined): number {
  return clamp(Math.round(params?.branches ?? 3), 3, 6);
}

export function supplyManifoldPorts(count: number): PortDef[] {
  const ports: PortDef[] = [
    { id: 'in', x: 0.5, y: 0, side: 'supply', direction: 'in', terminal: 'header-supply', required: true },
  ];
  for (let i = 0; i < count; i++) {
    ports.push({
      id: `out-${i + 1}`,
      x: (i + 0.5) / count,
      y: 1,
      side: 'supply',
      direction: 'out',
      terminal: 'header-supply',
      required: false,
    });
  }
  return ports;
}

export function returnManifoldPorts(count: number): PortDef[] {
  const ports: PortDef[] = [];
  for (let i = 0; i < count; i++) {
    ports.push({
      id: `in-${i + 1}`,
      x: (i + 0.5) / count,
      y: 0,
      side: 'return',
      direction: 'in',
      terminal: 'header-return',
      required: false,
    });
  }
  ports.push({ id: 'out', x: 0.5, y: 1, side: 'return', direction: 'out', terminal: 'header-return', required: true });
  return ports;
}

export function resolvePorts(def: ComponentDef, params: Record<string, number> | undefined): PortDef[] {
  const count = branchCount(params);
  if (def.id === 'manifold-supply') return supplyManifoldPorts(count);
  if (def.id === 'manifold-return') return returnManifoldPorts(count);
  return def.ports;
}

export function componentBox(def: ComponentDef, params?: Record<string, number>): { width: number; height: number } {
  if (def.id === 'manifold-supply' || def.id === 'manifold-return') {
    return { width: 36 + branchCount(params) * 48, height: def.height };
  }
  return { width: def.width, height: def.height };
}

export function getComponent(id: string): ComponentDef | undefined {
  return BY_ID.get(id);
}

export function defaultParams(def: ComponentDef): Record<string, number> {
  const params: Record<string, number> = {};
  for (const param of def.params) params[param.id] = param.defaultValue;
  return params;
}

export function componentsByCategory(category: CategoryId): ComponentDef[] {
  return COMPONENTS.filter((component) => component.category === category);
}
