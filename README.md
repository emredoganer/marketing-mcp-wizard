# Marketing MCP Wizard

Interactive CLI that sets up marketing analytics [MCP servers](https://modelcontextprotocol.io/) for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Connect Google Analytics, Microsoft Clarity, Search Console, Shopify, and Google Ads to Claude Code in one command.

## Quick Start

```bash
npx marketing-mcp-wizard
```

```
  ┌─────────────────────────────────────────────────┐
  │   Marketing MCP Wizard                          │
  │   Marketing analytics MCP setup for Claude Code  │
  └─────────────────────────────────────────────────┘

  ? Which MCP servers would you like to set up?
    ◉ Google Analytics — GA4 reports, user metrics, real-time data
    ◉ Microsoft Clarity — Session recordings, heatmaps, UX analytics
    ◉ Google Search Console — SEO performance, search queries, indexing
    ◯ Google Ads — Ad performance (via GA4 integration)
```

## Supported Servers

| Server | Package | Auth Type |
|--------|---------|-----------|
| Google Analytics | [`analytics-mcp`](https://github.com/MarketerHQ/ga-mcp-server) | Service Account JSON |
| Microsoft Clarity | [`@anthropic-ai/mcp-server-clarity`](https://github.com/microsoft/clarity-mcp-server) | API Key |
| Google Search Console | [`mcp-server-gsc`](https://github.com/nicholasoxford/mcp-server-gsc) | Service Account JSON |
| Shopify | [`shopify-mcp-server`](https://github.com/pashpashpash/shopify-mcp-server) | Access Token |
| Google Ads | via GA4 | GA4 link |

## What It Does

1. **Select** which marketing MCP servers to set up
2. **Enter** credentials with guided prompts and helpful links
3. **Test** each connection automatically
4. **Save** config to `~/.mcp.json` (global) or `.mcp.json` (local)
5. **Done** — restart Claude Code and your marketing data is accessible

## Options

```bash
npx marketing-mcp-wizard              # Interactive setup
npx marketing-mcp-wizard --list       # List supported servers
npx marketing-mcp-wizard --skip-tests # Skip connection tests
npx marketing-mcp-wizard --global     # Save to ~/.mcp.json directly
```

## What You Can Do After Setup

Once configured, Claude Code can:

- **Google Analytics** — Query GA4 reports, active users, sessions, bounce rates, real-time data
- **Microsoft Clarity** — View session recordings, dead clicks, rage clicks, scroll depth, JS errors
- **Search Console** — Analyze search queries, impressions, CTR, indexing status, SEO performance
- **Shopify** — Manage products, orders, customers, discounts, and draft orders
- **Google Ads** — Access ad clicks, costs, CPC, ROAS through GA4 integration

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
    }
  }
}
```

## Prerequisites

- **Node.js 18+**
- **pipx** — required for Google Analytics ([install](https://pipx.pypa.io/stable/installation/))

## License

MIT
