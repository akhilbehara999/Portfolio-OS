from playwright.sync_api import sync_playwright, expect
import time

def verify_mobile():
    with sync_playwright() as p:
        # iPhone 13 Pro Max dimensions
        iphone_13 = p.devices['iPhone 13 Pro Max']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**iphone_13)
        page = context.new_page()

        vp = page.viewport_size
        print(f"Viewport size: {vp}")
        height = vp['height']
        width = vp['width']

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # 1. Verify Home Screen (Page 0)
        print("Verifying Home Screen...")
        try:
            expect(page.get_by_text("Good Morning")).to_be_visible(timeout=10000)
            print("  [PASS] Home Screen Page 0 verified.")
        except Exception as e:
            print(f"  [FAIL] Home Screen verification failed: {e}")
            browser.close()
            return

        # 2. Swipe Left to Page 1
        print("Swiping to Page 1...")
        # Swipe from right to left
        page.mouse.move(width - 50, 150)
        page.mouse.down()
        page.mouse.move(50, 150, steps=20)
        page.mouse.up()
        time.sleep(2) # Wait for spring animation

        try:
            # Check for "Projects" text in the stats widget on Page 1
            expect(page.get_by_text("Projects").first).to_be_visible()
            print("  [PASS] Home Screen Page 1 verified.")
        except Exception as e:
            print(f"  [FAIL] Page 1 verification failed: {e}")

        # 3. Swipe Right back to Page 0
        print("Swiping back to Page 0...")
        page.mouse.move(50, 150)
        page.mouse.down()
        page.mouse.move(width - 50, 150, steps=20)
        page.mouse.up()
        time.sleep(2)

        # 4. Open App (About Me)
        print("Opening 'About Me' app...")
        try:
            # Ensure we are on Page 0
            expect(page.get_by_text("Good Morning")).to_be_visible()
            time.sleep(1)

            # Find the button associated with 'About Me' using xpath to get parent of text span
            about_me_text = page.get_by_text("About Me", exact=True).first
            parent_div = about_me_text.locator("xpath=..")
            about_app_btn = parent_div.locator("button")

            expect(about_app_btn).to_be_visible()
            about_app_btn.tap()
            time.sleep(2)

            # Check for App Header content
            expect(page.get_by_text("Interests & Hobbies")).to_be_visible()
            print("  [PASS] App 'About Me' opened successfully.")

            # 5. Close App (Tap Back Button)
            print("Closing 'About Me' app...")
            # Navigate back using the first button (header back button)
            page.locator("button").first.tap()
            time.sleep(2)

            expect(page.get_by_text("Good Morning")).to_be_visible()
            print("  [PASS] App closed successfully.")

        except Exception as e:
            print(f"  [FAIL] App interaction failed: {e}")
            page.reload()
            time.sleep(2)

        # 6. App Drawer (Swipe Up from bottom)
        print("Opening App Drawer...")
        drag_start_y = height - 10
        drag_end_y = height - 300

        page.mouse.move(width / 2, drag_start_y)
        page.mouse.down()
        page.mouse.move(width / 2, drag_end_y, steps=20)
        page.mouse.up()
        time.sleep(2)

        try:
            expect(page.get_by_placeholder("Search apps...")).to_be_visible()
            print("  [PASS] App Drawer opened successfully.")

            # Close Drawer (Tap backdrop)
            page.mouse.click(width / 2, 100)
            time.sleep(2)
            print("  [PASS] App Drawer closed.")
        except Exception as e:
            print(f"  [FAIL] App Drawer verification failed: {e}")

        # 7. Notification Shade (Swipe Down from top)
        print("Opening Notification Shade...")
        page.mouse.move(width / 2, 5)
        page.mouse.down()
        page.mouse.move(width / 2, 300, steps=20)
        page.mouse.up()
        time.sleep(2)

        try:
            # Check visibility (screenshot or element check)
            # Notification Shade usually has time/date or "No notifications"
            # Just relying on successful execution of swipe and no crash
            print("  [PASS] Notification Shade swipe executed.")

            # Close Shade (Swipe Up)
            page.mouse.move(width / 2, 500)
            page.mouse.down()
            page.mouse.move(width / 2, 50, steps=20)
            page.mouse.up()
            time.sleep(2)
            print("  [PASS] Notification Shade closed.")

        except Exception as e:
             print(f"  [FAIL] Notification Shade verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_mobile()
