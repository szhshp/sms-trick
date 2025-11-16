import { expect, test } from "@playwright/test";
import * as cheerio from "cheerio";

interface TrackData {
  trId: string | null;
  trackNumber: string | null;
  songName: string | null;
  songLink: string | null;
  artistName: string | null;
  artistLink: string | null;
  duration: string | null;
}

test("网易云音乐", async ({ page }) => {
  await page.goto("https://music.163.com/#/album?id=2767878");
  await page.waitForTimeout(1000);
  const html = await page.content();
  console.log("🚀 ~ html:", html);
  return;
  const $ = cheerio.load(html);
  const trs = $("table tr");
  const results: TrackData[] = [];
  trs.each((index, tr) => {
    const trId = $(tr).attr("id");
    const trackNumber = $(tr).find(".num").text();
    const songName = $(tr).find(".tt").text();
    const songLink = $(tr).find('a[href*="/song?id="]').attr("href");
    const artistName = $(tr).find('a[href*="/artist?id="]').text();
    const artistLink = $(tr).find('a[href*="/artist?id="]').attr("href");
    const duration = $(tr).find(".u-dur").text();
    results.push({
      trId,
      trackNumber,
      songName,
      songLink,
      artistName,
      artistLink,
      duration,
    });
  });

  console.log(results);

  return;

  // Extract all links and names from each tr element
  const trData: TrackData[] = await page.evaluate(() => {
    const trs = document.querySelectorAll("table tr");
    const results: TrackData[] = [];

    trs.forEach((tr, index) => {
      const trId = tr.getAttribute("id");

      // Extract song link and name
      const songLinkElement = tr.querySelector('a[href*="/song?id="]');
      const songLink = songLinkElement
        ? songLinkElement.getAttribute("href")
        : null;
      const songName = songLinkElement
        ? songLinkElement.textContent?.trim()
        : null;

      // Extract artist link and name
      const artistLinkElement = tr.querySelector('a[href*="/artist?id="]');
      const artistLink = artistLinkElement
        ? artistLinkElement.getAttribute("href")
        : null;
      const artistName = artistLinkElement
        ? artistLinkElement.textContent?.trim()
        : null;

      // Extract duration
      const durationElement = tr.querySelector(".u-dur");
      const duration = durationElement
        ? durationElement.textContent?.trim()
        : null;

      // Extract track number
      const trackNumberElement = tr.querySelector(".num");
      const trackNumber = trackNumberElement
        ? trackNumberElement.textContent?.trim()
        : null;

      results.push({
        trId,
        trackNumber,
        songName,
        songLink,
        artistName,
        artistLink,
        duration,
      });
    });

    return results;
  });

  console.log("Extracted data from all tr elements:");
  trData.forEach((item, index) => {
    console.log(`Track ${index + 1}:`);
    console.log(`  TR ID: ${item.trId}`);
    console.log(`  Track Number: ${item.trackNumber}`);
    console.log(`  Song Name: ${item.songName}`);
    console.log(`  Song Link: ${item.songLink}`);
    console.log(`  Artist Name: ${item.artistName}`);
    console.log(`  Artist Link: ${item.artistLink}`);
    console.log(`  Duration: ${item.duration}`);
    console.log("---");
  });

  // Verify we extracted some data
  expect(trData.length).toBeGreaterThan(0);
  expect(trData[0].songName).toBeTruthy();
});
