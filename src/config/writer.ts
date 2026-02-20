import fs from 'fs';
import path from 'path';
import { McpJsonEntry } from '../servers/base.js';
import { showSuccess, showWarning } from '../utils/ui.js';

interface McpConfig {
  mcpServers: Record<string, McpJsonEntry>;
}

export function getConfigPath(global: boolean): string {
  if (global) {
    return path.join(process.env.HOME || '', '.mcp.json');
  }
  return path.join(process.cwd(), '.mcp.json');
}

export function readExistingConfig(configPath: string): McpConfig {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    showWarning(`Could not read existing config: ${configPath}`);
  }
  return { mcpServers: {} };
}

export function readAllConfigs(): { global: McpConfig; local: McpConfig } {
  const globalPath = getConfigPath(true);
  const localPath = getConfigPath(false);
  return {
    global: readExistingConfig(globalPath),
    local: readExistingConfig(localPath),
  };
}

export function writeConfig(
  configPath: string,
  entries: Record<string, McpJsonEntry>
): void {
  const existing = readExistingConfig(configPath);

  for (const [key, value] of Object.entries(entries)) {
    if (existing.mcpServers[key]) {
      showWarning(`"${key}" already exists, updating.`);
    }
    existing.mcpServers[key] = value;
  }

  fs.writeFileSync(configPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  showSuccess(`Config saved: ${configPath}`);
}
