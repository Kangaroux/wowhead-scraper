import { ElementHandle, Page } from "puppeteer";

export async function scrapeTab<T>(
    page: Page,
    tabId: string,
    scrapeFunc: (view: ElementHandle) => Promise<T[]>,
): Promise<T[]> {
    const view = await page.$(tabId);

    if (!view) {
        console.error("Failed to find tab", tabId);
        return [];
    }

    const firstBtn = await view.$(
        'xpath/div[contains(@class, "listview-band-top")]//a[contains(text(), "First")]',
    );

    if (!firstBtn) {
        console.error("Failed to find the 'First' nav button");
        return [];
    }

    await firstBtn.click();

    const results: T[] = [];

    while (true) {
        results.push(...(await scrapeFunc(view)));

        const nextBtn = await view.$(
            'xpath///div[contains(@class, "listview-band-top")]//a[contains(text(), "Next")]',
        );

        if (!nextBtn) {
            console.error("Failed to find the 'Next' nav button");
            return [];
        }

        const isActive = await nextBtn.evaluate(
            (el) => el.getAttribute("data-active") === "yes",
        );

        if (isActive) {
            await nextBtn.click();
        } else {
            break;
        }
    }

    return results;
}
