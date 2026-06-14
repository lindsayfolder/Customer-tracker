#!/usr/bin/env node
/**
 * generate-assets.js
 * Creates icon.png (1024x1024) and splash.png (1242x2436) for the MIT CS app.
 * Uses the 'canvas' npm package if available; otherwise falls back to raw PNG generation
 * using only Node.js built-ins (zlib).
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// ─── Raw PNG Generator ─────────────────────────────────────────────────────────
// Creates a solid-color PNG using only built-in Node.js modules.
//
// PNG file structure:
//   [8-byte signature]
//   [IHDR chunk] width, height, bit depth, color type, etc.
//   [IDAT chunk] zlib-compressed image data
//   [IEND chunk]
//
// Each scanline is preceded by a filter byte (0 = None).
// For an RGB image: each row is [0, R, G, B, R, G, B, ...]

function writePNG(filePath, width, height, r, g, b) {
  // Build raw image data: filter byte + RGB pixels per row
  const rowSize = 1 + width * 3; // filter byte + 3 bytes per pixel
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowStart + 1 + x * 3;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }

  // Compress image data with zlib (deflate)
  const compressed = zlib.deflateSync(rawData, { level: 6 });

  // ── Helper functions for chunk construction ──
  function uint32BE(n) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(n, 0);
    return buf;
  }

  function crc32(buf) {
    // Standard CRC-32 table
    const table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        t[i] = c;
      }
      return t;
    })();

    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii');
    const dataLen = uint32BE(data.length);
    const crcInput = Buffer.concat([typeBytes, data]);
    const crcBytes = uint32BE(crc32(crcInput));
    return Buffer.concat([dataLen, typeBytes, data, crcBytes]);
  }

  // ── PNG Signature ──
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // ── IHDR chunk ──
  // Width (4), Height (4), Bit depth (1=8), Color type (1=2 RGB),
  // Compression (1=0), Filter (1=0), Interlace (1=0)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // ── IDAT chunk ──
  const idatChunk = makeChunk('IDAT', compressed);

  // ── IEND chunk ──
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  // ── Assemble and write PNG ──
  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filePath, png);
}

// ─── Try canvas first ──────────────────────────────────────────────────────────
function tryCanvas() {
  try {
    const { createCanvas } = require('canvas');

    // icon.png — 1024x1024
    function createIcon(filePath, width, height, label) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      // Accent bar at top
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(0, 0, width, Math.round(height * 0.08));

      // Text
      const fontSize = Math.round(width * 0.22);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, width / 2, height / 2);

      // Subtitle
      const subSize = Math.round(width * 0.07);
      ctx.font = `${subSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('Computer Science', width / 2, height / 2 + fontSize * 0.8);

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
      console.log(`Created ${filePath} (${width}x${height}) using canvas`);
    }

    createIcon(path.join(assetsDir, 'icon.png'), 1024, 1024, 'MIT CS');
    createIcon(path.join(assetsDir, 'splash.png'), 1242, 2436, 'MIT CS');
    return true;
  } catch (e) {
    return false;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────
if (!tryCanvas()) {
  console.log('canvas not available — generating solid-color PNG placeholders using raw PNG');

  // Dark blue: #1a1a2e → R=26, G=26, B=46
  const [r, g, b] = [26, 26, 46];

  const iconPath = path.join(assetsDir, 'icon.png');
  const splashPath = path.join(assetsDir, 'splash.png');

  console.log('Generating icon.png (1024x1024)...');
  writePNG(iconPath, 1024, 1024, r, g, b);
  console.log(`Created ${iconPath}`);

  console.log('Generating splash.png (1242x2436)...');
  writePNG(splashPath, 1242, 2436, r, g, b);
  console.log(`Created ${splashPath}`);
}

console.log('Asset generation complete.');
