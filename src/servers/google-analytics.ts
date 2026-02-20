import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';

const enquirer = new Enquirer();

export const googleAnalytics: McpServerPlugin = {
  id: 'google-analytics',
  name: 'Google Analytics',
  description: 'Website traffic, user behavior, real-time visitors',
  links: [
    { label: 'Docs', url: 'https://github.com/MarketerHQ/ga-mcp-server' },
    { label: 'Create Service Account', url: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
    { label: 'GA4 Dashboard', url: 'https://analytics.google.com/' },
  ],

  async prompts(): Promise<ServerConfig> {
    showInfo('Find your GA4 Property ID in Google Analytics:');
    showLink('Admin → Property Settings', 'https://analytics.google.com/');
    console.log();

    const { propertyId } = await enquirer.prompt({
      type: 'input',
      name: 'propertyId',
      message: 'GA4 Property ID',
      validate: (v: string) => v.trim().length > 0 || 'Property ID is required',
    }) as { propertyId: string };

    showInfo('Find your Google Cloud Project ID in Cloud Console:');
    showLink('Projects', 'https://console.cloud.google.com/');
    console.log();

    const { projectId } = await enquirer.prompt({
      type: 'input',
      name: 'projectId',
      message: 'Google Cloud Project ID',
      validate: (v: string) => v.trim().length > 0 || 'Project ID is required',
    }) as { projectId: string };

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
      propertyId: propertyId.trim(),
      projectId: projectId.trim(),
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
      command: 'pipx',
      args: ['run', 'analytics-mcp'],
      env: {
        GA4_PROPERTY_ID: config.propertyId,
        GOOGLE_PROJECT_ID: config.projectId,
        GOOGLE_APPLICATION_CREDENTIALS: path.resolve(resolvedPath),
      },
    };
  },
};
