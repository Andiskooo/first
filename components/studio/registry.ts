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

function text(sq: string, de: string, en: string): Record<Locale, string> {
  return { sq, de, en };
}

const hpSupply: PortDef = {
  id: 'supply-out', x: 1, y: 0.33, side: 'supply', direction: 'out', terminal: 'hp-supply', required: true,
};
const hpReturn: PortDef = {
  id: 'return-in', x: 1, y: 0.72, side: 'return', direction: 'in', terminal: 'hp-return', required: true,
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
    width: 180,
    height: 104,
    asset: '/studio/symbols/heat-pump.svg',
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
];

const BY_ID = new Map(COMPONENTS.map((component) => [component.id, component]));

export const CATEGORY_ORDER: CategoryId[] = ['source', 'storage', 'consumer', 'system', 'connector'];

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
