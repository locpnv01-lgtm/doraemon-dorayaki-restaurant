from PIL import Image, ImageDraw
import os

ASSETS_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/assets/sprites"
os.makedirs(ASSETS_DIR, exist_ok=True)

# 1. Chậu cây Bonsai Nhật Bản (32x40)
def make_bonsai():
    img = Image.new("RGBA", (32, 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Pot (Chậu gốm nung nâu)
    d.polygon([(6, 28), (26, 28), (22, 38), (10, 38)], fill=(120, 53, 15, 255), outline=(69, 26, 3, 255))
    # Trunk (Thân cây uốn lượn)
    d.line([(16, 28), (18, 20), (12, 14), (16, 8)], fill=(92, 40, 10, 255), width=3)
    # Leaves (Tán lá xanh nhiều tầng có highlight)
    d.ellipse([8, 10, 20, 18], fill=(22, 101, 52, 255), outline=(20, 83, 45, 255))
    d.ellipse([14, 4, 26, 12], fill=(34, 197, 94, 255), outline=(21, 128, 61, 255))
    d.ellipse([4, 16, 16, 24], fill=(74, 222, 128, 200))
    img.resize((64, 80), Image.NEAREST).save(os.path.join(ASSETS_DIR, "decor_bonsai.png"))
    print("Generated decor_bonsai.png")

# 2. Đèn lồng đỏ may mắn (Red Lantern - 24x36)
def make_lantern():
    img = Image.new("RGBA", (24, 36), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Dây treo
    d.line([(12, 0), (12, 6)], fill=(15, 23, 42, 255), width=1)
    # Thân lồng đèn đỏ
    d.ellipse([4, 6, 20, 28], fill=(220, 38, 38, 255), outline=(153, 27, 27, 255), width=1)
    # Nẹp vàng trên dưới
    d.rectangle([6, 5, 18, 8], fill=(234, 179, 8, 255))
    d.rectangle([6, 26, 18, 29], fill=(234, 179, 8, 255))
    # Sọc lồng đèn
    d.ellipse([8, 6, 16, 28], fill=None, outline=(185, 28, 28, 255), width=1)
    # Tua rua vàng phía dưới
    d.line([(12, 29), (12, 35)], fill=(234, 179, 8, 255), width=2)
    img.resize((48, 72), Image.NEAREST).save(os.path.join(ASSETS_DIR, "decor_lantern.png"))
    print("Generated decor_lantern.png")

# 3. Mèo thần tài Maneki-neko vẫy tay (28x32)
def make_lucky_cat():
    img = Image.new("RGBA", (28, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Body
    d.ellipse([4, 10, 24, 30], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
    # Ears
    d.polygon([(6, 10), (10, 4), (12, 11)], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255))
    d.polygon([(16, 11), (18, 4), (22, 10)], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255))
    d.polygon([(7, 9), (10, 6), (11, 10)], fill=(244, 114, 182, 255))
    # Red collar & Coin
    d.rectangle([7, 18, 21, 20], fill=(239, 68, 68, 255))
    d.ellipse([10, 21, 18, 27], fill=(250, 204, 21, 255), outline=(161, 98, 7, 255))
    # Paws (Vẫy tay phải)
    d.ellipse([20, 6, 26, 16], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=1)
    # Face
    d.arc([8, 12, 13, 16], 180, 360, fill=(15, 23, 42, 255), width=1)
    d.arc([15, 12, 20, 16], 180, 360, fill=(15, 23, 42, 255), width=1)
    img.resize((56, 64), Image.NEAREST).save(os.path.join(ASSETS_DIR, "decor_lucky_cat.png"))
    print("Generated decor_lucky_cat.png")

make_bonsai()
make_lantern()
make_lucky_cat()
