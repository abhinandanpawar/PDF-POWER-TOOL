from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Go to the home page
    page.goto("http://localhost:5173/")

    # Wait for a fixed time to let things settle
    page.wait_for_timeout(5000)

    # Take a screenshot of whatever is on the page
    page.screenshot(path="jules-scratch/verification/final_attempt_screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
