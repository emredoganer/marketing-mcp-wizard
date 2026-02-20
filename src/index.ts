import { Command } from 'commander';
import { runWizard } from './wizard.js';
import { servers } from './servers/index.js';
import { readAllConfigs } from './config/writer.js';
import { showServerList, showStatus } from './utils/ui.js';

const program = new Command();

program
  .name('marketing-mcp-wizard')
  .description('Connect your marketing tools to Claude Code')
  .version('1.1.0');

program
  .option('--list', 'List supported MCP servers')
  .option('--status', 'Show which servers are configured')
  .option('--skip-tests', 'Skip connection tests')
  .option('--global', 'Save directly to global config (~/.mcp.json)')
  .action(async (options) => {
    if (options.list) {
      showServerList(servers.map(s => ({ name: s.name, description: s.description })));
      process.exit(0);
    }

    if (options.status) {
      const configs = readAllConfigs();
      const allKeys = new Set([
        ...Object.keys(configs.global.mcpServers),
        ...Object.keys(configs.local.mcpServers),
      ]);

      const configured: Array<{ id: string; name: string; source: string }> = [];
      const notConfigured: Array<{ id: string; name: string }> = [];

      for (const server of servers) {
        if (allKeys.has(server.id)) {
          const source = configs.local.mcpServers[server.id] ? 'local' : 'global';
          configured.push({ id: server.id, name: server.name, source });
        } else {
          notConfigured.push({ id: server.id, name: server.name });
        }
      }

      showStatus(configured, notConfigured);
      process.exit(0);
    }

    try {
      await runWizard({
        skipTests: options.skipTests || false,
        global: options.global || false,
      });
    } catch (err) {
      if ((err as Error).message?.includes('cancelled')) {
        console.log('\n  Cancelled.\n');
      } else {
        console.error('\n  Error:', err);
      }
      process.exit(1);
    }
  });

program.parse();
