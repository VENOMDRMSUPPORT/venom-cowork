import pkg from 'ico-endec';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const { encode } = pkg;

const generatedDir = resolve('generated-icons');
const iconsDir = resolve('apps/desktop/resources/icons');

// ICO sizes to include
const sizes = [16, 24, 32, 48, 64, 128, 256];

async function generateICO() {
  console.log('Generating proper multi-resolution ICO...');
  
  const images = [];
  
  for (const size of sizes) {
    const pngPath = `${generatedDir}/icon-${size}x${size}.png`;
    const pngBuffer = readFileSync(pngPath);
    images.push({
      width: size,
      height: size,
      buffer: new Uint8Array(pngBuffer)
    });
  }
  
  const icoBuffer = encode(images);
  writeFileSync(`${iconsDir}/icon.ico`, icoBuffer);
  
  console.log(`ICO generated: ${iconsDir}/icon.ico (${icoBuffer.length} bytes)`);
  console.log(`Included sizes: ${sizes.join(', ')}`);
}

generateICO().catch(console.error);