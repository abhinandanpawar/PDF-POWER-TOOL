from playwright.sync_api import sync_playwright, Page, expect

def verify_ui(page: Page):
    """
    This script verifies the UI overhaul changes.
    1. It checks the home page for the new header, grid, and card layout.
    2. It checks a tool page for the new breadcrumbs and consistent layout.
    """
    # 1. Verify Home Page
    page.goto("http://localhost:5174/")

    # Wait for the main heading to be visible
    expect(page.get_by_role("heading", name="The Ultimate PDF Power Toolbox")).to_be_visible(timeout=10000)

    # Take a screenshot of the home page
    page.screenshot(path="jules-scratch/verification/homepage_preview.png")

    # 2. Verify Tool Page (e.g., Merge)
    page.get_by_role("link", name="Merge PDF Combine multiple PDFs into one.").click()

    # Wait for the breadcrumb to be visible
    breadcrumb_nav = page.get_by_label("Breadcrumb")
    expect(breadcrumb_nav).to_be_visible(timeout=10000)

    # Check for the correct breadcrumb trail
    home_link = breadcrumb_nav.get_by_role("link", name="Home")
    organize_text = breadcrumb_nav.get_by_text("Organize")
    merge_text = breadcrumb_nav.get_by_text("Merge PDF")

    expect(home_link).to_be_visible()
    expect(organize_text).to_be_visible()
    expect(merge_text).to_be_visible()

    # Take a screenshot of the tool page
    page.screenshot(path="jules-scratch/verification/toolpage_preview.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_ui(page)
        browser.close()

if __name__ == "__main__":
    main()
