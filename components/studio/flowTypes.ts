export type StudioNodeData = {
  componentId: string;
  params: Record<string, number>;
  rotation: number;
  /**
   * Visual size override from direct canvas resizing. Always mirrors the
   * node's style dimensions (unrotated). Absent means the registry default
   * from componentBox(), so diagrams saved before resizing stay compatible.
   * Never read by the hydraulic simulation.
   */
  size?: { width: number; height: number };
};
