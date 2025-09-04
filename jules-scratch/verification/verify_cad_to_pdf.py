from playwright.sync_api import sync_playwright, TimeoutError

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: print(msg.text))

    try:
        page.goto("http://localhost:5173/", timeout=60000)

        # Click on "CAD to PDF" tool
        page.click('a[href="#/cad-convert"]', timeout=60000)

        # Upload the test file
        with page.expect_file_chooser() as fc_info:
            page.click('button:has-text("Upload")')
        file_chooser = fc_info.value
        file_chooser.set_files('test.dxf')

        # Click the convert button
        page.click('button:has-text("Convert to PDF")')

        # Wait for the download to start
        with page.expect_download() as download_info:
            pass
        download = download_info.value

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    except TimeoutError:
        print("Timeout error: The application did not load correctly.")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
