import { ElementHandle, Page } from "puppeteer";

export async function scrapeTab<T>(
    page: Page,
    tabId: string,
    scrapeFunc: (view: ElementHandle) => Promise<T[]>,
): Promise<T[]> {
    const view = await page.$(tabId);
    const firstBtn = await view.$(
        'xpath/div[contains(@class, "listview-band-top")]//a[contains(text(), "First")]',
    );
    await firstBtn.click();

    const results: T[] = [];

    while (true) {
        results.push(...(await scrapeFunc(view)));

        const nextBtn = await view.$(
            'xpath///div[contains(@class, "listview-band-top")]//a[contains(text(), "Next")]',
        );
        const isActive = await nextBtn?.evaluate(
            (el) => el.getAttribute("data-active") === "yes",
        );

        if (nextBtn && isActive) {
            await nextBtn.click();
        } else {
            break;
        }
    }

    return results;
}
