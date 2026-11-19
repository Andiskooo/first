# Hydraulic studio

`/studio` is a client-side teaching tool for a small hydronic heating circuit. Nothing is saved, and there is no account. The page is Albanian, German, and English through the site language switcher.

## Add a component

1. Draw an original SVG symbol in `components/studio/symbols.tsx`, or add a file under `public/studio/symbols/` and point at it.
2. Add one object to `COMPONENTS` in `components/studio/registry.ts`:
   - `id`, `code`, `category` (`source`, `storage`, `consumer`, `system`, or `connector`)
   - `name` and `blurb` in `sq`, `de`, and `en`
   - `width`, `height`, `symbol`, and `rotatable`
   - `ports`: each port has `id`, `x` and `y` from 0 to 1, `side` (`supply`, `return`, or `neutral`), `direction`, and a `terminal` role
   - `params`: sliders, selects, or booleans. `defaultValue` is what a newly placed part uses
3. If the part is a heat user, set `category: 'consumer'` and give it `supply-in` (`consumer-supply`) and `return-out` (`consumer-return`). The solver will then include it.
4. Run `npm run test:studio`.

Ports are drawn from the registry, so a new part does not need a change to the canvas code. Pumps and tees are passive: they take the supply or return colour of whatever they are connected to.

## Swap the heat pump image

The heat pump node renders `public/studio/symbols/heat-pump.webp` (the ECOTEK outdoor unit, kept at its 800×616 aspect ratio). The path is `asset` on the `heat-pump` entry in `components/studio/registry.ts`.

- Replace that file with another photo of the same proportions, or
- change `asset` to a new public path.

The red supply outlet and blue return inlet are handles on the right edge of the frame (`supply-out` at 58% height, `return-in` at 76%). They sit on top of the picture, so the photo does not have to include them.

## How the model works

Water uses `Q = m · cp · ΔT` with `cp = 4.186 kJ/kg·K`. A circulation pump at 100% moves 1800 L/h; the heat pump’s internal circulator moves 1500 L/h at 100%. Parallel branches share that flow **equally**. A branch with a higher demand therefore gets a larger temperature drop. Real valves often send more water toward the larger load; this split is only for teaching.

Consumers take their set demand while the heat pump can cover it and the stream is warm enough. Supply stays at the setpoint. If demand is above the selected capacity (6, 9, 12, 16, or 20 kW), the heat pump stays at full power and supply temperature sags. A very small flow can also limit the heat, because the water is not allowed to fall below about 16 °C.

Pipes are treated as adiabatic. The colour along a pipe is a drawing of that temperature change: supply stays hot, the pipe into a consumer cools toward the return, and the return run is the cooler colour. The numbers in the side panel are the steady-state balance.

### Buffer tank (PS)

The buffer is **one mixed tank**, not two tanks and not a coil. Eight ports:

| Side | Ports | Connects to |
| --- | --- | --- |
| Left | 1 red inlet, 1 blue outlet | Heat pump supply outlet and heat pump return inlet |
| Right | 4 red outlets, 2 blue inlets | Heat users only |

Pumps and tees may sit between those devices. The left side is no longer restricted to the heat source: it may join shared supply/return headers with heat users (for example a buffer branch in parallel with a floor-heating branch), and those parallel loops run together off the same circulator. A direct primary-to-secondary short, or the heat pump on the right-hand user side, is still rejected.

The tank separates two hydraulic loops and couples them only by heat:

- **Primary loop** — heat pump supply → optional circulation pump → left inlet; left outlet → heat pump return. Flow is the dedicated pump if one is installed, otherwise the heat pump’s internal circulator. A dedicated pump replaces the internal one, including when its speed is 0.
- **Secondary loop** — right outlets → circulation pump → heat users → right inlets. The internal heat-pump pump does **not** drive this loop.

At steady state the tank temperature is below the heat-pump supply by the primary ΔT, and the heat users see that mixed temperature. Stored energy shown in the panel is `m · cp · (T_tank − 20 °C)` and does not change the steady temperatures; volume is there so a later product image or a larger tank still has a place to live.

The tool simulates one heat pump and one buffer. It is not a design calculation.

## Valves, thermostats, and manifolds

Valves live in the palette beside the pump. A two-way valve stops a branch when it is shut, and a modulating one scales that branch’s share of the flow. Its signal port sits on top, clear of the water ports. Auto with a thermostat keeps the valve open until ambient is above the room setpoint, then closes it, so that branch has no flow and the parallel branches take the water. That closed branch is not an error. Manual uses the Open/Closed toggle on the symbol and in the inspector, and Manual wins while the thermostat stays connected. With no thermostat, the toggle and the opening percentage both apply. The toggle starts open, so a valve set by its percentage behaves as before. A three-way valve has a common port `ab` and two outlets, `a` (default) and `b`. It does not mix: one port gets 100% of the flow and the other gets none. Each of those three water ports may be tied to an inlet or an outlet line in any combination; the valve does not inherit a supply or return restriction from its other ports. A relief valve is the only part allowed to join supply to return; it stays shut until the water temperature passes its limit (this model has no pressure solver, so temperature stands in for the relief setting) and then bypasses some of the flow. A backflow preventer passes water only from its inlet to its outlet. An air vent is drawn on the pipe and does not change the flow.

A three-way valve has two ways to choose the port, and this is the precedence:

1. **Auto**, and a thermostat signal is connected. If ambient is above the room setpoint, 100% of the flow goes to port B. Otherwise 100% goes to port A.
2. **Manual**. The A/B toggle in the inspector, and the same toggle drawn on the symbol, choose the port. Manual wins even when a thermostat is still connected.
3. **No thermostat**. The toggle is in charge whether the selector says Auto or Manual. Auto has nothing to follow.

The canvas toggle always takes manual control when a thermostat is connected, then flips the port, so a click changes the valve immediately. Choosing Auto again hands the valve back to the thermostat. The label and the inspector show the mode and the active port.

A room thermostat has no water ports and does not simulate a warming room. It has two settings, ambient temperature and room setpoint. Its dashed purple link is a command, not a pipe. It can land on the control port of a two-way valve, a three-way valve, a circulation pump, the heat pump, or any combination of those from the same thermostat. The label on the valve shows which port is active, and the hydraulic result follows that branch only. The pump runs at its speed slider until ambient is above the room setpoint, and then it stops, so that loop has no flow. With no thermostat connected, the pump is only the speed slider. The same command can land on the heat pump: it runs normally until ambient is above the setpoint, then it stops adding heat and its internal circulator stops. The signal handle sits on the upper left of the heat-pump photo, clear of the supply and return ports on the right. The separate signal wire is adapted from [FluidLab](https://github.com/thepacket/fluidlab) (`src/model/control.ts`), which is MIT licensed, Copyright (c) 2026 Andre Paquette. The divert rule itself is original to this studio.

A heat pump tied only to the buffer (supply into the left inlet, left outlet back to the heat pump) is a closed primary loop. It circulates on Run with no heat users. The buffer warms toward the setpoint; with nothing drawing heat, the supply and return temperatures meet and the heat pump holds. The right-hand side stays idle. The only message is the note that no heat users are connected.

### Mixer (MV)

The mixer is manual only. It uses the same drawing style as the three-way valve, with an **M** in the middle, and it has no signal port. A thermostat wire aimed at it is rejected with the hint that the mixer does not take a thermostat signal.

Ports `h` (hot), `c` (cold) and `out` may each connect to a hot or a cold line. Like the three-way valve, the body does not bridge those ports, so hot and cold can arrive together. The inspector slider is the hot share, 0–100%. At 0% the hot inlet is shut and the outlet is the cold stream. At 100% the cold inlet is shut and the outlet is the hot stream. In between, each inlet is let through in that proportion.

The outlet temperature is the flow-weighted mix of the streams that get through, `Σ(m · T) / Σm`. The outlet flow is the sum of those inlet flows. The pipe that leaves `out` is coloured with that mixed temperature on the same scale as the rest of the studio (blue, through a dusty mid tone, to orange and red).

Either inlet can be fed directly or through tees, junctions, manifolds, and other fittings. Those fittings are not endpoints: a return line can branch through a tee into the cold inlet and still carry the mixed water onward through that same fitting.

The mixer can also recirculate the return of the heat user it is feeding. Buffer supply enters `h`, the outlet feeds the circulation pump and then the radiator, and the radiator return meets a tee (or a junction or a return manifold). One branch comes back to `c`. The other returns to the buffer. The pump, whether it sits on the mixer outlet or on the return before that split, sets the loop flow. The hot share is the fraction drawn from the buffer, and the rest is the recirculated return, so the flow into the buffer matches the flow back out of it. The outlet temperature is settled by repeating the mix, with damping, until it stops changing. It lies between the radiator return and the buffer supply. The cold branch shows flow. The arrangement is not reported as an error.

The cold inlet may instead be tapped straight from a buffer cold inlet: buffer supply still enters `h`, the outlet drives the pump and the heat user, and the user return goes back to the buffer. The tap then carries the cold share of tank water, the hot share comes from the buffer supply, and the full loop flow returns to the buffer, so the buffer stays balanced. The tap shows flow like any other cold feed.

The supply manifold is a hot header: one inlet on top and three or more outlets along the bottom (`branches`, 3–6). The return manifold is a cold header: the same number of inlets on top and one outlet below. Ports are supply-only or return-only, so a hot outlet cannot be tied to a cold return. A junction is a four-way cross; the tee remains the three-port branch.

Click a pipe or a signal to select it. The inspector then offers Delete, the same action as for a part.

The inspector stays closed until a part, a pipe, or a signal is selected. A close button, or a click on empty canvas, puts it away, and the canvas uses the full width. Supply, return, heat, and flow stay in a small readout on the canvas, including while Run is on. The part library is a narrow column and can be hidden. Large display does not enlarge the type or the panels, and it does not turn itself on. It only keeps touch targets and port hit areas comfortable. Pinch-zoom, two-finger pan, finger drag from the library, and fullscreen stay available.
