import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import { execSync } from "child_process";

// Extend the base test with custom fixtures
export const test = base.extend<{
  edgeBrowser: BrowserContext;
  edgePage: Page;
}>({
  // Fixture for connecting to existing Edge browser
  edgeBrowser: async ({}, use) => {
    // Connect to existing Edge browser via CDP
    // Default CDP endpoint for Edge is usually ws://localhost:9222
    // You can change this via environment variable EDGE_CDP_URL
    // Note: Start Edge with: msedge.exe --remote-debugging-port=9222
    // Or on Mac: /Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --remote-debugging-port=9222
    const cdpUrl = process.env.EDGE_CDP_URL || "http://localhost:9222";

    let browser;
    try {
      // Connect to the existing browser
      browser = await chromium.connectOverCDP(cdpUrl);
    } catch (error) {
      throw new Error(
        `Failed to connect to Edge browser at ${cdpUrl}. ` +
          `Make sure Edge is running with remote debugging enabled:\n` +
          `  macOS: /Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge --remote-debugging-port=9222 --user-data-dir=/tmp/edge-debug-profile\n` +
          `  Windows: msedge.exe --remote-debugging-port=9222\n` +
          `Original error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Get the default context (or create one if needed)
    const contexts = browser.contexts();
    let context: BrowserContext;

    if (contexts.length > 0) {
      context = contexts[0];
    } else {
      context = await browser.newContext();
    }

    // Use the context
    await use(context);

    // Cleanup: don't close the browser since it's an existing one
    // Just disconnect from CDP
    await browser.close();
  },

  // Fixture for getting a page from the existing Edge browser
  edgePage: async ({ edgeBrowser }, use) => {
    // Get an existing page or create a new one
    const pages = edgeBrowser.pages();
    let page: Page;

    if (pages.length > 0) {
      page = pages[0];
    } else {
      page = await edgeBrowser.newPage();
    }

    // Bring the browser window to the front and make it visible
    try {
      const cdpSession = await page.context().newCDPSession(page);
      // Get all browser targets
      const targets = await cdpSession.send("Target.getTargets");
      if (targets.targetInfos && targets.targetInfos.length > 0) {
        // Activate the first target (main browser window)
        const targetId = targets.targetInfos[0].targetId;
        await cdpSession.send("Target.activateTarget", { targetId });
      }
      await cdpSession.detach();

      // On macOS, use AppleScript to bring Edge window to front
      if (process.platform === "darwin") {
        try {
          execSync(
            "osascript -e 'tell application \"Microsoft Edge\" to activate'",
            { stdio: "ignore" },
          );
        } catch (e) {
          // Ignore errors
        }
      }
    } catch (error) {
      // If CDP commands fail, continue anyway
      console.warn("Could not bring browser window to front:", error);
    }

    await use(page);

    // Don't close the page if it's from an existing browser
    // The user might want to keep it open
  },
});

export { expect } from "@playwright/test";
