import { Position } from '@xyflow/react';

/** Handle position after a clockwise rotation, with the node box swapped at 90° and 270°. */
export function portPlacement(width: number, height: number, x: number, y: number, rotation: number) {
  const quarter = ((Math.round(rotation / 90) % 4) + 4) % 4;
  const turned = quarter === 1 || quarter === 3;
  const boxW = turned ? height : width;
  const boxH = turned ? width : height;
  const dx = x * width - width / 2;
  const dy = y * height - height / 2;
  let rx = dx;
  let ry = dy;
  if (quarter === 1) { rx = -dy; ry = dx; }
  else if (quarter === 2) { rx = -dx; ry = -dy; }
  else if (quarter === 3) { rx = dy; ry = -dx; }
  const left = rx + boxW / 2;
  const top = ry + boxH / 2;
  const nx = left / boxW;
  const ny = top / boxH;
  let position = Position.Bottom;
  const distances = [
    { position: Position.Left, distance: nx },
    { position: Position.Right, distance: 1 - nx },
    { position: Position.Top, distance: ny },
    { position: Position.Bottom, distance: 1 - ny },
  ];
  position = distances.reduce((best, item) => (item.distance < best.distance ? item : best)).position;
  return {
    boxW,
    boxH,
    style: { left: `${nx * 100}%`, top: `${ny * 100}%` },
    position,
  };
}
