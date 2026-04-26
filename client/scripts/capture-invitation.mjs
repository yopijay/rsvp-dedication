import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const PAGE_URL = `${BASE_URL}/invitation-preview`;
const INVITATION_OUTPUT_PATH = path.resolve(
    process.cwd(),
    "public/images/invitation-card-email.png"
);

const run = async () => {
    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage({
            viewport: { width: 1200, height: 1600 },
            deviceScaleFactor: 2,
        });

        await page.goto(PAGE_URL, { waitUntil: "networkidle" });
        await page.waitForTimeout(500);

        const card = page.locator('[data-invitation-capture="email-card"]');

        await card.waitFor({ state: "visible" });

        await fs.mkdir(path.dirname(INVITATION_OUTPUT_PATH), {
            recursive: true,
        });
        await card.screenshot({ path: INVITATION_OUTPUT_PATH, type: "png" });

        console.log(`Invitation image generated at: ${INVITATION_OUTPUT_PATH}`);
    } finally {
        await browser.close();
    }
};

run().catch((error) => {
    console.error("Failed to generate invitation image:", error);
    process.exit(1);
});
