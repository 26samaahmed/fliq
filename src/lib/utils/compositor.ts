const LAYOUT_CONFIG: Record<string, { w: number; h: number; slots: { x: number; y: number; w: number; h: number }[] }> = {
  '1x3': {
    w: 120, h: 362,
    slots: [
      { x: 8, y: 10, w: 103, h: 79 },
      { x: 8, y: 101, w: 103, h: 80 },
      { x: 8, y: 193, w: 103, h: 81 },
    ]
  },
  '1x4': {
    w: 120, h: 445,
    slots: [
      { x: 8, y: 10, w: 103, h: 79 },
      { x: 8, y: 101, w: 103, h: 80 },
      { x: 8, y: 193, w: 103, h: 81 },
      { x: 8, y: 286, w: 103, h: 81 },
    ]
  },
  '2x2v': {
    w: 240, h: 362,
    slots: [
      { x: 9,   y: 14,  w: 106, h: 125 },
      { x: 124, y: 14,  w: 106, h: 125 },
      { x: 9,   y: 151, w: 106, h: 125 },
      { x: 124, y: 151, w: 106, h: 125 },
    ]
  },
  '2x2h': {
    w: 362, h: 240,
    slots: [
      { x: 14,  y: 10,  w: 125, h: 106 },
      { x: 151, y: 10,  w: 125, h: 106 },
      { x: 14,  y: 125, w: 125, h: 106 },
      { x: 151, y: 125, w: 125, h: 106 },
    ]
  }
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    setTimeout(() => reject(new Error('Image load timed out')), 10_000);
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const slotAspect = dw / dh;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgAspect > slotAspect) {
    sw = img.naturalHeight * slotAspect;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / slotAspect;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export async function compositeStrip(
  layout: string,
  photoDataUrls: string[],
  frameBase: string,
  frameOverlay: string = ''
): Promise<string> {
  const config = LAYOUT_CONFIG[layout] ?? LAYOUT_CONFIG['1x3'];
  const SCALE = 4;
  const cw = config.w * SCALE;
  const ch = config.h * SCALE;

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  if (frameBase) {
    const base = await loadImage(frameBase);
    ctx.drawImage(base, 0, 0, cw, ch);
  }

  for (let i = 0; i < config.slots.length; i++) {
    const photo = photoDataUrls[i];
    if (!photo) continue;
    const slot = config.slots[i];
    const img = await loadImage(photo);
    drawCover(ctx, img, slot.x * SCALE, slot.y * SCALE, slot.w * SCALE, slot.h * SCALE);
  }

  if (frameOverlay) {
    const overlay = await loadImage(frameOverlay);
    ctx.drawImage(overlay, 0, 0, cw, ch);
  }

  return canvas.toDataURL('image/png');
}