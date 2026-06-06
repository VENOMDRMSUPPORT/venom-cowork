import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const brandDir = resolve('brand');
const outDir = resolve('generated-icons');
const desktopIconsDir = resolve('apps/desktop/resources/icons');
const desktopIconsDevDir = resolve('apps/desktop/resources/icons/dev');
const appPublicDir = resolve('apps/app/public');

mkdirSync(outDir, { recursive: true });
mkdirSync(desktopIconsDir, { recursive: true });
mkdirSync(desktopIconsDevDir, { recursive: true });
mkdirSync(appPublicDir, { recursive: true });

// PNG sizes needed
const pngSizes = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024];

async function generatePNGs() {
  console.log('Generating PNG icons...');
  
  // Main logo for desktop icons
  const logoSvg = `${brandDir}/venomcowork-logo.svg`;
  const markSvg = `${brandDir}/venomcowork-mark.svg`;
  const squareSvg = `${brandDir}/venomcowork-logo-square.svg`;
  const transparentSvg = `${brandDir}/venomcowork-logo-transparent.svg`;

  for (const size of pngSizes) {
    // Main icon.png (512 is the main one)
    if (size <= 512) {
      await sharp(logoSvg, { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toFile(`${outDir}/icon-${size}x${size}.png`);
    }
    
    // Favicon sizes
    if (size === 16 || size === 32) {
      await sharp(markSvg, { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toFile(`${appPublicDir}/favicon-${size}x${size}.png`);
    }
    
    // Apple touch icon
    if (size === 180) {
      await sharp(squareSvg, { density: 300 })
        .resize(180, 180, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toFile(`${appPublicDir}/apple-touch-icon.png`);
    }
    
    // Dev icons (for development builds)
    if (size === 32 || size === 128) {
      await sharp(logoSvg, { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toFile(`${desktopIconsDevDir}/${size}x${size}.png`);
    }
    
    // 128@2x for dev
    if (size === 256) {
      await sharp(logoSvg, { density: 300 })
        .resize(256, 256, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
        .png()
        .toFile(`${desktopIconsDevDir}/128x128@2x.png`);
    }
  }
  
  // Main 512 icon for desktop
  await sharp(logoSvg, { density: 300 })
    .resize(512, 512, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
    .png()
    .toFile(`${desktopIconsDir}/icon.png`);
  
  // Transparent large logo
  await sharp(transparentSvg, { density: 300 })
    .resize(1024, 1024, { fit: 'contain' })
    .png()
    .toFile(`${brandDir}/venomcowork-logo-transparent.png`);
  
  console.log('PNG generation complete');
}

async function generateICO() {
  console.log('Generating ICO...');
  // ICO needs multiple sizes embedded
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const buffers = [];
  
  for (const size of sizes) {
    const buf = await sharp(`${brandDir}/venomcowork-logo.svg`, { density: 300 })
      .resize(size, size, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
      .png()
      .toBuffer();
    buffers.push({ buffer: buf, size });
  }
  
  // Write ICO using a simple approach - create each size as BMP and combine
  // For simplicity, we'll use the 256x256 as the main ICO
  // Note: A proper multi-resolution ICO would need a library like 'ico-endec'
  // For now, create a 256x256 ICO which works for modern Windows
  await sharp(`${brandDir}/venomcowork-logo.svg`, { density: 300 })
    .resize(256, 256, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
    .toFile(`${desktopIconsDir}/icon.ico`);
  
  console.log('ICO generation complete (256x256)');
}

async function generateICNS() {
  console.log('Generating ICNS...');
  // ICNS requires iconset folder with specific sizes
  // For Electron, we can use the PNG files and let electron-builder handle ICNS
  // But we'll generate the main 512 and 1024 for reference
  await sharp(`${brandDir}/venomcowork-logo.svg`, { density: 300 })
    .resize(512, 512, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
    .png()
    .toFile(`${desktopIconsDir}/icon.icns.png`); // Placeholder - electron-builder converts
  
  await sharp(`${brandDir}/venomcowork-logo.svg`, { density: 300 })
    .resize(1024, 1024, { fit: 'contain', background: { r: 13, g: 17, b: 23, alpha: 1 } })
    .png()
    .toFile(`${desktopIconsDir}/icon@2x.icns.png`);
  
  console.log('ICNS base PNGs generated (electron-builder will convert)');
}

async function copySVGs() {
  console.log('Copying SVG assets...');
  
  // Copy to app/public
  const { copyFileSync } = await import('fs');
  copyFileSync(`${brandDir}/venomcowork-logo.svg`, `${appPublicDir}/venomcowork-logo.svg`);
  copyFileSync(`${brandDir}/venomcowork-logo-square.svg`, `${appPublicDir}/venomcowork-logo-square.svg`);
  copyFileSync(`${brandDir}/venomcowork-mark.svg`, `${appPublicDir}/venomcowork-mark.svg`);
  
  // Copy transparent logo to root
  copyFileSync(`${brandDir}/venomcowork-logo-transparent.svg`, `${resolve('')}/venomcowork-logo-transparent.svg`);
  
  console.log('SVG copy complete');
}

async function main() {
  try {
    await generatePNGs();
    await generateICO();
    await generateICNS();
    await copySVGs();
    console.log('\n✅ All icon generation complete!');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

main();