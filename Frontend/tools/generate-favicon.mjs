/**
 * Gera os ícones do Portal de Engenharia (favicon.ico e apple-touch-icon.png)
 * a partir da mesma marca do logotipo: quadrado laranja com treliça estrutural.
 *
 * Uso: node tools/generate-favicon.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const CANVAS = 48; // espaço de desenho, igual ao viewBox do favicon.svg

const GRADIENT = {
  from: [0xf7, 0x90, 0x2a],
  to: [0xd9, 0x62, 0x05],
  y0: 1,
  y1: 47,
};

const MARK_RECT = { x: 1, y: 1, w: 46, h: 46, r: 13 };
const MARK_STROKES = [
  {
    points: [
      [12, 36.5],
      [24, 14.5],
      [36, 36.5],
    ],
    width: 3.4,
  },
  {
    points: [
      [18.5, 36.5],
      [24, 27],
      [29.5, 36.5],
    ],
    width: 2.2,
    opacity: 0.9,
  },
  {
    points: [
      [10, 38.5],
      [38, 38.5],
    ],
    width: 3.4,
  },
];

// --------------------------------------------------------------------------
// Geometria (distância assinada, em unidades do canvas)
// --------------------------------------------------------------------------
function roundedRectSdf(px, py, rect) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const dx = Math.abs(px - cx) - (rect.w / 2 - rect.r);
  const dy = Math.abs(py - cy) - (rect.h / 2 - rect.r);
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  return outside + Math.min(Math.max(dx, dy), 0) - rect.r;
}

function segmentDistance(px, py, [ax, ay], [bx, by]) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSquared = abx * abx + aby * aby;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / lengthSquared));
  return Math.hypot(px - (ax + t * abx), py - (ay + t * aby));
}

function strokeCoverage(px, py, stroke) {
  let distance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < stroke.points.length - 1; i++) {
    distance = Math.min(distance, segmentDistance(px, py, stroke.points[i], stroke.points[i + 1]));
  }
  return distance <= stroke.width / 2 ? (stroke.opacity ?? 1) : 0;
}

// --------------------------------------------------------------------------
// Rasterização com supersampling (RGBA, alpha reto)
// --------------------------------------------------------------------------
function renderIcon(size, { fullBleed = false, markScale = 1 } = {}) {
  const rect = fullBleed ? { x: 0, y: 0, w: CANVAS, h: CANVAS, r: 0 } : MARK_RECT;
  const scale = size / CANVAS;
  const samples = 4;
  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let background = 0;
      let marks = 0;

      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const px = (x + (sx + 0.5) / samples) / scale;
          const py = (y + (sy + 0.5) / samples) / scale;

          if (roundedRectSdf(px, py, rect) <= 0) {
            background++;
          }

          // A marca é desenhada em torno do centro e opcionalmente ampliada.
          const mx = (px - CANVAS / 2) / markScale + CANVAS / 2;
          const my = (py - CANVAS / 2) / markScale + CANVAS / 2;

          for (const stroke of MARK_STROKES) {
            marks = Math.max(marks, strokeCoverage(mx, my, stroke));
          }
        }
      }

      const total = samples * samples;
      const coverage = background / total;
      const markCoverage = (marks * background) / total;
      const t = Math.min(1, Math.max(0, (y / scale - GRADIENT.y0) / (GRADIENT.y1 - GRADIENT.y0)));

      const index = (y * size + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        const base = GRADIENT.from[channel] + (GRADIENT.to[channel] - GRADIENT.from[channel]) * t;
        pixels[index + channel] = Math.round(base * (1 - markCoverage) + 255 * markCoverage);
      }
      pixels[index + 3] = Math.round(coverage * 255);
    }
  }

  return pixels;
}

// --------------------------------------------------------------------------
// Codificação ICO (BITMAPINFOHEADER + BGRA + máscara AND)
// --------------------------------------------------------------------------
function encodeBmpImage(size, rgba) {
  const andStride = Math.ceil(size / 32) * 4;
  const andMask = Buffer.alloc(andStride * size);
  const xor = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const source = ((size - 1 - y) * size + x) * 4;
      const target = (y * size + x) * 4;
      xor[target] = rgba[source + 2];
      xor[target + 1] = rgba[source + 1];
      xor[target + 2] = rgba[source];
      xor[target + 3] = rgba[source + 3];
    }
  }

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(xor.length + andMask.length, 20);

  return Buffer.concat([header, xor, andMask]);
}

function encodeIco(images) {
  const directory = Buffer.alloc(6 + images.length * 16);
  directory.writeUInt16LE(0, 0);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(images.length, 4);

  const blobs = [];
  let offset = directory.length;

  images.forEach((image, index) => {
    const blob = encodeBmpImage(image.size, image.pixels);
    const entry = 6 + index * 16;
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, entry);
    directory.writeUInt8(image.size >= 256 ? 0 : image.size, entry + 1);
    directory.writeUInt8(0, entry + 2);
    directory.writeUInt8(0, entry + 3);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(blob.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += blob.length;
    blobs.push(blob);
  });

  return Buffer.concat([directory, ...blobs]);
}

// --------------------------------------------------------------------------
// Codificação PNG (RGBA, 8 bits, sem interlace)
// --------------------------------------------------------------------------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function encodePng(size, rgba) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filtro "none"
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --------------------------------------------------------------------------
// Saída
// --------------------------------------------------------------------------
const ico = encodeIco([16, 32, 48].map((size) => ({ size, pixels: renderIcon(size) })));
writeFileSync(resolve(OUT_DIR, 'favicon.ico'), ico);

const appleTouch = encodePng(180, renderIcon(180, { fullBleed: true, markScale: 1.35 }));
writeFileSync(resolve(OUT_DIR, 'apple-touch-icon.png'), appleTouch);

console.log(`favicon.ico: ${ico.length} bytes (16, 32 e 48 px)`);
console.log(`apple-touch-icon.png: ${appleTouch.length} bytes (180 px)`);
