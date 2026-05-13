<div align="center">

# 🛡️ MCP Security SEO Auditor

### Advanced MCP Security & SEO Intelligence Platform

[![Version](https://img.shields.io/badge/Version-6.0.0-0078D4?style=for-the-badge&logo=semanticrelease&logoColor=white)](https://github.com/AhmetCODE32/mcp-security-seo-auditor)
[![License](https://img.shields.io/badge/License-ISC-22C55E?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-Protocol-8B5CF6?style=for-the-badge&logo=anthropic&logoColor=white)](https://modelcontextprotocol.io)

<br/>

**MCP Security SEO Auditor** is an enterprise-grade **Model Context Protocol (MCP)** server that delivers real-time cybersecurity analysis, SEO compliance validation, and intelligent code auditing — all powered by persistent neural memory.

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Features](#-core-features) · [⚙️ Configuration](#%EF%B8%8F-mcp-configuration) · [📊 Architecture](#-architecture) · [👨‍💻 Developer](#-developer)

---

</div>

## ✨ Core Features

<table>
<tr>
<td width="50%">

### 🔐 Security Audit Engine
- **API Key Detection** — Scans for hardcoded secrets, tokens, and API keys leaked in source code
- **XSS Prevention** — Identifies dangerous `dangerouslySetInnerHTML` and `eval()` patterns
- **Threat Classification** — Categorizes findings as `CRITICAL` or `WARNING` severity levels

</td>
<td width="50%">

### 🔍 SEO Guard System
- **Meta Tag Validation** — Ensures `<title>` and `<meta description>` tags are present
- **Image Accessibility** — Detects `<img>` elements missing `alt` attributes
- **Standards Compliance** — Validates adherence to modern web accessibility guidelines

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Neural Memory Engine
- **Persistent History** — Logs every fix and change to `error_memory.json`
- **Audit Timeline** — Maintains a complete operation history in `audit_history.json`
- **Context Awareness** — Never forgets project history across sessions

</td>
<td width="50%">

### 📋 Intelligent Reporting
- **Auto-Generated Reports** — Creates professional `last_audit_report.txt` after each session
- **Structured Output** — Clean, timestamped, categorized findings
- **Legacy Detection** — Flags outdated React/CSS patterns for modernization

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Minimum Version |
|:---|:---|
| **Node.js** | `v18.0.0` or higher |
| **npm** | `v9.0.0` or higher |
| **MCP Client** | Cursor, Claude Desktop, or any MCP-compatible client |

### Installation

```bash
# Clone the repository
git clone https://github.com/AhmetCODE32/mcp-security-seo-auditor.git

# Navigate to the project directory
cd mcp-security-seo-auditor

# Install dependencies
npm install
```

### Run the Server

```bash
node index.mjs
```

> [!NOTE]
> The server communicates via **stdio** transport. It is designed to be launched by an MCP client (Cursor, Claude Desktop, etc.), not used standalone.

---

## ⚙️ MCP Configuration

Add MCP Security SEO Auditor to your MCP client configuration:

### Cursor IDE

Open **Cursor Settings → MCP Servers** and add:

```json
{
  "mcpServers": {
    "mcp-security-seo-auditor": {
      "command": "node",
      "args": ["C:/YOUR_PATH/mcp-security-seo-auditor/index.mjs"]
    }
  }
}
```

### Claude Desktop

Edit your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-security-seo-auditor": {
      "command": "node",
      "args": ["/absolute/path/to/index.mjs"]
    }
  }
}
```

> [!TIP]
> Replace the path with the **absolute path** to your `index.mjs` file for reliable execution.

---

## 🛠️ Available Tools

| Tool | Description | Input |
|:---|:---|:---|
| `list_directory` | Lists all files and folders in a specified directory | `dirPath` — path to directory |
| `read_file` | Reads and returns the content of any file | `filePath` — path to file |
| `comprehensive_audit` | Full security + SEO + compatibility scan with `.txt` report generation | `filePath` — path to audit |
| `apply_fix_and_save` | Applies a fix, saves to file, and logs incident to memory & history | `filePath`, `newContent`, `issueDetected`, `solution` |

---

## 📊 Architecture

```
mcp-security-seo-auditor/
│
├── index.mjs                  # 🏗️  Core MCP server — all tool logic
├── package.json               # 📦  Project manifest & dependencies
│
├── error_memory.json          # 🧠  Persistent neural memory store
├── audit_history.json         # 📜  Complete audit operation timeline
└── last_audit_report.txt      # 📋  Auto-generated latest report
```

### Audit Pipeline

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  MCP Client │────▶│   MCP Auditor     │────▶│  Audit Report   │
│  (Cursor /  │     │                  │     │  (.txt file)    │
│   Claude)   │     │  ┌────────────┐  │     └─────────────────┘
└─────────────┘     │  │ Security   │  │
                    │  │ SEO        │  │     ┌─────────────────┐
                    │  │ Compat     │  │────▶│  Neural Memory  │
                    │  └────────────┘  │     │  (.json files)  │
                    └──────────────────┘     └─────────────────┘
```

---

## 📖 Usage Examples

### Run a Comprehensive Audit

Once connected via your MCP client, simply ask:

```
"Audit the file src/app.jsx for security and SEO issues"
```

The auditor will:
1. Scan for **hardcoded API keys** and **secrets**
2. Check for **XSS vulnerabilities** (`eval`, `dangerouslySetInnerHTML`)
3. Validate **SEO meta tags** and **image alt attributes**
4. Detect **legacy code patterns**
5. Generate a timestamped `.txt` report automatically

### Apply a Fix

```
"Fix the XSS vulnerability in components/UserInput.jsx"
```

The auditor will:
1. Apply the fix to the target file
2. Log the incident to `error_memory.json`
3. Record the operation in `audit_history.json`

---

## 🗺️ Roadmap

- [ ] 🌐 Multi-file recursive directory scanning
- [ ] 📊 HTML dashboard report generation
- [ ] 🔗 Dependency vulnerability analysis (CVE database)
- [ ] 🤖 AI-powered auto-fix suggestions
- [ ] 📈 Audit score & trend tracking over time

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 👨‍💻 Developer

<img src="https://img.shields.io/badge/Built_with-❤️-FF0040?style=for-the-badge" alt="Built with love"/>

### **Ahmet Seyceri**
#### Software Developer & Cybersecurity Researcher

[![GitHub](https://img.shields.io/badge/GitHub-AhmetCODE32-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AhmetCODE32)

<br/>

<sub>Crafted with precision for the global developer community 🌍</sub>

---

<sub>© 2026 Ahmet Seyceri — All Rights Reserved</sub>

</div>