import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const root = 'C:/Users/venom/projects/openwork-rebrand';

// Server import mappings
const importMappings = {
  // src/
  "'./openwork-extensions-plugin-path.js'": "'./venomcowork-extensions-plugin-path.js'",
  "'./openwork-runtime-config.js'": "'./venomcowork-runtime-config.js'",
  "'./openwork-workspace-config-store.js'": "'./venomcowork-workspace-config-store.js'",
  
  // opencode-plugins/
  "'./openwork-capabilities-knowledge.js'": "'./venomcowork-capabilities-knowledge.js'",
  "'./openwork-extensions-preview.js'": "'./venomcowork-extensions-preview.js'",
  
  // Relative from subdirectories
  "'../openwork-extensions-plugin-path.js'": "'../venomcowork-extensions-plugin-path.js'",
  "'../openwork-runtime-config.js'": "'../venomcowork-runtime-config.js'",
  "'../openwork-workspace-config-store.js'": "'../venomcowork-workspace-config-store.js'",
  "'../openwork-capabilities-knowledge.js'": "'../venomcowork-capabilities-knowledge.js'",
  "'../openwork-extensions-preview.js'": "'../venomcowork-extensions-preview.js'",
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

// Find all TypeScript files in apps/server/src
const files = globSync('apps/server/src/**/*.ts', { cwd: root, absolute: true });

let fixedCount = 0;
for (const file of files) {
  if (fixImportsInFile(file)) {
    fixedCount++;
    console.log(`Fixed imports in: ${file.replace(root + '/', '')}`);
  }
}

console.log(`\nFixed imports in ${fixedCount} files`);