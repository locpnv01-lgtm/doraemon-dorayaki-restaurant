import time
import os
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/screenshots_expanded"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def run_simulation():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1440, "height": 820})
        page = context.new_page()

        print("[Simulation Lead] Khởi động nhà hàng cao cấp...")
        page.goto("http://127.0.0.1:8080")
        page.wait_for_timeout(1000)

        # 1. Kích hoạt chế độ Cấp Cao (Mở full 6 bàn, Cánh Cửa Thần Kỳ VIP, Trợ lý Dorami, Chong chóng tre)
        page.evaluate("""() => {
            window.game.coins = 9999;
            // Nâng cấp toàn bộ
            window.game.buyUpgrade('expandTable'); // bàn 3
            window.game.buyUpgrade('expandTable'); // bàn 4
            window.game.buyUpgrade('expandTable'); // bàn 5
            window.game.buyUpgrade('expandTable'); // bàn 6
            window.game.buyUpgrade('hireDorami');   // Em gái Dorami phụ bếp
            window.game.buyUpgrade('anywhereDoor'); // Cánh cửa thần kỳ VIP
            window.game.buyUpgrade('bambooCopter'); // Chong chóng tre lv 1
            window.game.buyUpgrade('bambooCopter'); // Chong chóng tre lv 2
            window.game.buyUpgrade('stoveSpeed');   // Bếp siêu tốc
            window.game.reputation = 680;
        }""")
        page.wait_for_timeout(1000)

        # Chụp ảnh 1: Nhà hàng sau khi nâng cấp Full cấp độ (Toàn cảnh 6 bàn, Bồn rửa bát, Cửa Thần Kỳ)
        shot1 = os.path.join(SCREENSHOT_DIR, "01_high_level_restaurant_upgraded.png")
        page.screenshot(path=shot1)
        print(f"[Captured 1] Nhà hàng nâng cấp tối thượng: {shot1}")

        # 2. Sinh khách đông đúc (Cả khách VIP xuyên không bước ra từ cửa thần kỳ)
        print("[Simulation Lead] Đón lượng khách đông đúc nườm nượp...")
        for _ in range(5):
            page.evaluate("() => window.game.spawnCustomer()")
            page.wait_for_timeout(400)

        page.wait_for_timeout(2500) # Đợi khách vào kín bàn
        shot2 = os.path.join(SCREENSHOT_DIR, "02_crowded_customers_seated.png")
        page.screenshot(path=shot2)
        print(f"[Captured 2] Khách ngồi đông đúc kín cả 6 bàn: {shot2}")

        # 3. Doraemon bước đi có hoạt ảnh 4 frame + chân nhún nhẩy + chong chóng tre quay tít
        canvas = page.locator("#gameCanvas")
        box = canvas.bounding_box()
        stove_x = box["x"] + 520
        stove_y = box["y"] + 90
        page.mouse.click(stove_x, stove_y)
        page.wait_for_timeout(1200) # Lấy bánh

        shot3 = os.path.join(SCREENSHOT_DIR, "03_doraemon_moving_walk_cycle.png")
        page.screenshot(path=shot3)
        print(f"[Captured 3] Hoạt ảnh bước đi & chong chóng tre: {shot3}")

        # 4. Phục vụ bàn và xem Dorami tự động chạy dọn dĩa bẩn
        # Click bàn 1 và bàn 2
        page.mouse.click(box["x"] + 185, box["y"] + 210)
        page.wait_for_timeout(1500)
        page.mouse.click(stove_x, stove_y)
        page.wait_for_timeout(1500)
        page.mouse.click(box["x"] + 515, box["y"] + 210)
        page.wait_for_timeout(3500) # Khách ăn xong để lại dĩa dơ

        shot4 = os.path.join(SCREENSHOT_DIR, "04_dorami_cleaning_dishes_and_vips.png")
        page.screenshot(path=shot4)
        print(f"[Captured 4] Em gái Dorami dọn bàn dĩa bẩn & Khách VIP thưởng tiền: {shot4}")

        browser.close()
        print("SIMULATION PLAYTEST COMPLETED!")

if __name__ == "__main__":
    run_simulation()
