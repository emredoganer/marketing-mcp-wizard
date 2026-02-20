import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink, showWarning } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';

const enquirer = new Enquirer();

export const googleAds: McpServerPlugin = {
  id: 'google-ads',
  name: 'Google Ads',
  description: 'Ad spend & performance (works through Google Analytics)',
  links: [
    { label: 'Docs', url: 'https://developers.google.com/google-ads/api/docs/start' },
    { label: 'Credentials', url: 'https://console.cloud.google.com/apis/credentials' },
    { label: 'Ads Dashboard', url: 'https://ads.google.com/' },
  ],

  async prompts(): Promise<ServerConfig> {
    showWarning('Google Ads data is accessed through the GA4 integration.');
    showInfo('Make sure your GA4 and Google Ads accounts are linked:');
    showLink('GA4 → Admin → Google Ads Links', 'https://analytics.google.com/');
    console.log();

    showInfo('No separate MCP server installation needed.');
    showInfo('If Google Analytics MCP is set up, Ads data is automatically available.');
    console.log();

    const { customerId } = await enquirer.prompt({
      type: 'input',
      name: 'customerId',
      message: 'Google Ads Customer ID (optional, for reference)',
      initial: '',
    }) as { customerId: string };

    const { confirmed } = await enquirer.prompt({
      type: 'confirm',
      name: 'confirmed',
      message: 'Confirm that the GA4–Ads link is active?',
      initial: true,
    }) as { confirmed: boolean };

    return {
      customerId: customerId.trim(),
      confirmed: confirmed ? 'true' : 'false',
    };
  },

  async test(config: ServerConfig): Promise<boolean> {
    return config.confirmed === 'true';
  },

  getMcpConfig(_config: ServerConfig): McpJsonEntry {
    return {
      command: '',
      args: [],
    };
  },
};
