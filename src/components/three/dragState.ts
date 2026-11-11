/**
 * Rotação extra aplicada pelo usuário ao aparelho da vitrine (arrastar / botões).
 * Fica fora do React porque é lida e escrita a cada quadro — só existe um palco na página.
 */
export const dragState = { yaw: 0, pitch: 0, dragging: false };

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export const drag = {
  reset() {
    dragState.yaw = 0;
    dragState.pitch = 0;
  },
  start() {
    dragState.dragging = true;
  },
  end() {
    dragState.dragging = false;
  },
  move(dx: number, dy: number, allowPitch: boolean) {
    dragState.yaw = clamp(dragState.yaw + dx * 0.008, 2.4);
    if (allowPitch) dragState.pitch = clamp(dragState.pitch + dy * 0.005, 0.7);
  },
  nudge(direction: number) {
    dragState.yaw = clamp(dragState.yaw + direction * 0.5, 2.4);
  },
};
