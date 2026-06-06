import pkg from 'png2icons';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const { createICNS } = pkg;

const iconsDir = resolve('apps/desktop/resources/icons');
const generatedDir = resolve('generated-icons');

// ICNS required sizes (in pixels)
const icnsSizes = [
  { size: 16, name: 'icon_16x16.png' },
  { size: 32, name: 'icon_16x16@2x.png' },
  { size: 32, name: 'icon_32x32.png' },
  { size: 64, name: 'icon_32x32@2x.png' },
  { size: 128, name: 'icon_128x128.png' },
  { size: 256, name: 'icon_128x128@2x.png' },
  { size: 256, name: 'icon_256x256.png' },
  { size: 512, name: 'icon_256x256@2x.png' },
  { size: 512, name: 'icon_512x512.png' },
  { size: 1024, name: 'icon_512x512@2x.png' },
];

async function generateICNS() {
  console.log('Generating ICNS...');
  
  const pngBuffers = [];
  
  for (const { size, name } of icnsSizes) {
    let pngPath = `${generatedDir}/icon-${size}x${size}.png`;
    if (!existsSync(pngPath)) {
      // Generate from SVG if not exists
      const sharp = (await import('sharp')).default;
      const buf = await sharp(resolve('brand/venomcowork-logo.svg'), { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toBuffer();
      pngBuffers.push({ buffer: buf, name });
    } else {
      const buf = readFileSync(pngPath);
      pngBuffers.push({ buffer: buf, name });
    }
  }
  
  // Also add 1024 for @2x
  const sharp = (await import('sharp')).default;
  const buf1024 = await sharp(resolve('brand/venomcowork-logo.svg'), { density: 300 })
    .resize(1024, 1024, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
    .png()
    .toBuffer();
  pngBuffers.push({ buffer: buf1024, name: 'icon_512x512@2x.png' });
  
  // Generate ICNS
  const icnsBuffer = createICNS(pngBuffers.map(p => p.buffer));
  writeFileSync(`${iconsDir}/icon.icns`, icnsBuffer);
  
  console.log(`ICNS generated: ${iconsDir}/icon.icns (${icnsBuffer.length} bytes)`);
  
  // Also generate dev icon.icns
  const devPngBuffers = [
    { buffer: readFileSync(`${iconsDir}/dev/32x32.png`), name: 'icon_32x32.png' },
    { buffer: readFileSync(`${iconsDir}/dev/128x128.png`), name: 'icon_128x128.png' },
    { buffer: readFileSync(`${iconsDir}/dev/128x128@2x.png`), name: 'icon_128x128@2x.png' },
  ];
  
  const devIcnsBuffer = createICNS(devPngBuffers.map(p => p.buffer));
  writeFileSync(`${iconsDir}/dev/icon-dev.icns`, devIcnsBuffer);
  
  console.log(`Dev ICNS generated: ${iconsDir}/dev/icon-dev.icns (${devIcnsBuffer.length} bytes)`);
}

generateICNS().catch(console.error);