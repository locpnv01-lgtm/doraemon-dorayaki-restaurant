from PIL import Image, ImageDraw
import os

ASSETS_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/assets/sprites"
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_doraemon_sprite():
    img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Shadow
    d.ellipse([34, 114, 94, 126], fill=(0, 0, 0, 60))
    
    # Feet (White ovals)
    d.ellipse([32, 102, 60, 118], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=2)
    d.ellipse([68, 102, 96, 118], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=2)
    
    # Body (Blue)
    d.ellipse([38, 54, 90, 108], fill=(2, 132, 199, 255), outline=(15, 23, 42, 255), width=3)
    
    # Belly (White)
    d.ellipse([44, 62, 84, 100], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=2)
    
    # Pocket (Half circle)
    d.pieslice([48, 70, 80, 96], 0, 180, fill=None, outline=(15, 23, 42, 255), width=2)
    d.line([48, 83, 80, 83], fill=(15, 23, 42, 255), width=2)
    
    # Collar (Red) & Yellow Bell
    d.rounded_rectangle([38, 54, 90, 64], radius=3, fill=(239, 68, 68, 255), outline=(15, 23, 42, 255), width=2)
    d.ellipse([58, 60, 70, 72], fill=(250, 204, 21, 255), outline=(15, 23, 42, 255), width=2)
    d.line([60, 67, 68, 67], fill=(15, 23, 42, 255), width=1)
    
    # Head (Blue)
    d.ellipse([26, 10, 102, 68], fill=(2, 132, 199, 255), outline=(15, 23, 42, 255), width=3)
    
    # Face mask (White)
    d.ellipse([32, 24, 96, 66], fill=(255, 255, 255, 255), outline=(148, 163, 184, 255), width=1)
    
    # Eyes
    d.ellipse([48, 16, 62, 38], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=2)
    d.ellipse([66, 16, 80, 38], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=2)
    # Pupils
    d.ellipse([55, 24, 60, 32], fill=(15, 23, 42, 255))
    d.ellipse([68, 24, 73, 32], fill=(15, 23, 42, 255))
    
    # Red Nose
    d.ellipse([58, 33, 70, 45], fill=(239, 68, 68, 255), outline=(15, 23, 42, 255), width=2)
    d.ellipse([60, 35, 64, 38], fill=(255, 255, 255, 220)) # shine
    
    # Nose line to mouth
    d.line([64, 45, 64, 52], fill=(15, 23, 42, 255), width=2)
    
    # Whiskers
    d.line([40, 36, 54, 38], fill=(15, 23, 42, 255), width=2)
    d.line([38, 43, 54, 43], fill=(15, 23, 42, 255), width=2)
    d.line([40, 50, 54, 47], fill=(15, 23, 42, 255), width=2)
    
    d.line([74, 38, 88, 36], fill=(15, 23, 42, 255), width=2)
    d.line([74, 43, 90, 43], fill=(15, 23, 42, 255), width=2)
    d.line([74, 47, 88, 50], fill=(15, 23, 42, 255), width=2)
    
    # Smile
    d.arc([46, 38, 82, 58], 15, 165, fill=(15, 23, 42, 255), width=2)
    
    # Hands (White spheres)
    d.ellipse([20, 68, 38, 86], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=2)
    d.ellipse([90, 68, 108, 86], fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=2)
    
    img.save(os.path.join(ASSETS_DIR, "doraemon.png"))
    print("Generated doraemon.png")

def create_dorayaki_sprite():
    img = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Shadow
    d.ellipse([14, 56, 66, 72], fill=(0, 0, 0, 50))
    # Outer golden brown pancake
    d.ellipse([10, 20, 70, 58], fill=(180, 83, 9, 255), outline=(120, 53, 15, 255), width=3)
    # Red bean paste layer in the middle
    d.rounded_rectangle([12, 36, 68, 44], radius=4, fill=(69, 10, 10, 255))
    # Golden top crust
    d.ellipse([14, 22, 66, 42], fill=(217, 119, 6, 255))
    # Highlights / Gloss
    d.ellipse([22, 25, 46, 32], fill=(251, 191, 36, 180))
    d.ellipse([26, 27, 36, 30], fill=(255, 255, 255, 200))
    
    img.save(os.path.join(ASSETS_DIR, "dorayaki.png"))
    print("Generated dorayaki.png")

def create_customer_sprite(name, filename, shirt_color, hair_color, has_glasses=False):
    img = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Shadow
    d.ellipse([28, 84, 72, 94], fill=(0, 0, 0, 50))
    
    # Pants
    d.rectangle([38, 70, 62, 86], fill=(30, 41, 59, 255))
    
    # Shirt / Body
    d.rounded_rectangle([32, 44, 68, 74], radius=4, fill=shirt_color, outline=(15, 23, 42, 255), width=2)
    
    # Head (Skin tone)
    d.ellipse([30, 14, 70, 50], fill=(254, 215, 170, 255), outline=(15, 23, 42, 255), width=2)
    
    # Hair
    d.pieslice([28, 10, 72, 42], 180, 360, fill=hair_color)
    d.rectangle([28, 22, 34, 34], fill=hair_color)
    d.rectangle([66, 22, 72, 34], fill=hair_color)
    
    # Eyes & Smile
    if has_glasses:
        # Nobita round glasses
        d.ellipse([36, 26, 48, 38], fill=(255, 255, 255, 200), outline=(15, 23, 42, 255), width=2)
        d.ellipse([52, 26, 64, 38], fill=(255, 255, 255, 200), outline=(15, 23, 42, 255), width=2)
        d.line([48, 32, 52, 32], fill=(15, 23, 42, 255), width=2)
        d.ellipse([41, 30, 44, 34], fill=(15, 23, 42, 255))
        d.ellipse([56, 30, 59, 34], fill=(15, 23, 42, 255))
    else:
        d.ellipse([40, 30, 44, 35], fill=(15, 23, 42, 255))
        d.ellipse([56, 30, 60, 35], fill=(15, 23, 42, 255))
        
    d.arc([44, 36, 56, 44], 20, 160, fill=(15, 23, 42, 255), width=2)
    
    img.save(os.path.join(ASSETS_DIR, filename))
    print(f"Generated {filename} ({name})")

create_doraemon_sprite()
create_dorayaki_sprite()
create_customer_sprite("Nobita", "customer_1.png", (234, 179, 8, 255), (20, 20, 20, 255), has_glasses=True)
create_customer_sprite("Shizuka", "customer_2.png", (236, 72, 153, 255), (75, 40, 25, 255), has_glasses=False)
create_customer_sprite("Jaian", "customer_3.png", (249, 115, 22, 255), (15, 23, 42, 255), has_glasses=False)
