import { test, expect } from "../fixtures";
import * as fs from "fs";
import * as path from "path";

const BASE_PATH = "_娄山关路";

/**
 * Quick example:
 * Run a Playwright test from the command line with a specific reporter and timeout:
 *   pnpm exec playwright test e2e/tests/house-price-tracker.ts --reporter=list --timeout=30000
 */

test("test", async ({ edgeBrowser }) => {
  test.setTimeout(300000); // 设置测试超时时间为 5 分钟
  // Create a new page for navigation to avoid any existing page state issues
  const page = await edgeBrowser.newPage();

  interface HouseListing {
    houseId: string;
    title: string;
    price: string; // e.g., "222" (numeric value without unit)
    pricePerSquareMeter: string;
    // Property details split into fields
    rooms: string; // e.g., "2室0厅1卫"
    area: string; // e.g., "58.34" (numeric value without unit)
    orientation: string; // e.g., "南北"
    floor: string; // e.g., "高楼层/6层"
    decoration: string; // e.g., "简装"
    yearBuilt: string; // e.g., "约1993年建成"
    // Location split into fields
    district: string; // e.g., "光新"
    community: string; // e.g., "岚皋西路45弄"
    ring: string; // e.g., "内环至中环"
    metroStation: string; // e.g., "镇坪路地铁站-3口"
    metroDistance: string; // e.g., "842米（步行）"
    // Views split into fields
    followers: string; // e.g., "4 人关注"
    viewings30Days: string; // e.g., "近30天带看9 次"
    lastUpdated: string; // e.g., "2025-09-14"
    tags: string[];
    url: string;
  }

  // Function to extract listings from current page
  const extractListings = async (): Promise<HouseListing[]> => {
    return (await page.evaluate(() => {
      const listings: any[] = [];

      const listItems = document.querySelectorAll(".pList li");

      listItems.forEach((li) => {
        // Extract house ID from URL
        const linkElement = li.querySelector(
          'a[href*="/ershoufang/"]',
        ) as HTMLAnchorElement;
        const url = linkElement?.href || "";
        const houseIdMatch = url.match(/\/ershoufang\/(\d+)\.html/);
        const houseId = houseIdMatch ? houseIdMatch[1] : "";

        // Extract title
        const titleElement = li.querySelector(".listTit a");
        const title = titleElement?.textContent?.trim() || "";

        // Extract price
        const priceText =
          li.querySelector(".jia .redC")?.textContent?.trim() || "";
        // Extract numeric value from price (remove "万" unit)
        const priceMatch = priceText.match(/([\d.]+)/);
        const price = priceMatch ? priceMatch[1] : "";

        // Extract price per square meter
        const pricePerM2Element = li.querySelector(".jia p:last-child");
        const pricePerSquareMeter =
          pricePerM2Element?.textContent?.trim() || "";

        // Extract property details (rooms, area, etc.)
        const propertyElement = li.querySelector(".listX p:first-child");
        const propertyDetailsText = propertyElement?.textContent?.trim() || "";

        // Parse property details: "2室0厅1卫  ·  58.34  平米  ·  南北  ·  高楼层/6层  ·  简装  ·  约1993年建成"
        const propertyParts = propertyDetailsText
          .split("·")
          .map((p) => p.trim())
          .filter((p) => p);
        const rooms = propertyParts[0] || "";
        const areaText = propertyParts[1] || "";
        // Extract numeric value from area (remove "平米" unit)
        const areaMatch = areaText.match(/([\d.]+)/);
        const area = areaMatch ? areaMatch[1] : "";
        const orientation = propertyParts[2] || "";
        const floor = propertyParts[3] || "";
        const decoration = propertyParts[4] || "";
        const yearBuilt = propertyParts[5] || "";

        // Extract location
        const locationElement = li.querySelector(".listX p:nth-child(2)");
        const locationText = locationElement?.textContent?.trim() || "";

        // Parse location: "光新 岚皋西路45弄 · 内环至中环\n · 距镇坪路地铁站-3口842米（步行）"
        const locationParts = locationText
          .split("·")
          .map((p) => p.trim().replace(/\n/g, " ").replace(/\s+/g, " ").trim())
          .filter((p) => p);
        const firstPart = locationParts[0] || "";
        const firstPartWords = firstPart.split(/\s+/).filter((w) => w);
        const district = firstPartWords[0] || ""; // First word (district)
        const community = firstPartWords.slice(1).join(" ") || ""; // Rest of first part (community)
        const ring = locationParts[1] || "";
        const metroInfo = locationParts[2] || "";
        // Extract metro station and distance from metroInfo: "距镇坪路地铁站-3口842米（步行）"
        const metroMatch = metroInfo.match(/距(.+?地铁站[^0-9]*)(\d+米[^·]*)/);
        const metroStation = metroMatch ? metroMatch[1].trim() : "";
        const metroDistance = metroMatch ? metroMatch[2].trim() : "";

        // Extract views and other info
        const viewsElement = li.querySelector(".listX p:nth-child(3)");
        const viewsText = viewsElement?.textContent?.trim() || "";

        // Parse views: "4  人关注\n · 近30天带看9 次  ·  2025-09-14"
        const viewsParts = viewsText
          .split("·")
          .map((p) => p.trim().replace(/\n/g, " ").trim())
          .filter((p) => p);
        const followers = viewsParts[0] || "";
        const viewings30Days = viewsParts[1] || "";
        const lastUpdated = viewsParts[2] || "";

        // Extract tags
        const tags: string[] = [];
        const tagElements = li.querySelectorAll(".listTag span");
        tagElements.forEach((tag) => {
          const tagText = tag.textContent?.trim();
          if (tagText) tags.push(tagText);
        });

        if (houseId) {
          listings.push({
            houseId,
            title,
            price,
            pricePerSquareMeter,
            rooms,
            area,
            orientation,
            floor,
            decoration,
            yearBuilt,
            district,
            community,
            ring,
            metroStation,
            metroDistance,
            followers,
            viewings30Days,
            lastUpdated,
            tags,
            url,
          });
        }
      });

      return listings;
    })) as HouseListing[];
  };

  // Function to build URL for a specific page number
  const buildPageUrl = (pageNum: number): string => {
    if (pageNum === 1) {
      return `https://sh.5i5j.com/ershoufang/${BASE_PATH}?zn=${BASE_PATH}`;
    } else {
      return `https://sh.5i5j.com/ershoufang/n${pageNum}/${BASE_PATH}/`;
    }
  };

  // Function to check if next page button exists
  const hasNextPage = async (): Promise<boolean> => {
    return await page.evaluate(() => {
      const nextPageLink = document.querySelector(".pageSty.rf a.cPage");
      return (
        nextPageLink !== null &&
        nextPageLink.textContent?.includes("下一页") === true
      );
    });
  };

  // Function to generate random wait time between 3-10 seconds
  const randomWait = () => {
    const min = 500;
    const max = 2000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const allListings: HouseListing[] = [];
  let pageNumber = 1;
  const maxPages: number | undefined = 30; // Set to undefined to loop until no next page button

  while (true) {
    // Build URL for current page
    const pageUrl = buildPageUrl(pageNumber);
    console.log(`Navigating to page ${pageNumber}: ${pageUrl}`);

    await page.goto(pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for the listings to load
    try {
      await page.waitForSelector(".pList li", { timeout: 15000 });
    } catch (error) {
      // If no listings found, we've reached the end
      console.log(
        `No listings found on page ${pageNumber}. Finished fetching all listings.`,
      );
      break;
    }

    // Extract listings from current page
    const pageListings = await extractListings();

    // If no listings found, stop
    if (pageListings.length === 0) {
      console.log(
        `No listings found on page ${pageNumber}. Finished fetching all listings.`,
      );
      break;
    }

    allListings.push(...pageListings);
    console.log(
      `Page ${pageNumber}: Found ${pageListings.length} listings (Total: ${allListings.length})`,
    );

    // Check if we should continue to next page
    if (maxPages === undefined) {
      // If maxPages is undefined, check for next page button
      const hasNext = await hasNextPage();
      if (!hasNext) {
        console.log(
          "No next page button found. Finished fetching all listings.",
        );
        break;
      }
    } else {
      // If maxPages is set, check if we've reached the limit
      if (pageNumber >= maxPages) {
        console.log(
          `Reached max pages limit (${maxPages}). Finished fetching all listings.`,
        );
        break;
      }
    }

    // Random wait before going to next page
    const waitTime = randomWait();
    console.log(`Waiting ${waitTime / 1000}s before fetching next page...`);
    await page.waitForTimeout(waitTime);

    // Move to next page
    pageNumber++;
  }

  // Export all combined data
  console.log(`\nTotal listings found: ${allListings.length}`);

  // Function to convert array of objects to CSV
  const convertToCSV = (data: HouseListing[]): string => {
    if (data.length === 0) return "";

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      // If contains comma, quote, or newline, wrap in quotes and escape quotes
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV rows
    const rows = data.map((item) => {
      return headers
        .map((header) => {
          const value = item[header as keyof HouseListing];
          // Handle array fields (tags)
          if (Array.isArray(value)) {
            return escapeCSV(value.join("; "));
          }
          return escapeCSV(value);
        })
        .join(",");
    });

    // Combine headers and rows
    return [headers.join(","), ...rows].join("\n");
  };

  // Save to CSV file
  const outputPath = path.join(process.cwd(), "house-listings.csv");
  const csvContent = convertToCSV(allListings);
  fs.writeFileSync(outputPath, csvContent, "utf-8");
  console.log(`\nAll data exported to: ${outputPath}`);
});
