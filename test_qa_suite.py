import time
import os
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def run_qa():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page()

        print("[Agent QA Tester] Loading game...")
        page.goto("http://127.0.0.1:8080")
        page.wait_for_timeout(1000)

        # 1. Chụp màn hình khởi động ban đầu
        shot1 = os.path.join(SCREENSHOT_DIR, "01_game_start.png")
        page.screenshot(path=shot1)
        print(f"[Agent 1 - Initial Inspector] Captured initial state: {shot1}")

        # 2. Chờ khách vào quán
        print("[Agent 2 - Gameplay Inspector] Waiting for customers to enter...")
        page.wait_for_timeout(4500)
        shot2 = os.path.join(SCREENSHOT_DIR, "02_customer_entered.png")
        page.screenshot(path=shot2)
        print(f"[Agent 2 - Gameplay Inspector] Captured customer entered: {shot2}")

        # 3. Điều khiển Doraemon đến bếp lấy bánh rán
        # Stove is at x=410, y=80 with w=140, h=70 -> Click center at (480, 115) relative to canvas
        canvas = page.locator("#gameCanvas")
        box = canvas.bounding_box()
        stove_click_x = box["x"] + 480
        stove_click_y = box["y"] + 115
        print(f"[Agent 3 - Player Bot] Clicking Stove at ({stove_click_x}, {stove_click_y})")
        page.mouse.click(stove_click_x, stove_click_y)
        page.wait_for_timeout(1500) # Đợi Doraemon chạy đến và nhặt bánh

        shot3 = os.path.join(SCREENSHOT_DIR, "03_doraemon_cooking_pickup.png")
        page.screenshot(path=shot3)
        print(f"[Agent 3 - Player Bot] Captured Doraemon carrying dorayaki: {shot3}")

        # 4. Điều khiển Doraemon đến Bàn 1 phục vụ khách
        # Table 1 is at x=160, y=200 -> Click center at (205, 230)
        table1_click_x = box["x"] + 205
        table1_click_y = box["y"] + 230
        print(f"[Agent 3 - Player Bot] Serving Table 1 at ({table1_click_x}, {table1_click_y})")
        page.mouse.click(table1_click_x, table1_click_y)
        page.wait_for_timeout(2000)

        shot4 = os.path.join(SCREENSHOT_DIR, "04_serving_customer.png")
        page.screenshot(path=shot4)
        print(f"[Agent 4 - Economy Auditor] Customer served, eating food: {shot4}")

        # 5. Đợi khách ăn xong và thanh toán tiền
        page.wait_for_timeout(4000)
        coins = page.locator("#coinCount").inner_text()
        rep = page.locator("#repCount").inner_text()
        print(f"[Agent 5 - Balance & Progression] Current Coins: {coins}, Reputation: {rep}")

        shot5 = os.path.join(SCREENSHOT_DIR, "05_paid_coins_upgrades.png")
        page.screenshot(path=shot5)
        print(f"[Agent 5 - Final Reviewer] Captured post-payment state: {shot5}")

        browser.close()
        print("ALL QA AUTOMATION TASKS COMPLETED!")

if __name__ == "__main__":
    run_qa()
