import chalk from 'chalk';
import ora from 'ora';
// @ts-ignore
import Enquirer from 'enquirer';
import { execSync } from 'child_process';
import { McpServerPlugin, McpJsonEntry } from './servers/base.js';
import { servers } from './servers/index.js';
import { getConfigPath, writeConfig } from './config/writer.js';
import {
  showWelcome,
  showStepHeader,
  showInfo,
  showLink,
  showSuccess,
  showError,
  showWarning,
  showCompletionMessage,
} from './utils/ui.js';

const enquirer = new Enquirer();

interface WizardOptions {
  skipTests: boolean;
  global: boolean;
}

function checkPrerequisites(): void {
  showInfo('Checking your setup...');

  // Check Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    showSuccess(`Node.js: ${nodeVersion}`);
  } catch {
    showError('Node.js not found. Install it: https://nodejs.org');
    process.exit(1);
  }

  // Check npx
  try {
    execSync('npx --version', { encoding: 'utf-8', stdio: 'pipe' });
    showSuccess('npx available');
  } catch {
    showWarning('npx not found. It comes with npm.');
  }

  // Check pipx (optional, needed for GA)
  try {
    execSync('pipx --version', { encoding: 'utf-8', stdio: 'pipe' });
    showSuccess('pipx available');
  } catch {
    showWarning('pipx not found — only needed for Google Analytics. Skip for now or install later.');
    showLink('Install pipx', 'https://pipx.pypa.io/stable/installation/');
  }

  console.log();
}

async function selectServers(): Promise<McpServerPlugin[]> {
  const choices = servers.map(s => ({
    name: s.id,
    message: `${s.name} ${chalk.gray('— ' + s.description)}`,
  }));

  const { selected } = await enquirer.prompt({
    type: 'multiselect',
    name: 'selected',
    message: 'Which tools would you like to connect?',
    choices,
    validate: (v: any) => (Array.isArray(v) ? v.length > 0 : !!v) || 'Select at least one',
  }) as { selected: string[] };

  return servers.filter(s => selected.includes(s.id));
}

async function setupServer(
  plugin: McpServerPlugin,
  step: number,
  total: number,
  skipTests: boolean
): Promise<{ id: string; config: McpJsonEntry } | null> {
  showStepHeader(step, total, plugin.name);

  // Show links
  for (const link of plugin.links) {
    showLink(link.label, link.url);
  }
  console.log();

  // Collect config via prompts
  const config = await plugin.prompts();

  // Google Ads is informational only
  if (plugin.id === 'google-ads') {
    if (config.confirmed === 'true') {
      showSuccess('GA4–Ads link confirmed. Ads data accessible via GA4.');
    } else {
      showWarning('GA4–Ads link not confirmed. Check GA4 Admin → Google Ads Links.');
    }
    return null;
  }

  // Test connection
  if (!skipTests) {
    const spinner = ora({
      text: `Testing ${plugin.name} connection...`,
      indent: 2,
    }).start();

    try {
      const result = await plugin.test(config);
      if (result) {
        spinner.succeed(`${plugin.name} connection successful`);
      } else {
        spinner.fail(`${plugin.name} connection test failed`);
        const { continueAnyway } = await enquirer.prompt({
          type: 'confirm',
          name: 'continueAnyway',
          message: "Connection couldn't be verified. Save and try later?",
          initial: true,
        }) as { continueAnyway: boolean };
        if (!continueAnyway) return null;
      }
    } catch (err) {
      spinner.fail(`${plugin.name} test error`);
      showError(String(err));
      const { continueAnyway } = await enquirer.prompt({
        type: 'confirm',
        name: 'continueAnyway',
        message: "Connection couldn't be verified. Save and try later?",
        initial: true,
      }) as { continueAnyway: boolean };
      if (!continueAnyway) return null;
    }
  } else {
    showWarning('Connection test skipped (--skip-tests)');
  }

  return {
    id: plugin.id,
    config: plugin.getMcpConfig(config),
  };
}

async function chooseConfigLocation(forceGlobal: boolean): Promise<string> {
  if (forceGlobal) {
    return getConfigPath(true);
  }

  const { location } = await enquirer.prompt({
    type: 'select',
    name: 'location',
    message: 'Where should the config be saved?',
    choices: [
      { name: 'global', message: `Global (~/.mcp.json) ${chalk.gray('— all projects')}` },
      { name: 'local', message: `Local (.mcp.json) ${chalk.gray('— this directory only')}` },
    ],
  }) as { location: string };

  return getConfigPath(location === 'global');
}

export async function runWizard(options: WizardOptions): Promise<void> {
  showWelcome();
  checkPrerequisites();

  const selectedServers = await selectServers();
  if (selectedServers.length === 0) {
    showWarning('No servers selected. Exiting.');
    return;
  }

  const entries: Record<string, McpJsonEntry> = {};
  let step = 0;
  const total = selectedServers.length;

  for (const server of selectedServers) {
    step++;
    const result = await setupServer(server, step, total, options.skipTests);
    if (result) {
      entries[result.id] = result.config;
    }
  }

  if (Object.keys(entries).length === 0) {
    showWarning('No config to save.');
    return;
  }

  // Choose where to save
  const configPath = await chooseConfigLocation(options.global);

  // Write config
  writeConfig(configPath, entries);

  showCompletionMessage(Object.keys(entries));
}
