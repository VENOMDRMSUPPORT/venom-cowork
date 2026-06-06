import { readFileSync, writeFileSync, existsSync } from 'fs';
import { globSync } from 'glob';

const root = 'C:/Users/venom/projects/openwork-rebrand';

// Import path mappings (old -> new)
const importMappings = {
  // apps/app/src/lib
  "'../../../app/lib/openwork-deployment'": "'../../../app/lib/venomcowork-deployment'",
  "'../../../../app/lib/openwork-deployment'": "'../../../../app/lib/venomcowork-deployment'",
  "'@/app/lib/openwork-deployment'": "'@/app/lib/venomcowork-deployment'",
  
  "'../../../app/lib/openwork-env-runtime'": "'../../../app/lib/venomcowork-env-runtime'",
  "'../../../../app/lib/openwork-env-runtime'": "'../../../../app/lib/venomcowork-env-runtime'",
  "'@/app/lib/openwork-env-runtime'": "'@/app/lib/venomcowork-env-runtime'",
  
  "'../../../app/lib/openwork-links'": "'../../../app/lib/venomcowork-links'",
  "'../../../../app/lib/openwork-links'": "'../../../../app/lib/venomcowork-links'",
  
  "'../../../app/lib/openwork-server'": "'../../../app/lib/venomcowork-server'",
  "'../../../../app/lib/openwork-server'": "'../../../../app/lib/venomcowork-server'",
  "'@/app/lib/openwork-server'": "'@/app/lib/venomcowork-server'",
  
  // domains/cloud
  "'../../domains/cloud/openwork-models-promo'": "'../../domains/cloud/venomcowork-models-promo'",
  "'../../../domains/cloud/openwork-models-promo'": "'../../../domains/cloud/venomcowork-models-promo'",
  "'../../domains/cloud/openwork-models-startup-dialog'": "'../../domains/cloud/venomcowork-models-startup-dialog'",
  "'../../../domains/cloud/openwork-models-startup-dialog'": "'../../../domains/cloud/venomcowork-models-startup-dialog'",
  "'@/react-app/domains/cloud/openwork-models-promo'": "'@/react-app/domains/cloud/venomcowork-models-promo'",
  "'@/react-app/domains/cloud/openwork-models-startup-dialog'": "'@/react-app/domains/cloud/venomcowork-models-startup-dialog'",
  
  // domains/connections
  "'../openwork-server-provider'": "'../venomcowork-server-provider'",
  "'../../domains/connections/openwork-server-provider'": "'../../domains/connections/venomcowork-server-provider'",
  "'../openwork-server-store'": "'../venomcowork-server-store'",
  "'../../domains/connections/openwork-server-store'": "'../../domains/connections/venomcowork-server-store'",
  "'../../../domains/connections/openwork-server-store'": "'../../../domains/connections/venomcowork-server-store'",
  "'@/react-app/domains/connections/openwork-server-store'": "'@/react-app/domains/connections/venomcowork-server-store'",
  
  // domains/settings
  "'../openwork-voice-config'": "'../venomcowork-voice-config'",
  "'../../domains/settings/openwork-voice-config'": "'../../domains/settings/venomcowork-voice-config'",
  
  // domains/workspace
  "'../openwork-den-help-link'": "'../venomcowork-den-help-link'",
  "'../../domains/workspace/openwork-den-help-link'": "'../../domains/workspace/venomcowork-den-help-link'",
  
  // shell
  "'../desktop-local-openwork'": "'../desktop-local-venomcowork'",
  "'../../shell/desktop-local-openwork'": "'../../shell/desktop-local-venomcowork'",
  "'./desktop-local-openwork'": "'./desktop-local-venomcowork'",
  "'@/react-app/shell/desktop-local-openwork'": "'@/react-app/shell/desktop-local-venomcowork'",
  
  "'../openwork-connection'": "'../venomcowork-connection'",
  "'../../shell/openwork-connection'": "'../../shell/venomcowork-connection'",
  "'./openwork-connection'": "'./venomcowork-connection'",
  "'@/react-app/shell/openwork-connection'": "'@/react-app/shell/venomcowork-connection'",
  "'@/app/lib/openwork-connection'": "'@/app/lib/venomcowork-connection'",
  
  // workspace
  "'../../../app/lib/openwork-server'": "'../../../app/lib/venomcowork-server'",
  "'../../app/lib/openwork-server'": "'../../app/lib/venomcowork-server'",
  "'../../../app/lib/openwork-env-runtime'": "'../../../app/lib/venomcowork-env-runtime'",
  "'../../../app/lib/openwork-deployment'": "'../../../app/lib/venomcowork-deployment'",
  "'../../app/lib/openwork-server'": "'../../app/lib/venomcowork-server'",
  "'../../app/lib/openwork-env-runtime'": "'../../app/lib/venomcowork-env-runtime'",
  "'../../app/lib/openwork-deployment'": "'../../app/lib/venomcowork-deployment'",
};

function fixImportsInFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [oldImport, newImport] of Object.entries(importMappings)) {
    if (content.includes(oldImport)) {
      content = content.split(oldImport).join(newImport);
      changed = true;
    }
  }
  
  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Find all TypeScript/TSX files in apps/app/src
const files = globSync('apps/app/src/**/*.{ts,tsx}', { cwd: root, absolute: true });

let fixedCount = 0;
for (const file of files) {
  if (fixImportsInFile(file)) {
    fixedCount++;
    console.log(`Fixed imports in: ${file.replace(root + '/', '')}`);
  }
}

console.log(`\nFixed imports in ${fixedCount} files`);

// Also fix the test file
const testFile = 'C:/Users/venom/projects/openwork-rebrand/apps/app/tests/openwork-env-runtime.test.ts';
if (existsSync(testFile)) {
  let content = readFileSync(testFile, 'utf8');
  content = content.replace(/openwork-env-runtime/g, 'venomcowork-env-runtime');
  writeFileSync(testFile, content, 'utf8');
  console.log('Fixed test file imports');
}

// Rename test file
import { renameSync } from 'fs';
try {
  renameSync(
    'C:/Users/venom/projects/openwork-rebrand/apps/app/tests/openwork-env-runtime.test.ts',
    'C:/Users/venom/projects/openwork-rebrand/apps/app/tests/venomcowork-env-runtime.test.ts'
  );
  console.log('Renamed test file');
} catch (e) {
  console.log('Test file already renamed or not found');
}