from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:5173")

    # 2. Act: Find the "Merge PDF" tool card and click it.
    merge_card = page.get_by_role("link", name="Merge PDF")
    merge_card.click()

    # 3. Assert: Confirm the navigation was successful.
    expect(page).to_have_url("http://localhost:5173/merge")
    expect(page.get_by_role("heading", name="Merge PDF")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/routing_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
