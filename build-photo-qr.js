const QRCode = require('qrcode');
const sharp = require('sharp');
const jsQR = require('jsqr');

const URL = 'https://www.linkedin.com/in/jateen-yadav/';
const PORTRAIT = 'assets/portrait.png';
const OUT = 'assets/qr-photo.png';

const SIZE = 900;              // final square canvas
const QR_FRAC = 0.34;          // QR badge size as fraction of canvas
const PAD = Math.round(SIZE * 0.03);
const RED = '#E4002B';

(async () => {
  // 1) Portrait: grayscale, square cover-crop to full canvas
  const portrait = await sharp(PORTRAIT)
    .grayscale()
    .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
    .toBuffer();

  // 2) Clean scannable QR (medium ECC is plenty for a solid QR), as PNG
  const qrPx = Math.round(SIZE * QR_FRAC);
  const qrPng = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: qrPx,
    color: { dark: '#0a0a0a', light: '#ffffff' },
  });

  // 3) White rounded card behind the QR badge (with a red hairline)
  const badge = qrPx + PAD; // white plate size
  const radius = Math.round(badge * 0.14);
  const plateSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${badge}" height="${badge}">
       <rect x="0" y="0" width="${badge}" height="${badge}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
       <rect x="1.5" y="1.5" width="${badge - 3}" height="${badge - 3}" rx="${radius}" ry="${radius}" fill="none" stroke="${RED}" stroke-width="3"/>
     </svg>`
  );

  // 4) "Scan me" red pill hint above the badge (optional small label baked in)
  // Keep it minimal; the card already says "Scan to connect".

  // Position badge in bottom-right
  const bx = SIZE - badge - PAD;
  const by = SIZE - badge - PAD;
  const qrOffset = Math.round((badge - qrPx) / 2);

  // 5) Subtle dark gradient at the bottom so the white badge pops over the photo
  const gradSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
           <stop offset="1" stop-color="#000000" stop-opacity="0.45"/>
         </linearGradient>
       </defs>
       <rect x="0" y="0" width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
     </svg>`
  );

  const composite = await sharp(portrait)
    .composite([
      { input: gradSvg, top: 0, left: 0 },
      { input: plateSvg, top: by, left: bx },
      { input: qrPng, top: by + qrOffset, left: bx + qrOffset },
    ])
    .png()
    .toFile(OUT);

  console.log('WROTE', OUT, SIZE + 'x' + SIZE);

  // 6) Verify the QR decodes by cropping the badge region
  const cropSize = badge;
  const cropped = await sharp(OUT)
    .extract({ left: bx, top: by, width: cropSize, height: cropSize })
    .resize(500, 500, { kernel: 'nearest' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const res = jsQR(new Uint8ClampedArray(cropped.data), cropped.info.width, cropped.info.height);
  console.log('DECODED:', res ? res.data : 'FAIL');
  console.log('MATCH:', res && res.data === URL);
})();
