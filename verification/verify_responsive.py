from playwright.sync_api import sync_playwright
import time

def verify_responsive():
    print("Starting comprehensive verification...")
    with sync_playwright() as p:
        # Launch browser with specific args to simulate touch if needed, but for layout check mouse is fine
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])

        # 1. Desktop Large (1920x1080)
        print("1. Testing Desktop Large (1920x1080)...")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Enable console log capture
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        try:
            page.goto("http://localhost:5173", timeout=60000)

            # Wait for Boot Screen to disappear or Desktop to appear
            # Wait for Desktop Icon Grid or Taskbar
            page.wait_for_selector("text=About Me", timeout=15000) # Wait for icon label

            # Wait for animations to settle
            time.sleep(2)
            page.screenshot(path="verification/1_desktop_large.png")
            print("   Desktop Large screenshot saved.")

            # Open About App (Double Click)
            print("   Opening About App...")
            page.get_by_text("About Me").first.dblclick()
            time.sleep(1.5) # Wait for window open animation
            page.screenshot(path="verification/2_desktop_window_open.png")
            print("   Window Open screenshot saved.")

        except Exception as e:
            print(f"FAILED Desktop Large: {e}")
            page.screenshot(path="verification/error_desktop_large.png")

        page.close()

        # 2. Tablet Portrait (768x1024) - Should likely use Mobile Shell or scaled Desktop?
        # The prompt says: "Tablet Portrait (768px): iPad — transition zone, use mobile shell with adapted layout"
        # "Tablet Landscape (1024px): iPad landscape — use desktop shell with touch-friendly sizing"

        print("2. Testing Tablet Portrait (768x1024)...")
        page = browser.new_page(viewport={'width': 768, 'height': 1024}, is_mobile=True, has_touch=True)
        try:
            page.goto("http://localhost:5173", timeout=30000)
            page.wait_for_load_state('networkidle')
            time.sleep(2)
            page.screenshot(path="verification/3_tablet_portrait.png")
            print("   Tablet Portrait screenshot saved.")
        except Exception as e:
            print(f"FAILED Tablet Portrait: {e}")
        page.close()

        # 3. Mobile Portrait (375x812) - iPhone X
        print("3. Testing Mobile Portrait (375x812)...")
        # Set safe area insets via viewport meta if possible, but Playwright simulates viewport size.
        # To simulate notches visually, we'd need to overlay something, but we just check layout.
        page = browser.new_page(viewport={'width': 375, 'height': 812}, is_mobile=True, has_touch=True)
        try:
            page.goto("http://localhost:5173", timeout=30000)
            page.wait_for_load_state('networkidle')
            time.sleep(2)
            page.screenshot(path="verification/4_mobile_portrait.png")
            print("   Mobile Portrait screenshot saved.")

            # Open App (Single Tap for Mobile/Touch?)
            # Prompt says "Touch devices: Larger tap targets".
            # Usually mobile launcher = single tap.
            # My MobileShell 'HomeScreen' implementation:
            # <HomeScreen onAppLaunch={handleAppLaunch} /> which passes to <AppIcon onClick={() => onAppLaunch(app)} />
            # So single click/tap should work.
            print("   Opening Terminal App on Mobile...")
            page.get_by_text("Terminal").first.tap()
            time.sleep(1.5)
            page.screenshot(path="verification/5_mobile_app_open.png")
            print("   Mobile App Open screenshot saved.")

        except Exception as e:
             print(f"FAILED Mobile Portrait: {e}")
             page.screenshot(path="verification/error_mobile.png")
        page.close()

        # 4. Mobile Landscape (812x375)
        print("4. Testing Mobile Landscape (812x375)...")
        page = browser.new_page(viewport={'width': 812, 'height': 375}, is_mobile=True, has_touch=True)
        try:
            page.goto("http://localhost:5173", timeout=30000)
            time.sleep(2)
            page.screenshot(path="verification/6_mobile_landscape.png")
            print("   Mobile Landscape screenshot saved.")
        except Exception as e:
             print(f"FAILED Mobile Landscape: {e}")
        page.close()

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    verify_responsive()
