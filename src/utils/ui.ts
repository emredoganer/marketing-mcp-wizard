import chalk from 'chalk';

export function showWelcome(): void {
  console.log();
  console.log(chalk.cyan('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(chalk.cyan('  │') + chalk.bold.white('   Marketing MCP Wizard                                   ') + chalk.cyan('│'));
  console.log(chalk.cyan('  │') + chalk.gray('   Connect your marketing tools to Claude — no coding needed') + chalk.cyan('│'));
  console.log(chalk.cyan('  └──────────────────────────────────────────────────────────┘'));
  console.log();
}

export function showStepHeader(current: number, total: number, name: string): void {
  console.log();
  console.log(chalk.bold.cyan(`  Step ${current}/${total}: ${name}`));
  console.log(chalk.cyan('  ' + '─'.repeat(38)));
}

export function showInfo(message: string): void {
  console.log(chalk.blue('  ℹ ') + message);
}

export function showLink(label: string, url: string): void {
  console.log(chalk.gray('    → ') + chalk.underline.blue(url) + (label ? chalk.gray(` (${label})`) : ''));
}

export function showSuccess(message: string): void {
  console.log(chalk.green('  ✔ ') + message);
}

export function showError(message: string): void {
  console.log(chalk.red('  ✖ ') + message);
}

export function showWarning(message: string): void {
  console.log(chalk.yellow('  ⚠ ') + message);
}

const promptSuggestions: Record<string, { label: string; prompts: string[] }> = {
  'google-analytics': {
    label: 'Google Analytics',
    prompts: [
      'Analyze my website traffic for the last 30 days',
      'Which pages have the highest bounce rate?',
    ],
  },
  'clarity': {
    label: 'Microsoft Clarity',
    prompts: [
      'Show me sessions with rage clicks from this week',
      'What is the average scroll depth on my homepage?',
    ],
  },
  'search-console': {
    label: 'Search Console',
    prompts: [
      'Which keywords am I ranking for but getting low clicks?',
      'Are there any pages with indexing issues?',
    ],
  },
  'meta-ads': {
    label: 'Meta Ads',
    prompts: [
      'How are my Facebook campaigns performing this week?',
      'Which ad set has the best ROAS?',
    ],
  },
};

export function showCompletionMessage(configuredServers?: string[]): void {
  console.log();
  console.log(chalk.bold.green('  ✅ All set!'));
  console.log();
  console.log(chalk.bold.white('  Next steps:'));
  console.log(chalk.white('  1. Restart Claude Code: ') + chalk.cyan('claude'));
  console.log(chalk.white('  2. Verify servers: ') + chalk.cyan('claude mcp list'));
  console.log(chalk.white('  3. Test it out: ') + chalk.cyan('/mcp'));

  if (configuredServers && configuredServers.length > 0) {
    const relevant = configuredServers.filter(id => promptSuggestions[id]);
    if (relevant.length > 0) {
      console.log();
      console.log(chalk.bold.white('  Try asking Claude:'));
      for (const id of relevant) {
        const suggestion = promptSuggestions[id];
        console.log();
        console.log(chalk.cyan(`    ${suggestion.label}`));
        for (const prompt of suggestion.prompts) {
          console.log(chalk.gray('    → ') + chalk.white(`"${prompt}"`));
        }
      }
    }
  }

  console.log();
  console.log(chalk.gray('  Docs: ') + chalk.underline.blue('https://github.com/emredoganer/marketing-mcp-wizard'));
  console.log();
}

export function showServerList(servers: Array<{ name: string; description: string }>): void {
  console.log();
  console.log(chalk.bold.white('  Supported MCP Servers:'));
  console.log();
  for (const server of servers) {
    console.log(chalk.cyan('  • ') + chalk.bold.white(server.name) + chalk.gray(' — ' + server.description));
  }
  console.log();
}

export function showStatus(
  configured: Array<{ id: string; name: string; source: string }>,
  notConfigured: Array<{ id: string; name: string }>,
): void {
  console.log();
  console.log(chalk.bold.white('  Marketing MCP Status:'));
  console.log();
  for (const s of configured) {
    console.log(chalk.green('  ✓ ') + chalk.bold.white(s.name.padEnd(22)) + chalk.gray(`— configured (${s.source})`));
  }
  for (const s of notConfigured) {
    if (s.id === 'google-ads') {
      console.log(chalk.yellow('  ~ ') + chalk.white(s.name.padEnd(22)) + chalk.gray('— via GA4 (no separate config needed)'));
    } else {
      console.log(chalk.red('  ✗ ') + chalk.white(s.name.padEnd(22)) + chalk.gray('— not configured'));
    }
  }
  console.log();
  console.log(chalk.gray('  Run ') + chalk.cyan('npx marketing-mcp-wizard') + chalk.gray(' to set up missing servers.'));
  console.log();
}
