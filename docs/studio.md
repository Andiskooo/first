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

The heat pump node renders `public/studio/symbols/heat-pump.svg`. The path is `asset` on the `heat-pump` entry in `components/studio/registry.ts`.

- Replace that SVG with another SVG or a product photo, keeping the same filename, or
- change `asset` to a new public path, for example `/produktet/pompa-termike-vanguard.png`.

The red supply outlet and blue return inlet stay on the right edge of the frame (`supply-out` at 33% height, `return-in` at 72%). They are handles, not part of the picture, so a photo does not have to include them.

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

Pumps and tees may sit between those devices. A heat user on the left, or the heat pump on the right, is rejected.

The tank separates two hydraulic loops and couples them only by heat:

- **Primary loop** — heat pump supply → optional circulation pump → left inlet; left outlet → heat pump return. Flow is the dedicated pump if one is installed, otherwise the heat pump’s internal circulator. A dedicated pump replaces the internal one, including when its speed is 0.
- **Secondary loop** — right outlets → circulation pump → heat users → right inlets. The internal heat-pump pump does **not** drive this loop.

At steady state the tank temperature is below the heat-pump supply by the primary ΔT, and the heat users see that mixed temperature. Stored energy shown in the panel is `m · cp · (T_tank − 20 °C)` and does not change the steady temperatures; volume is there so a later product image or a larger tank still has a place to live.

The tool simulates one heat pump and one buffer. It is not a design calculation.
