import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';

const enquirer = new Enquirer();

export const clarity: McpServerPlugin = {
  id: 'clarity',
  name: 'Microsoft Clarity',
  description: 'Session recordings, heatmaps, UX analytics',
  links: [
    { label: 'Docs', url: 'https://github.com/microsoft/clarity-mcp-server' },
    { label: 'Get API Token', url: 'https://clarity.microsoft.com/' },
    { label: 'Dashboard', url: 'https://clarity.microsoft.com/' },
  ],

  async prompts(): Promise<ServerConfig> {
    showInfo('Find your Clarity Project ID in the dashboard:');
    showLink('Settings → Overview', 'https://clarity.microsoft.com/');
    console.log();

    const { projectId } = await enquirer.prompt({
      type: 'input',
      name: 'projectId',
      message: 'Clarity Project ID',
      validate: (v: string) => v.trim().length > 0 || 'Project ID is required',
    }) as { projectId: string };

    showInfo('Get your API Token from Clarity:');
    showLink('Settings → Setup → API', 'https://clarity.microsoft.com/');
    console.log();

    const { apiKey } = await enquirer.prompt({
      type: 'password',
      name: 'apiKey',
      message: 'Clarity API Token',
      validate: (v: string) => v.trim().length > 0 || 'API Token is required',
    }) as { apiKey: string };

    return {
      projectId: projectId.trim(),
      apiKey: apiKey.trim(),
    };
  },

  async test(config: ServerConfig): Promise<boolean> {
    return config.projectId.length > 0 && config.apiKey.length > 0;
  },

  getMcpConfig(config: ServerConfig): McpJsonEntry {
    return {
      command: 'npx',
      args: [
        '-y',
        '@anthropic-ai/mcp-server-clarity',
        '--project-id', config.projectId,
        '--api-key', config.apiKey,
      ],
    };
  },
};
