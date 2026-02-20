import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';

const enquirer = new Enquirer();

export const searchConsole: McpServerPlugin = {
  id: 'search-console',
  name: 'Google Search Console',
  description: 'How people find you on Google — rankings, clicks, keywords',
  links: [
    { label: 'Docs', url: 'https://github.com/nicholasoxford/mcp-server-gsc' },
    { label: 'Create Service Account', url: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
    { label: 'Search Console', url: 'https://search.google.com/search-console' },
  ],

  async prompts(): Promise<ServerConfig> {
    showInfo('Find your site URL in Search Console:');
    showLink('Sites list', 'https://search.google.com/search-console');
    console.log();

    const { siteUrl } = await enquirer.prompt({
      type: 'input',
      name: 'siteUrl',
      message: 'Site URL (e.g. https://example.com/)',
      validate: (v: string) => {
        if (!v.trim()) return 'Site URL is required';
        if (!v.startsWith('http')) return 'URL must start with http:// or https://';
        return true;
      },
    }) as { siteUrl: string };

    showInfo('A Service Account JSON key file is required:');
    showLink('Create key → JSON format', 'https://console.cloud.google.com/iam-admin/serviceaccounts');
    console.log();

    const { credentials } = await enquirer.prompt({
      type: 'input',
      name: 'credentials',
      message: 'Service Account JSON file path',
      initial: '~/.config/google-credentials.json',
      validate: (v: string) => {
        const resolved = v.replace(/^~/, process.env.HOME || '');
        if (!fs.existsSync(resolved)) return `File not found: ${resolved}`;
        return true;
      },
    }) as { credentials: string };

    return {
      siteUrl: siteUrl.trim(),
      credentials: credentials.trim(),
    };
  },

  async test(config: ServerConfig): Promise<boolean> {
    const resolved = config.credentials.replace(/^~/, process.env.HOME || '');
    if (!fs.existsSync(resolved)) return false;
    try {
      const content = fs.readFileSync(resolved, 'utf-8');
      const json = JSON.parse(content);
      return !!(json.type && json.project_id && json.private_key);
    } catch {
      return false;
    }
  },

  getMcpConfig(config: ServerConfig): McpJsonEntry {
    const resolvedPath = config.credentials.replace(/^~/, process.env.HOME || '');
    return {
      command: 'npx',
      args: ['-y', 'mcp-server-gsc'],
      env: {
        GOOGLE_APPLICATION_CREDENTIALS: path.resolve(resolvedPath),
      },
    };
  },
};
