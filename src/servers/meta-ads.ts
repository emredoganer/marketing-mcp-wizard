import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';

const enquirer = new Enquirer();

export const metaAds: McpServerPlugin = {
  id: 'meta-ads',
  name: 'Meta Ads',
  description: 'Facebook & Instagram ad campaigns, spend, performance',
  links: [
    { label: 'Docs', url: 'https://github.com/brijr/meta-mcp' },
    { label: 'Get Access Token', url: 'https://developers.facebook.com/tools/explorer/' },
    { label: 'Ads Manager', url: 'https://adsmanager.facebook.com/' },
  ],

  async prompts(): Promise<ServerConfig> {
    showInfo('You need a Meta Marketing API access token.');
    showInfo('Generate one in the Graph API Explorer:');
    showLink('Select "ads_read" permission → Generate', 'https://developers.facebook.com/tools/explorer/');
    console.log();

    const { accessToken } = await enquirer.prompt({
      type: 'password',
      name: 'accessToken',
      message: 'Meta Access Token',
      validate: (v: string) => v.trim().length > 0 || 'Access Token is required',
    }) as { accessToken: string };

    const { appSecret } = await enquirer.prompt({
      type: 'password',
      name: 'appSecret',
      message: 'App Secret (optional — press Enter to skip)',
    }) as { appSecret: string };

    return {
      accessToken: accessToken.trim(),
      appSecret: appSecret.trim(),
    };
  },

  async test(config: ServerConfig): Promise<boolean> {
    return config.accessToken.length > 0;
  },

  getMcpConfig(config: ServerConfig): McpJsonEntry {
    const env: Record<string, string> = {
      META_ACCESS_TOKEN: config.accessToken,
    };
    if (config.appSecret) {
      env.META_APP_SECRET = config.appSecret;
    }
    return {
      command: 'npx',
      args: ['-y', 'meta-ads-mcp'],
      env,
    };
  },
};
