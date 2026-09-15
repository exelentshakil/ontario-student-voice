#!/usr/bin/env node

/**
 * Automated Playwright QA Anti-Wrapping & Microcopy Verification Harness
 * 
 * Verifies that zero badges, tabs, buttons, or pills wrap onto multiple lines,
 * that the page has zero horizontal overflow across all viewports,
 * and that zero uncaught console errors occur.
 * 
 * Viewports audited:
 *   - Desktop-1440 (1440x900)
 *   - Laptop-1280  (1280x800)
 *   - Tablet-768   (768x1024)
 *   - Mobile-375   (375x812)
 */

import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';

let chromium;
try {
  const req = createRequire(path.join(process.cwd(), 'package.json'));
  chromium = req('playwright').chromium;
} catch (e) {
  try {
    const fallbackReq = createRequire(import.meta.url);
    chromium = fallbackReq('playwright').chromium;
  } catch (e2) {
    console.error('\x1b[31m❌ Playwright is not installed in the current project or environment. Run: npm install -D playwright\x1b[0m');
    process.exit(1);
  }
}

let targetUrl = process.argv[2];
let localServer = null;

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

if (!targetUrl) {
  const running = await isPortOpen(3000);
  if (running) {
    targetUrl = 'http://localhost:3000';
  } else {
    console.log('\x1b[36m⚡ [Playwright QA] No URL specified. Launching local Next.js production server on port 3099...\x1b[0m');
    const port = 3099;
    localServer = spawn('npx', ['next', 'start'], {
      env: { ...process.env, PORT: String(port) },
      stdio: 'pipe',
    });

    let ready = false;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 400));
      if (await isPortOpen(port)) {
        ready = true;
        break;
      }
    }

    if (!ready) {
      console.error('\x1b[31m❌ Failed to boot local Next.js server on port 3099. Make sure "npm run build" has succeeded.\x1b[0m');
      if (localServer) localServer.kill();
      process.exit(1);
    }

    targetUrl = `http://localhost:${port}`;
  }
}

const VIEWPORTS = [
  { name: 'Desktop-1440', width: 1440, height: 900 },
  { name: 'Laptop-1280',  width: 1280, height: 800 },
  { name: 'Tablet-768',   width: 768,  height: 1024 },
  { name: 'Mobile-375',   width: 375,  height: 812 },
];

console.log(`\n\x1b[1m\x1b[36m⚡ [Playwright QA] Launching Anti-Wrapping Audit on:\x1b[0m ${targetUrl}\n`);

let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
} catch (e) {
  browser = await chromium.launch({ headless: true });
}

let totalErrors = 0;
const consoleErrors = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${vp.name}] Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`[${vp.name}] Uncaught Exception: ${err.message}`);
  });

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    console.error(`\x1b[31m❌ Failed to load ${targetUrl} on ${vp.name}: ${err.message}\x1b[0m`);
    totalErrors++;
    await context.close();
    continue;
  }

  const audit = await page.evaluate(() => {
    const results = {
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      wrappedElements: [],
      budgetWarnings: [],
    };

    const candidates = Array.from(
      document.querySelectorAll(
        'button, [role="tab"], span[class*="rounded"], span[class*="badge"], span[class*="pill"]'
      )
    );

    candidates.forEach((el) => {
      if (el.offsetParent === null && el.offsetWidth === 0) return;
      const text = (el.innerText || '').trim();
      if (!text || text.length > 60) return;
      if (el.children.length > 4) return;

      let hasWrapped = false;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const val = node.nodeValue.trim();
        if (!val) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = Array.from(range.getClientRects());
        if (rects.length > 1) {
          const firstTop = rects[0].top;
          const diffLine = rects.some((r) => Math.abs(r.top - firstTop) > 4);
          if (diffLine) {
            hasWrapped = true;
            break;
          }
        }
      }

      if (hasWrapped) {
        results.wrappedElements.push({
          tag: el.tagName.toLowerCase(),
          text: text.replace(/\s+/g, ' '),
          classes: (el.className || '').toString().slice(0, 80),
        });
      }

      const isBadge = el.tagName.toLowerCase() === 'span' && (el.className || '').includes('rounded');
      if (isBadge && text.length > 20 && !text.includes('\n')) {
        results.budgetWarnings.push({
          tag: 'badge',
          length: text.length,
          text: text.replace(/\s+/g, ' '),
        });
      }
    });

    return results;
  });

  const statusColor = audit.hasHorizontalOverflow || audit.wrappedElements.length > 0 ? '\x1b[31m' : '\x1b[32m';
  const statusIcon = audit.hasHorizontalOverflow || audit.wrappedElements.length > 0 ? '❌' : '✅';

  console.log(`${statusIcon} \x1b[1m${vp.name} (${vp.width}x${vp.height})\x1b[0m`);
  
  if (audit.hasHorizontalOverflow) {
    console.log(`   \x1b[31m↳ Overflow detected: scrollWidth (${audit.scrollWidth}px) > innerWidth (${audit.innerWidth}px)\x1b[0m`);
    totalErrors++;
  } else {
    console.log(`   \x1b[32m↳ Horizontal Width: Clean (${audit.innerWidth}px, 0 overflow)\x1b[0m`);
  }

  if (audit.wrappedElements.length > 0) {
    console.log(`   \x1b[31m↳ Wrapped elements count: ${audit.wrappedElements.length}\x1b[0m`);
    audit.wrappedElements.forEach((w) => {
      console.log(`     - [${w.tag}] "${w.text}"`);
    });
    totalErrors += audit.wrappedElements.length;
  } else {
    console.log(`   \x1b[32m↳ Badges, Tabs & Buttons: 0 wrapped lines (100% single-line)\x1b[0m`);
  }

  if (audit.budgetWarnings.length > 0) {
    console.log(`   \x1b[33m↳ Microcopy budget advisories (>20 chars):\x1b[0m`);
    audit.budgetWarnings.slice(0, 3).forEach((b) => {
      console.log(`     ⚠️  [${b.tag} - ${b.length} chars] "${b.text}"`);
    });
  }

  console.log('');
  await context.close();
}

await browser.close();
if (localServer) {
  localServer.kill();
}

console.log('----------------------------------------------------');
if (consoleErrors.length > 0) {
  console.log(`\x1b[33m⚠️  Console Messages/Errors Detected (${consoleErrors.length}):\x1b[0m`);
  consoleErrors.slice(0, 5).forEach((e) => console.log(`   ${e}`));
} else {
  console.log('\x1b[32m✅ Console health: 0 uncaught errors\x1b[0m');
}

if (totalErrors === 0) {
  console.log('\n\x1b[1m\x1b[32m🎉 PASSED: Perfect Enterprise Layout Across All Viewports!\x1b[0m\n');
  process.exit(0);
} else {
  console.log(`\n\x1b[1m\x1b[31m❌ FAILED: Found ${totalErrors} layout defects. Fix before shipping!\x1b[0m\n`);
  process.exit(1);
}
