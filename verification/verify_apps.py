from playwright.sync_api import sync_playwright, expect
import time

def verify_apps():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use Desktop Viewport
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("Navigating to desktop...")
        page.goto("http://localhost:5173")

        # Wait for boot
        try:
            expect(page.get_by_text("Visitor")).to_be_visible(timeout=15000)
        except:
             pass
        if page.get_by_text("Enter Password").is_visible():
             page.get_by_role("button", name="Login").click()
        time.sleep(2)

        apps_to_verify = [
            {"name": "About Me", "check": "Interests & Hobbies"},
            {"name": "Skills & Technologies", "check": "Python"},
            {"name": "Education", "check": "Tech University"},
            {"name": "Projects", "check": "AI Portfolio OS"},
            {"name": "Experience", "check": "Tech Solutions Inc."},
            {"name": "Certifications", "check": "AWS Certified"},
            {"name": "Contact Me", "check": "Send Message"},
            {"name": "Resume Viewer", "check": "Download PDF"},
            {"name": "Terminal", "check": "visitor@portfolio-os"},
            {"name": "System Settings", "check": "Appearance"},
            {"name": "File Explorer", "check": "Quick Access"},
            {"name": "Gallery", "check": "Gallery"},
        ]

        def open_start_menu():
            taskbar = page.locator(r"div.fixed.z-\[1000\]")
            start_btn = taskbar.locator("button").first
            start_btn.click()
            time.sleep(1)

        for app in apps_to_verify:
            print(f"Verifying {app['name']}...")
            try:
                open_start_menu()
                page.get_by_placeholder("Search apps...").click()
                page.get_by_placeholder("Search apps...").fill(app['name'])
                time.sleep(0.5)
                page.keyboard.press("Enter")
                time.sleep(2)

                # Custom Verification Logic
                if app['name'] == "Contact Me":
                    # Fill Form
                    page.get_by_placeholder("Your Name").fill("Test User")
                    page.get_by_placeholder("Your Email").fill("test@example.com")
                    page.get_by_placeholder("Your Message...").fill("This is a test message with enough characters.")
                    # Submit
                    # Button text is "Send Message" initially
                    submit_btn = page.locator("button[type='submit']")
                    submit_btn.click()
                    time.sleep(2)
                    # Verify Success
                    # It shows "Simulation Successful" or "Message Sent!"
                    expect(page.get_by_text("Simulation Successful")).to_be_visible()
                    print(f"  [PASS] {app['name']} form submitted.")

                elif app['name'] == "Terminal":
                    # Type Command 'ls'
                    input_field = page.locator("input.bg-transparent") # Assuming terminal input
                    input_field.fill("ls")
                    page.keyboard.press("Enter")
                    time.sleep(1)
                    # Check Output
                    expect(page.get_by_text("Desktop")).to_be_visible()
                    print(f"  [PASS] {app['name']} commands verified.")

                elif app['name'] == "System Settings":
                    expect(page.locator("h2", has_text="Appearance")).to_be_visible()

                elif app['name'] == "Gallery":
                    expect(page.get_by_text(app['check']).first).to_be_visible()

                elif app['name'] == "Projects":
                    expect(page.get_by_text(app['check']).first).to_be_visible()

                else:
                    expect(page.get_by_text(app['check']).first).to_be_visible()

                print(f"  [PASS] {app['name']} basic check passed.")
                # page.screenshot(path=f"verification/app_{app['name'].replace(' ', '_').replace('&', 'and').lower()}.png")

                # Close
                page.keyboard.press("Control+w")
                time.sleep(1)

            except Exception as e:
                print(f"  [FAIL] {app['name']} failed: {e}")
                # page.screenshot(path=f"verification/error_{app['name'].replace(' ', '_').replace('&', 'and').lower()}.png")
                page.keyboard.press("Control+w")
                page.keyboard.press("Escape")
                time.sleep(1)

        browser.close()

if __name__ == "__main__":
    verify_apps()
