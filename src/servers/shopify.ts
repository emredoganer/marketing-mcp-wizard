import { McpServerPlugin, ServerConfig, McpJsonEntry } from './base.js';
import { showInfo, showLink } from '../utils/ui.js';
// @ts-ignore
import Enquirer from 'enquirer';

const enquirer = new Enquirer();

export const shopify: McpServerPlugin = {
  id: 'shopify',
  name: 'Shopify',
  description: 'Products, orders, customers, discounts, draft orders',
  links: [
    { label: 'Docs', url: 'https://github.com/pashpashpash/shopify-mcp-server' },
    { label: 'Create Custom App', url: 'https://help.shopify.com/en/manual/apps/app-types/custom-apps' },
    { label: 'Shopify Admin', url: 'https://admin.shopify.com/' },
  ],

  async prompts(): Promise<ServerConfig> {
    showInfo('Enter your Shopify store domain:');
    showLink('Example: my-store.myshopify.com', 'https://admin.shopify.com/');
    console.log();

    const { domain } = await enquirer.prompt({
      type: 'input',
      name: 'domain',
      message: 'Shopify store domain (e.g. my-store.myshopify.com)',
      validate: (v: string) => v.trim().length > 0 || 'Store domain is required',
    }) as { domain: string };

    showInfo('Create a Custom App to get your Admin API Access Token:');
    showLink('Settings → Apps → Develop apps', 'https://help.shopify.com/en/manual/apps/app-types/custom-apps');
    console.log();

    const { accessToken } = await enquirer.prompt({
      type: 'password',
      name: 'accessToken',
      message: 'Admin API Access Token',
      validate: (v: string) => v.trim().length > 0 || 'Access Token is required',
    }) as { accessToken: string };

    return {
      domain: domain.trim(),
      accessToken: accessToken.trim(),
    };
  },

  async test(config: ServerConfig): Promise<boolean> {
    return config.domain.length > 0 && config.accessToken.length > 0;
  },

  getMcpConfig(config: ServerConfig): McpJsonEntry {
    return {
      command: 'npx',
      args: ['-y', 'shopify-mcp-server'],
      env: {
        SHOPIFY_ACCESS_TOKEN: config.accessToken,
        MYSHOPIFY_DOMAIN: config.domain,
      },
    };
  },
};
