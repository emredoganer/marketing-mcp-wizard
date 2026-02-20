# Marketing MCP Wizard

Interactive CLI that sets up marketing analytics [MCP servers](https://modelcontextprotocol.io/) for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Connect Google Analytics, Microsoft Clarity, Search Console, Shopify, Meta Ads, and Google Ads to Claude Code in one command.

## Quick Start

```bash
npx marketing-mcp-wizard
```

```
  ┌──────────────────────────────────────────────────────────┐
  │   Marketing MCP Wizard                                   │
  │   Connect your marketing tools to Claude — no coding needed│
  └──────────────────────────────────────────────────────────┘

  ? Which tools would you like to connect?
    ◉ Google Analytics — Website traffic, user behavior, real-time visitors
    ◉ Microsoft Clarity — See what users do — clicks, scrolls, session recordings
    ◉ Google Search Console — How people find you on Google — rankings, clicks, keywords
    ◉ Shopify — Your store data — orders, products, customers
    ◉ Meta Ads — Facebook & Instagram ad campaigns, spend, performance
    ◯ Google Ads — Ad spend & performance (works through Google Analytics)
```

## Supported Servers

| Server | Package | Auth Type |
|--------|---------|-----------|
| Google Analytics | [`analytics-mcp`](https://github.com/MarketerHQ/ga-mcp-server) | Service Account JSON |
| Microsoft Clarity | [`@anthropic-ai/mcp-server-clarity`](https://github.com/microsoft/clarity-mcp-server) | API Key |
| Google Search Console | [`mcp-server-gsc`](https://github.com/nicholasoxford/mcp-server-gsc) | Service Account JSON |
| Shopify | [`shopify-mcp-server`](https://github.com/pashpashpash/shopify-mcp-server) | Access Token |
| Meta Ads | [`meta-ads-mcp`](https://github.com/brijr/meta-mcp) | Access Token |
| Google Ads | via GA4 | GA4 link |

## What It Does

1. **Select** which marketing tools to connect
2. **Enter** credentials with guided prompts and helpful links
3. **Test** each connection automatically
4. **Save** config to `~/.mcp.json` (global) or `.mcp.json` (local)
5. **Done** — restart Claude Code and your marketing data is accessible

## Options

```bash
npx marketing-mcp-wizard              # Interactive setup
npx marketing-mcp-wizard --list       # List supported servers
npx marketing-mcp-wizard --status     # Show which servers are configured
npx marketing-mcp-wizard --skip-tests # Skip connection tests
npx marketing-mcp-wizard --global     # Save to ~/.mcp.json directly
```

## What You Can Do After Setup

Once configured, ask Claude things like:

- **Google Analytics** — "Analyze my website traffic for the last 30 days"
- **Microsoft Clarity** — "Show me sessions with rage clicks from this week"
- **Search Console** — "Which keywords am I ranking for but getting low clicks?"
- **Shopify** — "Show my top-selling products this month"
- **Meta Ads** — "How are my Facebook campaigns performing this week?"
- **Google Ads** — "What's my ad spend and ROAS this month?" (via GA4)

## Output

The wizard generates a `.mcp.json` file compatible with Claude Code:

```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "pipx",
      "args": ["run", "analytics-mcp"],
      "env": {
        "GA4_PROPERTY_ID": "123456789",
        "GOOGLE_PROJECT_ID": "my-project",
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json"
      }
    },
    "clarity": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-clarity", "--project-id", "123", "--api-key", "xxx"]
    },
    "search-console": {
      "command": "npx",
      "args": ["-y", "mcp-server-gsc"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json"
      }
    },
    "shopify": {
      "command": "npx",
      "args": ["-y", "shopify-mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "shpat_xxx",
        "MYSHOPIFY_DOMAIN": "my-store.myshopify.com"
      }
    },
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "meta-ads-mcp"],
      "env": {
        "META_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

## Prerequisites

- **Node.js 18+**
- **pipx** — only needed for Google Analytics ([install](https://pipx.pypa.io/stable/installation/))

## License

MIT
