from playwright.sync_api import sync_playwright, expect
import time

def verify_boot_desktop():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1. Boot to Desktop
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("1. Boot Flow Verification")
        page.goto("http://localhost:5173")

        # Verify Loading Screen
        try:
            expect(page.get_by_text("Visitor")).to_be_visible(timeout=15000)
            print("  [PASS] Boot screen completed.")
        except:
             pass

        if page.get_by_text("Enter Password").is_visible():
             print("  [PASS] Lock Screen appeared.")
             page.get_by_role("button", name="Login").click()
             time.sleep(1)

        # Verify Desktop Taskbar
        expect(page.locator(r"div.fixed.z-\[1000\]")).to_be_visible()
        print("  [PASS] Desktop loaded.")

        # 2. Context Menu & Window Management
        print("2. Context Menu & Window Management")
        page.mouse.move(960, 540)
        page.mouse.click(960, 540, button="right")
        time.sleep(0.5)

        expect(page.get_by_text("New Folder")).to_be_visible()
        print("  [PASS] Context menu appeared.")

        # 3. Start Menu & Search
        print("3. Start Menu & Search")
        taskbar = page.locator(r"div.fixed.z-\[1000\]")
        start_btn = taskbar.locator("button").first
        start_btn.click()
        time.sleep(0.5)

        expect(page.get_by_placeholder("Search apps...")).to_be_visible()
        print("  [PASS] Start Menu opened.")

        page.get_by_placeholder("Search apps...").fill("Terminal")
        time.sleep(0.5)
        page.keyboard.press("Enter")
        time.sleep(1)

        # Verify Terminal Window
        terminal_window = page.locator("div").filter(has_text="visitor@portfolio-os").last
        expect(terminal_window).to_be_visible()
        print("  [PASS] Terminal launched.")

        # 4. Closing Window
        print("4. Closing Window")
        # Try Alt+F4
        page.keyboard.press("Alt+F4")
        time.sleep(1)

        # If still visible, try finding the close button
        if terminal_window.is_visible():
             print("  [WARN] Alt+F4 didn't close. Trying close button.")
             # The close button is usually in the window header (WindowFrame).
             # It usually has a red color or 'X'.
             # Let's try to find a button with generic close traits in the window area.
             # Window header usually has bg-slate-100 or similar.
             # Let's try pressing Ctrl+W as fallback.
             page.keyboard.press("Control+w")
             time.sleep(1)

        expect(terminal_window).not_to_be_visible()
        print("  [PASS] Window closed.")

        browser.close()

if __name__ == "__main__":
    verify_boot_desktop()
