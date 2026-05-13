# 🛡️ Seyceri Master Auditor (V6.0)

Seyceri Master Auditor is an advanced Model Context Protocol (MCP) server designed to perform cybersecurity, SEO, and code compatibility audits on software projects while maintaining a persistent memory of every action taken.

## ✨ Features

* 🔍 **Comprehensive Audit:** One-click detection of cybersecurity risks (API Key leaks, XSS vulnerabilities), SEO deficiencies, and React/Tailwind version compatibility.
* 🧠 **Smart Memory:** Logs every fix and change to 'error_memory.json' and 'audit_history.json' to ensure the system never forgets project history.
* 📝 **Auto-Reporting:** Automatically generates a professional 'last_audit_report.txt' after every audit session.
* 🛠️ **File Management:** Robust tools for reading, listing, and securely modifying file systems.

---

## 🚀 Quick Start

### 1. Installation
Ensure you have Node.js installed. Download this project, navigate to the directory, and install dependencies:

npm install

### 2. Configuration (Cursor / Claude Desktop)
Add this server to your tool configuration:

- Name: Seyceri Auditor
- Type: stdio
- Command: node "C:/PATH_TO_YOUR_PROJECT/index.mjs"

---

## 📂 File Structure

* index.mjs: Core server logic.
* last_audit_report.txt: Automatically generated technical reports.
* error_memory.json: History of errors and applied solutions.
* audit_history.json: Full log of all operations performed.

---

## 👨‍💻 Developer
Ahmet Seyceri — Modern digital solutions and cybersecurity researcher.

## 📝 License
This project is licensed under the ISC License.