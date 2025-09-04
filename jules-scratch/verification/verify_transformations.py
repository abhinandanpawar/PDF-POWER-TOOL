import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto("http://localhost:5173/")

        # Find the Image Editor tool and click on it
        await page.get_by_text("Image Editor").click()

        # Upload the test image
        async with page.expect_file_chooser() as fc_info:
            await page.get_by_text("Select an image").click()
        file_chooser = await fc_info.value
        await file_chooser.set_files("jules-scratch/verification/test.png")

        # Rotate and flip the image
        await page.get_by_label("Rotate Right").click()
        await page.get_by_label("Flip Vertical").click()

        # Crop the image
        await page.get_by_role("button", name="Crop Image").click()

        # Check that the cropped image is displayed
        await expect(page.get_by_alt_text("Cropped")).to_be_visible()

        # Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
