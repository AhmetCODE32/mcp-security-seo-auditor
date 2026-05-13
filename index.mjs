import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * MCP-SECURITY-SEO-AUDITOR - VERSION 6.0.0
 * Combined Logic: File Management + Security Audit + SEO + Memory History + .txt Reporting
 */

const MEMORY_FILE = "error_memory.json";
const AUDIT_LOG_FILE = "audit_history.json";
const REPORT_FILE = "last_audit_report.txt";

const server = new Server(
  { name: "mcp-security-seo-auditor", version: "6.0.0" },
  { capabilities: { tools: {} } }
);

// --- AUDIT RULES ENGINE ---
const AUDIT_RULES = [
  // Security Rules
  { id: "SECURITY", severity: "CRITICAL", msg: "Hardcoded API Key/Secret detected", reg: /(?:key|api|token|secret).{0,10}['"][a-zA-Z0-9]{16,}['"]/gi },
  { id: "SECURITY", severity: "CRITICAL", msg: "Risky eval() function usage", reg: /eval\(/g },
  { id: "SECURITY", severity: "WARNING", msg: "Potential XSS via dangerouslySetInnerHTML", reg: /dangerouslySetInnerHTML/g },
  { id: "SECURITY", severity: "WARNING", msg: "Sensitive data exposed in console.log", reg: /console\.log\(.*(?:password|secret|token|key|auth)/gi },
  { id: "SECURITY", severity: "WARNING", msg: "Insecure HTTP protocol detected (use HTTPS)", reg: /['"]http:\/\/(?!localhost|127\.0\.0\.1)/g },
  { id: "SECURITY", severity: "CRITICAL", msg: "Potential SQL Injection pattern detected", reg: /(?:query|exec|execute)\s*\(\s*['"`].*\$\{/g },

  // SEO Rules (inverted logic — triggers when NOT found)
  { id: "SEO", severity: "WARNING", msg: "Missing <title> tag", reg: /<title[^>]*>/gi, invertMatch: true },
  { id: "SEO", severity: "WARNING", msg: "Missing meta description tag", reg: /<meta\s+name=["']description["']/gi, invertMatch: true },
  { id: "SEO", severity: "INFO", msg: "Image missing alt attribute", reg: /<img(?![^>]*alt=["'])/gi, invertMatch: false },

  // Compatibility Rules
  { id: "COMPAT", severity: "INFO", msg: "Legacy ReactDOM.render pattern (use createRoot)", reg: /ReactDOM\.render/g },
  { id: "COMPAT", severity: "INFO", msg: "Legacy Bootstrap import detected", reg: /@import\s+["']bootstrap/g }
];

// 1. DEFINING ALL TOOLS
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_directory",
        description: "Lists all files and folders in a specified directory path.",
        inputSchema: {
          type: "object",
          properties: { dirPath: { type: "string", description: "Path to the directory" } },
          required: ["dirPath"]
        }
      },
      {
        name: "read_file",
        description: "Reads the content of a specific file.",
        inputSchema: {
          type: "object",
          properties: { filePath: { type: "string", description: "Path to the file" } },
          required: ["filePath"]
        }
      },
      {
        name: "comprehensive_audit",
        description: "Scans for security risks, SEO tags, and legacy code. Generates a .txt report.",
        inputSchema: {
          type: "object",
          properties: { filePath: { type: "string", description: "Path to audit" } },
          required: ["filePath"]
        }
      },
      {
        name: "apply_fix_and_save",
        description: "Saves new content to a file and logs the issue/solution to memory and history.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: { type: "string" },
            newContent: { type: "string" },
            issueDetected: { type: "string" },
            solution: { type: "string" }
          },
          required: ["filePath", "newContent"]
        }
      }
    ]
  };
});

// 2. UNIFIED TOOL LOGIC
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // --- TOOL: LIST DIRECTORY ---
    if (name === "list_directory") {
      const entries = await fs.readdir(args.dirPath, { withFileTypes: true });
      const formatted = entries.map(e => `${e.isDirectory() ? "[DIR]" : "[FILE]"} ${e.name}`);
      return { content: [{ type: "text", text: formatted.join("\n") }] };
    }

    // --- TOOL: READ FILE ---
    if (name === "read_file") {
      const content = await fs.readFile(args.filePath, "utf-8");
      return { content: [{ type: "text", text: content }] };
    }

    // --- TOOL: COMPREHENSIVE AUDIT & .TXT REPORTING ---
    if (name === "comprehensive_audit") {
      const content = await fs.readFile(args.filePath, "utf-8");
      const fileName = path.basename(args.filePath);
      const findings = [];

      // Run all audit rules
      for (const rule of AUDIT_RULES) {
        const matches = rule.reg.test(content);
        // Reset regex lastIndex for global patterns
        rule.reg.lastIndex = 0;

        if (rule.invertMatch && !matches) {
          findings.push({ ...rule, count: 1 });
        } else if (!rule.invertMatch && matches) {
          findings.push({ ...rule, count: (content.match(rule.reg) || []).length });
        }
      }

      // Sort by severity: CRITICAL > WARNING > INFO
      const severityOrder = { CRITICAL: 0, WARNING: 1, INFO: 2 };
      findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      // Build report
      const timestamp = new Date().toLocaleString();
      const divider = "═".repeat(50);
      const reportLines = [
        divider,
        `  MCP-SECURITY-SEO-AUDITOR — AUDIT REPORT`,
        divider,
        `  Generated : ${timestamp}`,
        `  File      : ${fileName}`,
        `  Rules Run : ${AUDIT_RULES.length}`,
        `  Issues    : ${findings.length}`,
        divider,
        ""
      ];

      if (findings.length > 0) {
        findings.forEach((f, i) => {
          const icon = f.severity === "CRITICAL" ? "[!]" : f.severity === "WARNING" ? "[~]" : "[i]";
          reportLines.push(`  ${icon} [${f.severity}] [${f.id}] ${f.msg} (×${f.count})`);
        });
      } else {
        reportLines.push("  [OK] No issues detected. Code is clean.");
      }

      reportLines.push("", divider, `  End of Report`, divider);
      const finalReport = reportLines.join("\n");

      // Write to report file
      await fs.writeFile(REPORT_FILE, finalReport, "utf-8");

      // Log to audit history
      const auditEntry = {
        timestamp: new Date().toISOString(),
        file: fileName,
        issuesFound: findings.length,
        findings: findings.map(f => `[${f.severity}] ${f.msg}`)
      };

      let history = [];
      try { history = JSON.parse(await fs.readFile(AUDIT_LOG_FILE, "utf-8")); } catch {}
      history.push(auditEntry);
      await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(history, null, 2));

      return {
        content: [{
          type: "text",
          text: findings.length > 0
            ? `Audit complete. ${findings.length} issue(s) found and saved to ${REPORT_FILE}:\n\n${findings.map(f => `[${f.severity}] ${f.msg}`).join("\n")}`
            : `PASS: ${fileName} is clean. Report saved to ${REPORT_FILE}.`
        }]
      };
    }

    // --- TOOL: APPLY FIX & SAVE TO MEMORY ---
    if (name === "apply_fix_and_save") {
      const { filePath, newContent, issueDetected, solution } = args;

      // Path safety check — block writes outside the working directory
      const resolvedPath = path.resolve(filePath);
      const cwd = process.cwd();
      if (!resolvedPath.startsWith(cwd)) {
        return {
          content: [{ type: "text", text: `BLOCKED: Write denied. Path "${resolvedPath}" is outside the working directory.` }],
          isError: true
        };
      }

      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, newContent, "utf-8");

      // Log to memory and history
      const logEntry = {
        timestamp: new Date().toISOString(),
        file: filePath,
        issue: issueDetected || "Code Update",
        fix: solution || "Refactored"
      };

      for (const logFile of [MEMORY_FILE, AUDIT_LOG_FILE]) {
        let history = [];
        try {
          const data = await fs.readFile(logFile, "utf-8");
          history = JSON.parse(data);
        } catch { /* File doesn't exist yet */ }
        history.push(logEntry);
        await fs.writeFile(logFile, JSON.stringify(history, null, 2));
      }

      return { content: [{ type: "text", text: `SUCCESS: ${filePath} updated. Incident logged in memory and history.` }] };
    }

  } catch (error) {
    return { content: [{ type: "text", text: `ERROR: ${error.message}` }], isError: true };
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);