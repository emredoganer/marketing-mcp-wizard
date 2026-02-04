import { Command } from 'commander';
import { runWizard } from './wizard.js';
import { servers } from './servers/index.js';
import { showServerList } from './utils/ui.js';

const program = new Command();

program
  .name('marketing-mcp-wizard')
  .description('Set up marketing analytics MCP servers for Claude Code')
  .version('1.0.0');

program
  .option('--list', 'List supported MCP servers')
  .option('--skip-tests', 'Skip connection tests')
  .option('--global', 'Save directly to global config (~/.mcp.json)')
  .action(async (options) => {
    if (options.list) {
      showServerList(servers.map(s => ({ name: s.name, description: s.description })));
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
