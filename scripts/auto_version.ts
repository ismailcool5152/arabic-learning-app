// scripts/auto_version.ts

import fs from "fs";
import path from "path";
import crypto from "crypto";

// Relative paths configured safe from root
const APP_SRC_DIR = path.resolve(process.cwd(), "src");
const SERVER_FILE = path.resolve(process.cwd(), "server.ts");
const PACKAGE_JSON_PATH = path.resolve(process.cwd(), "package.json");
const MANIFEST_TS_PATH = path.resolve(process.cwd(), "src/data/featureManifest.ts");
const CHANGELOG_JSON_PATH = path.resolve(process.cwd(), "src/data/changelog.json");
const VERSION_DB_PATH = path.resolve(process.cwd(), "scripts/version_db.json");

// Exclude these paths from the checksum scanner to prevent infinite change loops
const EXCLUDED_SCAN_FILES = [
  "changelog.json",
  "version_db.json",
  "test-quran",
  "app_state_test.json"
];

// Helper to calculate file hashes
function getFileChecksum(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(fileContent).digest("hex");
  } catch {
    return "";
  }
}

// Find recursively all source files we care about tracing
function scanSourceFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    // Skip exclusions
    if (EXCLUDED_SCAN_FILES.some(ex => itemPath.includes(ex))) {
      continue;
    }
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      scanSourceFiles(itemPath, fileList);
    } else if (
      itemPath.endsWith(".ts") ||
      itemPath.endsWith(".tsx") ||
      itemPath.endsWith(".json") ||
      itemPath.endsWith(".css") ||
      itemPath.endsWith(".html")
    ) {
      fileList.push(itemPath);
    }
  }
  return fileList;
}

function runAutoVersion() {
  console.log("\x1b[34m[Auto Version] Checking workspace delta since last build...\x1b[0m");

  // Gather current file system state
  const scannedFiles = scanSourceFiles(APP_SRC_DIR);
  if (fs.existsSync(SERVER_FILE)) {
    scannedFiles.push(SERVER_FILE);
  }

  const currentStates: Record<string, string> = {};
  for (const file of scannedFiles) {
    const relativePath = path.relative(process.cwd(), file);
    currentStates[relativePath] = getFileChecksum(file);
  }

  // Load previous states databases if available
  let previousStates: Record<string, string> = {};
  if (fs.existsSync(VERSION_DB_PATH)) {
    try {
      previousStates = JSON.parse(fs.readFileSync(VERSION_DB_PATH, "utf-8"));
    } catch {
      previousStates = {};
    }
  }

  const addedFiles: string[] = [];
  const modifiedFiles: string[] = [];
  const deletedFiles: string[] = [];

  // Compare file states
  for (const file of Object.keys(currentStates)) {
    if (!previousStates[file]) {
      addedFiles.push(file);
    } else if (previousStates[file] !== currentStates[file]) {
      modifiedFiles.push(file);
    }
  }

  for (const file of Object.keys(previousStates)) {
    if (!currentStates[file]) {
      deletedFiles.push(file);
    }
  }

  const totalChanges = addedFiles.length + modifiedFiles.length + deletedFiles.length;

  if (totalChanges === 0) {
    console.log("\x1b[32m[Auto Version] Up to date! No changes detected in source components.\x1b[0m");
    return;
  }

  console.log(`\x1b[33m[Auto Version] Found ${totalChanges} file variations:\x1b[0m`);
  addedFiles.forEach(f => console.log(`  + Added:    \x1b[32m${f}\x1b[0m`));
  modifiedFiles.forEach(f => console.log(`  ✎ Modified: \x1b[36m${f}\x1b[0m`));
  deletedFiles.forEach(f => console.log(`  - Deleted:  \x1b[31m${f}\x1b[0m`));

  // Determine current versions
  let pkgData: any = {};
  let currentVersion = "1.2.0";
  try {
    pkgData = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));
    currentVersion = pkgData.version || "1.2.0";
  } catch {
    pkgData = {};
  }

  // Calculate new version
  const parts = currentVersion.split(".").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) {
    parts[0] = 1;
    parts[1] = 2;
    parts[2] = 0;
  }

  // Auto-increment the patch number on code modifications
  parts[2] += 1;
  const nextVersion = parts.join(".");
  const versionString = `v${nextVersion}`;

  console.log(`\x1b[32m[Auto Version] Version bumped automatically: v${currentVersion} ➜ ${versionString}\x1b[0m`);

  // Write updated version back to package.json
  pkgData.version = nextVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkgData, null, 2), "utf-8");

  // Write updated version to/src/data/featureManifest.ts
  if (fs.existsSync(MANIFEST_TS_PATH)) {
    let manifestContent = fs.readFileSync(MANIFEST_TS_PATH, "utf-8");
    const versionRegex = /export const CURRENT_APP_VERSION = "[v\d\.]+";/;
    if (versionRegex.test(manifestContent)) {
      manifestContent = manifestContent.replace(
        versionRegex,
        `export const CURRENT_APP_VERSION = "${versionString}";`
      );
      fs.writeFileSync(MANIFEST_TS_PATH, manifestContent, "utf-8");
      console.log(`\x1b[32m[Auto Version] Synchronized manifest export constant to ${versionString}\x1b[0m`);
    }
  }

  // Update dynamic changelog database
  let changelog: any[] = [];
  if (fs.existsSync(CHANGELOG_JSON_PATH)) {
    try {
      changelog = JSON.parse(fs.readFileSync(CHANGELOG_JSON_PATH, "utf-8"));
    } catch {
      changelog = [];
    }
  }

  // Compose a descriptive log description
  let changeSummary = "Refactored applet and updated backend code modules.";
  if (modifiedFiles.length > 0) {
    const mainFiles = modifiedFiles.map(p => path.basename(p)).slice(0, 3).join(", ");
    const trailingCount = modifiedFiles.length > 3 ? ` and ${modifiedFiles.length - 3} others` : "";
    changeSummary = `Automated patch updates to code assets, primarily focused on editing: ${mainFiles}${trailingCount}.`;
  } else if (addedFiles.length > 0) {
    changeSummary = `Introduced new system components and assets: ${addedFiles.map(p => path.basename(p)).join(", ")}.`;
  }

  // Unshift new changelog record to have recent features at the top of the timeline
  changelog.unshift({
    version: versionString,
    timestamp: new Date().toISOString(),
    description: changeSummary,
    filesChanged: [...addedFiles, ...modifiedFiles, ...deletedFiles]
  });

  fs.writeFileSync(CHANGELOG_JSON_PATH, JSON.stringify(changelog, null, 2), "utf-8");
  console.log("\x1b[32m[Auto Version] Logged change audit trail in src/data/changelog.json\x1b[0m");

  // Save updated trace db to prevent double increments next trigger
  // Generate the new snapshot incorporating our updates to manifest to avoid second jump next round
  const manifestRelPath = path.relative(process.cwd(), MANIFEST_TS_PATH);
  currentStates[manifestRelPath] = getFileChecksum(MANIFEST_TS_PATH);
  
  fs.writeFileSync(VERSION_DB_PATH, JSON.stringify(currentStates, null, 2), "utf-8");
  console.log("\x1b[32m[Auto Version] Saved snapshot database successfully.\x1b[0m\n");
}

try {
  runAutoVersion();
} catch (error) {
  console.error("\x1b[31m[Auto Version] Fatal error during automatic bump sequence: \x1b[0m", error);
}
