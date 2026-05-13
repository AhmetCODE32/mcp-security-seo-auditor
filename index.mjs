import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * SEYCERI MASTER AUDITOR - VERSION 6.0.0
 * Combined Logic: File Management + Security Audit + SEO + Memory History + .txt Reporting
 */

const MEMORY_FILE = "error_memory.json";
const AUDIT_LOG_FILE = "audit_history.json";
const REPORT_FILE = "last_audit_report.txt";

const server = new Server(
  { name: "seyceri-master-auditor", version: "6.0.0" },
  { capabilities: { tools: {} } }
);

// 1. DEFINING ALL TOOLS (No Features Removed)
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
      const files = await fs.readdir(args.dirPath);
      return { content: [{ type: "text", text: files.join("\n") }] };
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
      let reportLines = [];

      // Audit Rules
      const rules = [
        { id: "SECURITY", msg: "CRITICAL: Hardcoded API Key/Secret detected", reg: /(?:key|api|token|secret).{0,10}['"][a-zA-Z0-9]{16,}['"]/gi },
        { id: "SECURITY", msg: "WARNING: Potential XSS via dangerouslySetInnerHTML", reg: /dangerouslySetInnerHTML/g },
        { id: "SECURITY", msg: "CRITICAL: Risky eval() function usage", reg: /eval\(/g },
        { id: "SEO", msg: "SEO: Missing Meta Title/Description tags", reg: /<(title|meta name="description")/gi },
        { id: "SEO", msg: "SEO: Missing Image Alt attributes", reg: /<img(?!.*?alt=['"])/gi },
        { id: "COMPAT", msg: "LEGACY: Old React/CSS patterns detected", reg: /ReactDOM\.render|@import "bootstrap"/g }
      ];

      // Run Checks
      rules.forEach(r => {
        if (r.id === "SEO" && r.msg.includes("Title")) {
          if (!r.reg.test(content)) reportLines.push(`[${r.id}] ${r.msg}`);
        } else {
          if (r.reg.test(content)) reportLines.push(`[${r.id}] ${r.msg}`);
        }
      });

      // Prepare Report for .txt file
      const reportHeader = `MASTER AUDIT REPORT\nGenerated: ${new Date().toLocaleString()}\nFile: ${fileName}\n${"=".repeat(30)}\n\n`;
      const reportBody = reportLines.length > 0 ? reportLines.join("\n") : "Result: No major issues detected. Code is clean.";
      const finalReport = reportHeader + reportBody;

      // Write to Report File
      await fs.writeFile(REPORT_FILE, finalReport, "utf-8");

      return {
        content: [{
          type: "text",
          text: reportLines.length > 0
            ? `Audit complete. Issues found and saved to ${REPORT_FILE}:\n\n${reportLines.join("\n")}`
            : `Success: ${fileName} is clean. Report saved to ${REPORT_FILE}.`
        }]
      };
    }

    // --- TOOL: APPLY FIX & SAVE TO MEMORY ---
    if (name === "apply_fix_and_save") {
      const { filePath, newContent, issueDetected, solution } = args;
      const dir = path.dirname(filePath);

      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, newContent, "utf-8");

      // Logging to Memory (error_memory.json) and History (audit_history.json)
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
        } catch (e) { /* File doesn't exist yet */ }
        history.push(logEntry);
        await fs.writeFile(logFile, JSON.stringify(history, null, 2));
      }

      return { content: [{ type: "text", text: `SUCCESS: ${filePath} updated. Incident logged in memory and history files.` }] };
    }

  } catch (error) {
    return { content: [{ type: "text", text: `ERROR: ${error.message}` }], isError: true };
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);