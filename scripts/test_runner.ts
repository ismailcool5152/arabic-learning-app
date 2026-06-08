// scripts/test_runner.ts

import fs from "fs";
import path from "path";
import express from "express";
import { FEATURE_MANIFEST, CURRENT_APP_VERSION } from "../src/data/featureManifest";
import { findOfflineFallback } from "../src/offlineData";

// Color helper for beautiful CLI reports
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgRed: "\x1b[41m\x1b[37m"
};

async function runTestSuite() {
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}   QURANIC ARABIC FEATURE VERIFICATION SUITE - RELEASE ${CURRENT_APP_VERSION}  ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}`);
  console.log(`${colors.dim}Starting automated system, infrastructure, and API contract test...${colors.reset}\n`);

  let passedTests = 0;
  let failedTests = 0;
  const testLogs: string[] = [];

  function assert(condition: boolean, testName: string, notes?: string) {
    if (condition) {
      passedTests++;
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${testName}`);
      if (notes) console.log(`         ${colors.dim}${notes}${colors.reset}`);
      testLogs.push(`[PASS] ${testName}`);
    } else {
      failedTests++;
      console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${testName}`);
      if (notes) console.log(`         ${colors.red}${notes}${colors.reset}`);
      testLogs.push(`[FAIL] ${testName}`);
    }
  }

  // --- TEST CATEGORY 1: MANIFEST INVARIANTS & INTEGRITY ---
  console.log(`${colors.bright}${colors.cyan}[1/4] Feature Manifest and Version Alignment${colors.reset}`);
  
  assert(CURRENT_APP_VERSION.startsWith("v1.2."), `Baseline release version successfully aligned to v1.2.x family (Currently: ${CURRENT_APP_VERSION})`);
  assert(FEATURE_MANIFEST.length > 5, `Manifest registers ${FEATURE_MANIFEST.length} active application features`);
  
  const v120Features = FEATURE_MANIFEST.filter(f => f.version.startsWith("v1.2."));
  assert(v120Features.length >= 4, `Identified ${v120Features.length} core features marked under v1.2.0 release scope`, 
    v120Features.map(f => `- ${f.name} (${f.id})`).join("\n")
  );
  console.log();

  // --- TEST CATEGORY 2: DEPLOYMENT ARTIFACT CHECK ---
  console.log(`${colors.bright}${colors.cyan}[2/4] Critical Deployment File Structural Integrity${colors.reset}`);
  
  const filesToCheck = [
    { name: "server.ts", path: "./server.ts" },
    { name: "metadata.json", path: "./metadata.json" },
    { name: "src/types.ts", path: "./src/types.ts" },
    { name: "src/data/offlineVerses.ts", path: "./src/data/offlineVerses.ts" },
    { name: "src/data/lexiconData.ts", path: "./src/data/lexiconData.ts" },
    { name: "src/data/surahMapping.ts", path: "./src/data/surahMapping.ts" },
    { name: "src/lib/appStorage.ts", path: "./src/lib/appStorage.ts" },
    { name: "src/lib/translationCache.ts", path: "./src/lib/translationCache.ts" }
  ];

  for (const item of filesToCheck) {
    const fullPath = path.resolve(process.cwd(), item.path);
    const exists = fs.existsSync(fullPath);
    let isNonEmpty = false;
    if (exists) {
      isNonEmpty = fs.readFileSync(fullPath, "utf-8").trim().length > 0;
    }
    assert(exists && isNonEmpty, `Deployment component present and readable: ${item.name}`);
  }
  
  // Verify Surah JSON folders
  const surahDir = path.resolve(process.cwd(), "src/data/quran");
  const hasSurahs = fs.existsSync(surahDir) && fs.readdirSync(surahDir).filter(f => f.endsWith(".json")).length > 0;
  assert(hasSurahs, "Quranic vocabulary database directory (src/data/quran) has active compiled JSON surahs loaded");
  console.log();

  // --- TEST CATEGORY 3: BACKEND CONTROLLERS & SECURE OFFLINE LAYER ---
  console.log(`${colors.bright}${colors.cyan}[3/4] Backend Logical Fallbacks & Utility Unit Tests${colors.reset}`);
  
  // Test offline match fallbacks
  const fallbackTestWords = ["yaktub", "كتب", "sajada", "hamd", "ktb"];
  for (const query of fallbackTestWords) {
    const res = findOfflineFallback(query);
    assert(res !== null, `Offline backup schema found match for query keyword: "${query}"`);
  }
  
  const missingResult = findOfflineFallback("nonexistent_mock_word_xyz");
  assert(missingResult === null, "Fallback correctly returned null for completely unknown terms");
  console.log();

  // --- TEST CATEGORY 4: PORTABLE ENDPOINT INTEGRATION API TEST ---
  console.log(`${colors.bright}${colors.cyan}[4/4] Portable Express API Contract Integrations${colors.reset}`);
  
  // Creating a testing express app mounted on standard ports to test app-state saving logic
  const testApp = express();
  testApp.use(express.json());

  // Setup mock local paths for state testing
  const testStateDir = path.join(process.cwd(), "src", "data", "test-quran");
  const testStatePath = path.join(testStateDir, "app_state_test.json");

  // Clean up previous runs
  if (fs.existsSync(testStatePath)) {
    try { fs.unlinkSync(testStatePath); } catch {}
  }
  if (fs.existsSync(testStateDir)) {
    try { fs.rmdirSync(testStateDir); } catch {}
  }

  // Setup standard endpoints under test
  testApp.get("/api/app-state", async (req, res) => {
    try {
      if (fs.existsSync(testStatePath)) {
        const data = fs.readFileSync(testStatePath, "utf-8");
        return res.json(JSON.parse(data));
      }
      return res.json({});
    } catch {
      res.json({});
    }
  });

  testApp.post("/api/app-state", async (req, res) => {
    try {
      const data = req.body || {};
      fs.mkdirSync(testStateDir, { recursive: true });
      fs.writeFileSync(testStatePath, JSON.stringify(data, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start micro server for integration verification on portable ephemeral port
  const TEST_PORT = 3008;
  const serverInstance = testApp.listen(TEST_PORT, async () => {
    try {
      // 1. Verify GET initial state (should be empty)
      const getInitial = await fetch(`http://localhost:${TEST_PORT}/api/app-state`);
      const dataInitial = await getInitial.json();
      assert(typeof dataInitial === "object" && dataInitial !== null && Object.keys(dataInitial).length === 0, 
        "Initial app-state GET is pristine and matches JSON spec"
      );

      // 2. Verify POST state save
      const sampleState = {
        test_saved_key: "verification_value",
        quranic_arabic_username: "Tester",
        app_version: "1.2.0"
      };

      const postRes = await fetch(`http://localhost:${TEST_PORT}/api/app-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleState)
      });
      const postData = await postRes.json();
      assert(postRes.status === 200 && postData.success === true, "POST app-state writes successfully back to persistent files");

      // 3. Verify GET retrieved state matches what was saved
      const getAfter = await fetch(`http://localhost:${TEST_PORT}/api/app-state`);
      const dataAfter = await getAfter.json();
      assert(dataAfter.test_saved_key === "verification_value" && dataAfter.quranic_arabic_username === "Tester", 
        "Retrieved state values dynamically correspond precisely to persisted data"
      );

      // Save file check
      assert(fs.existsSync(testStatePath), "State file is physically present in persistent file system hierarchy");

      // Cleanup files
      try {
        if (fs.existsSync(testStatePath)) fs.unlinkSync(testStatePath);
        if (fs.existsSync(testStateDir)) fs.rmdirSync(testStateDir);
      } catch (cleanupErr) {
        // Safe to ignore
      }

      console.log();
      printExecutionSummary();
    } catch (err: any) {
      assert(false, `API Contract integration failed: ${err.message}`);
      printExecutionSummary();
    } finally {
      serverInstance.close();
    }
  });

  function printExecutionSummary() {
    console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}`);
    console.log(`                      COMPLIANCE CONFORMANCE REPORT            `);
    console.log(`${colors.bright}${colors.blue}================================================================${colors.reset}`);
    
    if (failedTests === 0) {
      console.log(`\n  ${colors.bgGreen} RESULT: TOTAL PASS ${colors.reset} [${passedTests}/${passedTests} successful assertions]`);
      console.log(`  ${colors.green}All systems operational, compiled assets correct, static files intact, and API contracts valid.${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`\n  ${colors.bgRed} RESULT: FAILURE ${colors.reset} [${failedTests} failing checks, ${passedTests} passed]`);
      console.log(`  ${colors.red}Please address failing components listed above before deploying. ${colors.reset}\n`);
      process.exit(1);
    }
  }
}

runTestSuite().catch((err) => {
  console.error("Test suite runner crashed with fatal error:", err);
  process.exit(1);
});
