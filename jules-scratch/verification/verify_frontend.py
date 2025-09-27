from playwright.sync_api import sync_playwright, expect, Page

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/")

    # Wait for the main heading to be visible
    heading = page.get_by_role("heading", name="Hello, World!")
    expect(heading).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)