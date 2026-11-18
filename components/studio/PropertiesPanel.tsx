'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { getComponent } from '@/components/studio/registry';
import { useStudioCopy, type StudioCopy } from '@/components/studio/copy';
import { formatNum } from '@/components/studio/temperature';
import type { HydronicFlowNode } from '@/components/studio/HydronicNode';
import type { Edge } from '@xyflow/react';
import type { NodeSim, SimResult } from '@/components/studio/types';

export function PropertiesPanel({
  selected,
  selectedEdge,
  result,
  showThermo,
  signalLinked,
  onParam,
  onRotate,
  onReversePump,
  onRemove,
  onRemoveEdge,
}: {
  selected: HydronicFlowNode | null;
  selectedEdge: Edge | null;
  result: SimResult;
  showThermo: boolean;
  /** A thermostat signal currently lands on the selected three-way valve. */
  signalLinked: boolean;
  onParam: (id: string, key: string, value: number) => void;
  onRotate: (id: string) => void;
  onReversePump: (id: string) => void;
  onRemove: (id: string) => void;
  onRemoveEdge: (id: string) => void;
}) {
  const text = useStudioCopy();
  const { locale } = useLanguage();
  const def = selected ? getComponent(selected.data.componentId) : undefined;
  const live = selected ? result.nodes[selected.id] : undefined;
  const sim = selected && showThermo ? live : undefined;
  const buffered = result.mode === 'buffered' || result.tankC != null;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-white lg:w-[320px] lg:border-l lg:border-slate-200">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{text.globals}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Readout label={text.supply} value={showThermo ? `${formatNum(result.supplyC, 1)} °C` : '—'} />
          <Readout label={text.returnT} value={showThermo ? `${formatNum(result.returnC, 1)} °C` : '—'} />
          <Readout label={text.delta} value={showThermo ? `${formatNum(result.dtC, 1)} K` : '—'} />
          <Readout label={text.power} value={showThermo ? `${formatNum(result.deliveredKw, 1)} / ${formatNum(result.demandKw, 1)} kW` : '—'} />
          {buffered ? (
            <>
              <Readout label={text.tank} value={showThermo ? `${formatNum(result.tankC, 1)} °C` : '—'} />
              <Readout label={text.primaryFlow} value={showThermo ? `${formatNum(result.primaryFlowLph, 0)} L/h` : '—'} />
              <Readout label={text.secondaryFlow} value={showThermo ? `${formatNum(result.secondaryFlowLph, 0)} L/h` : '—'} />
            </>
          ) : (
            <Readout label={text.flow} value={showThermo ? `${formatNum(result.primaryFlowLph, 0)} L/h` : '—'} />
          )}
        </div>
        {!showThermo ? <p className="mt-3 text-xs leading-5 text-slate-500">{text.startHint}</p> : null}

        <div className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{text.component}</h2>
          {selectedEdge ? (
            <PipeInspector text={text} edge={selectedEdge} result={result} showThermo={showThermo} onRemove={() => onRemoveEdge(selectedEdge.id)} />
          ) : selected && def ? (
            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-900">{def.name[locale]} <span className="font-medium text-slate-400">{def.code}</span></p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{def.blurb[locale]}</p>
              {sim ? (
                <NodeReadouts
                  text={text}
                  sim={sim}
                  kind={def.id === 'buffer-tank' ? 'buffer' : def.id === 'thermostat' ? 'room' : def.id === 'valve-3way' ? 'valve3' : def.id === 'mixer' ? 'mixer' : def.id === 'pump' ? 'pump' : def.category === 'source' ? 'source' : def.category === 'consumer' ? 'consumer' : 'other'}
                  modeText={def.id === 'valve-3way' ? (signalLinked && (selected.data.params.controlMode ?? 0) < 0.5 ? text.modeAuto : text.modeManual) : undefined}
                />
              ) : null}
              {def.id === 'valve-3way' && selected ? (
                <ThreeWayControls
                  text={text}
                  params={selected.data.params}
                  opening={live?.opening}
                  signalLinked={signalLinked}
                  onParam={(key, value) => onParam(selected.id, key, value)}
                />
              ) : null}
              {def.id === 'mixer' ? <p className="mt-3 text-xs leading-5 text-slate-500">{text.mixHint}</p> : null}
              {def.id === 'pump' && signalLinked ? (
                <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-950">
                  {(live?.opening ?? 1) >= 0.5 ? text.pumpOn : text.pumpOff}
                </p>
              ) : null}
              <div className="mt-4 space-y-4">
                {def.params.filter((param) => def.id !== 'valve-3way' || (param.id !== 'controlMode' && param.id !== 'manualPort')).map((param) => (
                  <ParamControl
                    key={param.id}
                    id={param.id}
                    text={text}
                    label={text.params[param.id as keyof StudioCopy['params']] ?? param.id}
                    kind={param.kind}
                    unit={param.unit}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    options={param.options}
                    value={selected.data.params[param.id] ?? param.defaultValue}
                    onChange={(value) => onParam(selected.id, param.id, value)}
                  />
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-4 text-slate-400">{text.nominal}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {def.rotatable ? (
                  <button type="button" onClick={() => onRotate(selected.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">{text.rotate}</button>
                ) : null}
                {def.id === 'pump' ? (
                  <button type="button" onClick={() => onReversePump(selected.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">{text.reversePump}</button>
                ) : null}
                <button type="button" onClick={() => onRemove(selected.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">{text.remove}</button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">{text.noSelection}</p>
          )}
        </div>

        <details className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          <summary className="cursor-pointer font-medium text-slate-700">{text.assumptionsTitle}</summary>
          <p className="mt-2">{text.assumptions}</p>
        </details>
      </div>
    </aside>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{value}</div>
    </div>
  );
}

function PipeInspector({
  text,
  edge,
  result,
  showThermo,
  onRemove,
}: {
  text: StudioCopy;
  edge: Edge;
  result: SimResult;
  showThermo: boolean;
  onRemove: () => void;
}) {
  const signal = edge.type === 'signal';
  const sim = result.edges[edge.id];
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold text-slate-900">{signal ? text.signal : text.pipe}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{signal ? text.signalBody : text.pipeBody}</p>
      {!signal && showThermo && sim ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs tabular-nums text-slate-700">
          <dt>{text.flow}</dt><dd>{formatNum(sim.flowLph, 0)} L/h</dd>
          <dt>{text.supply}</dt><dd>{formatNum(sim.flowFromSource ? sim.tSource : sim.tTarget, 1)} °C</dd>
          <dt>{text.returnT}</dt><dd>{formatNum(sim.flowFromSource ? sim.tTarget : sim.tSource, 1)} °C</dd>
        </dl>
      ) : null}
      <div className="mt-4">
        <button type="button" onClick={onRemove} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">{text.remove}</button>
      </div>
    </div>
  );
}

function ThreeWayControls({
  text,
  params,
  opening,
  signalLinked,
  onParam,
}: {
  text: StudioCopy;
  params: Record<string, number>;
  opening: number | undefined;
  signalLinked: boolean;
  onParam: (key: string, value: number) => void;
}) {
  const manual = !signalLinked || (params.controlMode ?? 0) >= 0.5;
  const portB = opening != null ? opening >= 0.5 : (params.manualPort ?? 0) >= 0.5;
  const storedB = (params.manualPort ?? 0) >= 0.5;
  return (
    <div className="mt-4 space-y-3">
      <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs leading-5 text-violet-950">
        <span className="font-semibold">{manual ? text.modeManual : text.modeAuto}</span>
        {' · '}
        {portB ? text.portB : text.portA}
        <span className="mt-0.5 block text-violet-800">
          {signalLinked
            ? (manual ? text.manualInCharge : text.autoInCharge)
            : text.manualAlways}
        </span>
      </p>
      <div>
        <span className="text-sm text-slate-700">{text.params.controlMode}</span>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <ModeButton label={text.modeAuto} pressed={signalLinked && !manual} disabled={!signalLinked} onClick={() => onParam('controlMode', 0)} />
          <ModeButton label={text.modeManual} pressed={manual} onClick={() => onParam('controlMode', 1)} />
        </div>
      </div>
      <div>
        <span className="text-sm text-slate-700">{text.params.manualPort}</span>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <ModeButton label={text.portA} pressed={!storedB} onClick={() => onParam('manualPort', 0)} />
          <ModeButton label={text.portB} pressed={storedB} onClick={() => onParam('manualPort', 1)} />
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  label,
  pressed,
  disabled,
  onClick,
}: {
  label: string;
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-2 py-1.5 text-xs font-medium ${pressed ? 'border-violet-400 bg-violet-50 text-violet-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function NodeReadouts({
  text,
  sim,
  kind,
  modeText,
}: {
  text: StudioCopy;
  sim: NodeSim;
  kind: 'buffer' | 'source' | 'consumer' | 'room' | 'valve3' | 'mixer' | 'pump' | 'other';
  modeText?: string;
}) {
  const supply = kind === 'source' ? sim.tOut : sim.tIn;
  const back = kind === 'source' ? sim.tIn : sim.tOut;
  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs tabular-nums text-slate-700">
      {kind === 'room' ? (
        <>
          <dt>{text.room}</dt><dd>{formatNum(sim.roomC, 1)} °C</dd>
        </>
      ) : kind === 'valve3' ? (
        <>
          <dt>{text.params.controlMode}</dt><dd>{modeText}</dd>
          <dt>{text.valveState}</dt><dd>{(sim.opening ?? 0) >= 0.5 ? text.portB : text.portA}</dd>
        </>
      ) : kind === 'mixer' ? (
        <>
          <dt>{text.outlet}</dt><dd>{formatNum(sim.tOut, 1)} °C</dd>
          <dt>{text.flow}</dt><dd>{formatNum(sim.flowLph, 0)} L/h</dd>
          <dt>{text.params.mix}</dt><dd>{Math.round((sim.opening ?? 0.5) * 100)}% {text.hot}</dd>
        </>
      ) : kind === 'buffer' ? (
        <>
          <dt>{text.tank}</dt><dd>{formatNum(sim.tankC, 1)} °C</dd>
          <dt>{text.stored}</dt><dd>{formatNum(sim.storedKwh, 2)} kWh</dd>
        </>
      ) : (
        <>
          <dt>{text.supply}</dt><dd>{formatNum(supply, 1)} °C</dd>
          <dt>{text.returnT}</dt><dd>{formatNum(back, 1)} °C</dd>
          <dt>{text.delta}</dt><dd>{formatNum(Math.abs(sim.dt), 1)} K</dd>
        </>
      )}
      {kind === 'mixer' || kind === 'valve3' ? null : (
        <>
          <dt>{text.flow}</dt><dd>{formatNum(sim.flowLph, 0)} L/h</dd>
          <dt>{text.power}</dt><dd>{formatNum(sim.qKw, 1)} kW</dd>
        </>
      )}
      {sim.opening != null && kind !== 'valve3' && kind !== 'mixer' ? (
        <>
          <dt>{text.valveState}</dt>
          <dd>{kind === 'pump' ? ((sim.opening ?? 1) >= 0.5 ? text.pumpOn : text.pumpOff) : sim.opening < 0.05 ? text.closed : sim.opening > 0.95 ? text.open : `${Math.round(sim.opening * 100)}%`}</dd>
        </>
      ) : null}
    </dl>
  );
}

function choiceLabel(id: string, option: number, unit: string, text: StudioCopy): string {
  if (id === 'behavior') return option < 0.5 ? text.onOff : text.modulating;
  if (id === 'arrangement') return option < 0.5 ? text.divert : text.mix;
  if (id === 'controlMode') return option < 0.5 ? text.modeAuto : text.modeManual;
  return `${option} ${unit}`.trim();
}

function ParamControl({
  id,
  text,
  label,
  kind,
  unit,
  min,
  max,
  step,
  options,
  value,
  onChange,
}: {
  id: string;
  text: StudioCopy;
  label: string;
  kind: 'number' | 'select' | 'boolean';
  unit: string;
  min: number;
  max: number;
  step: number;
  options?: number[];
  value: number;
  onChange: (value: number) => void;
}) {
  if (kind === 'boolean') {
    const on = value >= 0.5;
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-700">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          onClick={() => onChange(on ? 0 : 1)}
          className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>
    );
  }
  if (kind === 'select' && options) {
    return (
      <label className="block text-sm text-slate-700">
        {label}
        <select
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
        >
          {options.map((option) => (
            <option key={option} value={option}>{choiceLabel(id, option, unit, text)}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className="block text-sm text-slate-700">
      <span className="flex items-baseline justify-between">
        <span>{label}</span>
        <span className="tabular-nums font-medium text-slate-900">{formatNum(value, step < 1 ? 1 : 0)} {unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-blue-600"
      />
    </label>
  );
}
