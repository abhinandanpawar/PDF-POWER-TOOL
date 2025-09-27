from playwright.sync_api import sync_playwright, Page, expect

def test_homepage_loads(page: Page):
    """
    This test verifies that the homepage loads correctly and takes a screenshot.
    """
    print("Starting test...")
    # 1. Arrange: Go to the application's home page.
    print("Navigating to http://localhost:4173/")
    page.goto("http://localhost:4173/")
    print("Navigation complete.")

    # 2. Screenshot: Capture the final result for visual verification.
    print("Taking screenshot of homepage...")
    page.screenshot(path="../jules-scratch/verification/homepage_verification.png")
    print("Screenshot taken.")
    print("Test finished.")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    test_homepage_loads(page)
    browser.close()