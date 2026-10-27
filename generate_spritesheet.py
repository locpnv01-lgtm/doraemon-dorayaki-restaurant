from PIL import Image, ImageDraw
import os

ASSETS_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/assets/sprites"
os.makedirs(ASSETS_DIR, exist_ok=True)

# 1. Tạo Sprite Sheet Doraemon 4 frame hoạt ảnh bước đi (Walking animation)
# Frame size: 64x64, Tổng: 256x64
def create_doraemon_walk_sheet():
    sheet = Image.new("RGBA", (256, 64), (0, 0, 0, 0))
    # 4 frames: [0: Idle, 1: Step Left, 2: Pass, 3: Step Right]
    for frame in range(4):
        img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        
        # bobbing offset
        bob = -2 if frame in (1, 3) else 0
        leg_offset = -3 if frame == 1 else (3 if frame == 3 else 0)
        
        # Shadow
        d.ellipse([14, 56, 50, 63], fill=(0, 0, 0, 50))
        
        # Feet (Bàn chân trắng tròn)
        d.ellipse([16 + leg_offset, 50 + bob, 32 + leg_offset, 60 + bob], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=1)
        d.ellipse([32 - leg_offset, 50 + bob, 48 - leg_offset, 60 + bob], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=1)
        
        # Body
        d.ellipse([18, 26 + bob, 46, 54 + bob], fill=(2, 132, 199, 255), outline=(15, 23, 42, 255), width=2)
        # Belly
        d.ellipse([22, 30 + bob, 42, 50 + bob], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=1)
        # Pocket
        d.pieslice([24, 34 + bob, 40, 48 + bob], 0, 180, fill=None, outline=(15, 23, 42, 255), width=1)
        d.line([24, 41 + bob, 40, 41 + bob], fill=(15, 23, 42, 255), width=1)
        
        # Collar & Bell
        d.rectangle([18, 25 + bob, 46, 29 + bob], fill=(239, 68, 68, 255))
        d.ellipse([29, 28 + bob, 35, 34 + bob], fill=(250, 204, 21, 255), outline=(15, 23, 42, 255), width=1)
        
        # Head
        d.ellipse([12, 4 + bob, 52, 36 + bob], fill=(2, 132, 199, 255), outline=(15, 23, 42, 255), width=2)
        # Face white
        d.ellipse([15, 11 + bob, 49, 35 + bob], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=1)
        
        # Eyes
        d.ellipse([24, 7 + bob, 31, 19 + bob], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
        d.ellipse([33, 7 + bob, 40, 19 + bob], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
        d.ellipse([27, 11 + bob, 30, 16 + bob], fill=(15, 23, 42, 255))
        d.ellipse([34, 11 + bob, 37, 16 + bob], fill=(15, 23, 42, 255))
        
        # Nose & Whiskers
        d.ellipse([29, 16 + bob, 35, 22 + bob], fill=(239, 68, 68, 255))
        d.line([32, 22 + bob, 32, 27 + bob], fill=(15, 23, 42, 255), width=1)
        d.arc([23, 18 + bob, 41, 30 + bob], 20, 160, fill=(15, 23, 42, 255), width=1)
        
        # Whiskers
        d.line([20, 18 + bob, 27, 19 + bob], fill=(15, 23, 42, 255), width=1)
        d.line([19, 22 + bob, 27, 22 + bob], fill=(15, 23, 42, 255), width=1)
        d.line([37, 19 + bob, 44, 18 + bob], fill=(15, 23, 42, 255), width=1)
        d.line([37, 22 + bob, 45, 22 + bob], fill=(15, 23, 42, 255), width=1)
        
        # Hands (Đung đưa theo frame)
        arm_bob = 3 if frame == 1 else (-3 if frame == 3 else 0)
        d.ellipse([8, 33 + bob + arm_bob, 18, 43 + bob + arm_bob], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
        d.ellipse([46, 33 + bob - arm_bob, 56, 43 + bob - arm_bob], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
        
        sheet.paste(img, (frame * 64, 0))
    
    sheet.save(os.path.join(ASSETS_DIR, "doraemon_sheet.png"))
    print("Generated doraemon_sheet.png (4-frame walk cycle)")

# 2. Tạo Sprite Dorami (Trợ lý nhà hàng tự động bưng đồ)
def create_dorami_sprite():
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Shadow
    d.ellipse([14, 56, 50, 63], fill=(0, 0, 0, 50))
    # Feet
    d.ellipse([18, 50, 32, 60], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=1)
    d.ellipse([32, 50, 46, 60], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=1)
    # Body (Vàng chanh #facc15)
    d.ellipse([18, 26, 46, 54], fill=(250, 204, 21, 255), outline=(15, 23, 42, 255), width=2)
    # White belly & pocket
    d.ellipse([22, 30, 42, 50], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=1)
    # Nơ đỏ trên đầu Dorami đặc trưng!
    d.polygon([(18, 2), (28, 10), (18, 18)], fill=(239, 68, 68, 255))
    d.polygon([(46, 2), (36, 10), (46, 18)], fill=(239, 68, 68, 255))
    d.ellipse([28, 6, 36, 14], fill=(220, 38, 38, 255))
    # Head (Vàng)
    d.ellipse([12, 10, 52, 40], fill=(250, 204, 21, 255), outline=(15, 23, 42, 255), width=2)
    # White face
    d.ellipse([16, 16, 48, 38], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=1)
    # Eyes with eyelashes
    d.ellipse([24, 15, 30, 24], fill=(15, 23, 42, 255))
    d.ellipse([34, 15, 40, 24], fill=(15, 23, 42, 255))
    d.ellipse([26, 17, 28, 20], fill=(255, 255, 255, 255))
    d.ellipse([36, 17, 38, 20], fill=(255, 255, 255, 255))
    # Pink nose & smile
    d.ellipse([30, 23, 34, 27], fill=(244, 114, 182, 255))
    d.arc([25, 24, 39, 34], 20, 160, fill=(15, 23, 42, 255), width=1)
    # Hands
    d.ellipse([8, 34, 18, 44], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
    d.ellipse([46, 34, 56, 44], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
    
    img.save(os.path.join(ASSETS_DIR, "dorami.png"))
    print("Generated dorami.png (Assistant robot)")

# 3. Tạo Đồ trang trí & Rác / Bát đĩa bẩn
def create_dirty_dishes():
    img = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Plate
    d.ellipse([6, 18, 42, 36], fill=(226, 232, 240, 255), outline=(100, 116, 139, 255), width=2)
    # Crumbs / sauce
    d.ellipse([14, 24, 22, 28], fill=(69, 10, 10, 255))
    d.ellipse([26, 22, 34, 30], fill=(180, 83, 9, 255))
    d.point([(20, 28), (28, 26), (32, 28), (16, 22)], fill=(69, 10, 10, 255))
    img.save(os.path.join(ASSETS_DIR, "dirty_dish.png"))
    print("Generated dirty_dish.png")

create_doraemon_walk_sheet()
create_dorami_sprite()
create_dirty_dishes()
