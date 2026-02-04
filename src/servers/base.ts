export interface McpJsonEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface ServerConfig {
  [key: string]: string;
}

export interface ServerLink {
  label: string;
  url: string;
}

export interface McpServerPlugin {
  id: string;
  name: string;
  description: string;
  links: ServerLink[];
  prompts(): Promise<ServerConfig>;
  test(config: ServerConfig): Promise<boolean>;
  getMcpConfig(config: ServerConfig): McpJsonEntry;
}
