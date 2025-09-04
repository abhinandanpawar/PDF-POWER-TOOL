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

        # Crop the image
        await page.get_by_role("button", name="Crop Image").click()

        # Check initial width and height
        width_input = page.get_by_placeholder("Width")
        height_input = page.get_by_placeholder("Height")
        await expect(width_input).to_have_value("100")
        await expect(height_input).to_have_value("50")

        # Change width and check if height is updated
        await width_input.fill("200")
        await expect(height_input).to_have_value("100")

        # Uncheck aspect ratio lock
        await page.get_by_label("Lock aspect ratio").uncheck()

        # Change height and check if width is not updated
        await height_input.fill("150")
        await expect(width_input).to_have_value("200")

        # Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
