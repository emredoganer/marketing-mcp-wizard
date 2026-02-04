import chalk from 'chalk';

export function showWelcome(): void {
  console.log();
  console.log(chalk.cyan('  ┌─────────────────────────────────────────────────┐'));
  console.log(chalk.cyan('  │') + chalk.bold.white('   Marketing MCP Wizard                          ') + chalk.cyan('│'));
  console.log(chalk.cyan('  │') + chalk.gray('   Marketing analytics MCP setup for Claude Code  ') + chalk.cyan('│'));
  console.log(chalk.cyan('  └─────────────────────────────────────────────────┘'));
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

export function showCompletionMessage(): void {
  console.log();
  console.log(chalk.bold.green('  ✅ Setup complete!'));
  console.log();
  console.log(chalk.bold.white('  Next steps:'));
  console.log(chalk.white('  1. Restart Claude Code: ') + chalk.cyan('claude'));
  console.log(chalk.white('  2. Verify servers: ') + chalk.cyan('claude mcp list'));
  console.log(chalk.white('  3. Test it out: ') + chalk.cyan('/mcp'));
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
