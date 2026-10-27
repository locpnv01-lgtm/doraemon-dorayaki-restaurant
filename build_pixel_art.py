from PIL import Image
import os

ASSETS_DIR = "/home/hatch/.gemini/antigravity-cli/scratch/dorayaki-restaurant/assets/sprites"
os.makedirs(ASSETS_DIR, exist_ok=True)

def parse_ascii_art(lines, palette, scale=2):
    # lines: list of strings with equal length
    h = len(lines)
    w = len(lines[0])
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for y, line in enumerate(lines):
        for x, char in enumerate(line):
            if char in palette and palette[char] is not None:
                img.putpixel((x, y), palette[char])
    if scale > 1:
        img = img.resize((w * scale, h * scale), Image.NEAREST)
    return img

# ==========================================
# 1. DORAEMON 16-BIT KAIROSOFT SPRITE (24x24 pixel grid -> scale to 48x48)
# Palette:
# '.' : None (transparent)
# '#' : #111827 Dark Outline
# 'B' : #0284c7 Main Blue
# 'b' : #0369a1 Dark Blue shading
# 'L' : #38bdf8 Highlight Blue
# 'W' : #ffffff Face/Belly White
# 'w' : #cbd5e1 White shadow
# 'R' : #ef4444 Red Collar/Nose
# 'r' : #991b1b Dark Red
# 'Y' : #facc15 Yellow Bell
# 'y' : #ca8a04 Dark Yellow
# ==========================================

doraemon_idle_matrix = [
    "........########........",
    "......##BBLLBBBB##......",
    ".....#BBLLBBBBBBbb#.....",
    "....#BLLBBBBBBBBbbb#....",
    "...#BLLBBBBBBBBBbbbb#...",
    "...#BBBB##WW##BBbbbb#...",
    "...#BBB#WWWWWW#Bbbbb#...",
    "...#BB#WW#WW#WW#bbbb#...",
    "...#BB#WW#WW#WW#bbbb#...",
    "...#BB#WWWWWWWW#bbbb#...",
    "...#BB#WW#RR#WW#bbbb#...",
    "...#BB#WW#rr#WW#bbbb#...",
    "...#BB#W######W#bbbb#...",
    "...#BBB#WWWWWW#Bbbbb#...",
    "....#BB#wwwwww#Bbbb#....",
    ".....#RRRRRRRRRRRR#.....",
    "....##RRRR##YY##RR##....",
    "...#BB#RR#YYYYYY#R#bb#..",
    "..#WWB#RR#YYYYYY#R#BWW#.",
    "..#WW#BB##wWWw##BB#WW#..",
    "..#ww#BBB#WWWW#BBB#ww#..",
    "...##.BBB#wwww#BBB.##...",
    ".......#WWWWWWWW#.......",
    "......#WWWW##WWWW#......",
]

doraemon_palette = {
    '.': None,
    '#': (17, 24, 39, 255),
    'B': (2, 132, 199, 255),
    'b': (3, 105, 161, 255),
    'L': (56, 189, 248, 255),
    'W': (255, 255, 255, 255),
    'w': (203, 213, 225, 255),
    'R': (239, 68, 68, 255),
    'r': (153, 27, 27, 255),
    'Y': (250, 204, 21, 255),
    'y': (202, 138, 4, 255)
}

# 4 Frames for Doraemon Walk Sheet
def make_doraemon_sheet():
    frames = []
    # Frame 0: Idle
    f0 = parse_ascii_art(doraemon_idle_matrix, doraemon_palette, scale=2)
    frames.append(f0)
    
    # Frame 1: Step Left (leg shift left, slight bob)
    m1 = list(doraemon_idle_matrix)
    m1[-2] = ".....#WWWWWWWW#........."
    m1[-1] = "....#WWWW##WWWW#........"
    f1 = parse_ascii_art(m1, doraemon_palette, scale=2)
    frames.append(f1)
    
    # Frame 2: Mid
    frames.append(f0)
    
    # Frame 3: Step Right
    m3 = list(doraemon_idle_matrix)
    m3[-2] = ".........#WWWWWWWW#....."
    m3[-1] = "........#WWWW##WWWW#...."
    f3 = parse_ascii_art(m3, doraemon_palette, scale=2)
    frames.append(f3)
    
    sheet = Image.new("RGBA", (48 * 4, 48), (0, 0, 0, 0))
    for i, fr in enumerate(frames):
        sheet.paste(fr, (i * 48, 0))
    sheet.save(os.path.join(ASSETS_DIR, "doraemon_sheet.png"))
    f0.save(os.path.join(ASSETS_DIR, "doraemon.png"))
    print("Exported 16-bit Doraemon pixel sprites!")

# ==========================================
# 2. DORAYAKI 16-BIT RETRO DELICIOUS
# Palette:
# '#' : #451a03 Dark Crust Outline
# 'G' : #b45309 Golden Brown Crust
# 'g' : #d97706 Warm Golden
# 'L' : #fef08a Crust Highlight Gloss
# 'A' : #450a0a Sweet Azuki Bean Paste
# 'a' : #7f1d1d Bean Paste Shading
# ==========================================

dorayaki_matrix = [
    ".......########.......",
    "....###GggggggG###....",
    "..##GGggLLLLggggGG##..",
    ".#GGggLLLLLLLLggggGG#.",
    "#GGggggggggggggggggGG#",
    "#GGggggggggggggggggGG#",
    "#AAaAaAAAAAAAAaAaAAaA#",
    "#AAAAAAAAAAAAAAAAAAAA#",
    ".#GGgggggggggggggggg#.",
    "..##GGGGGGGGGGGGGG##..",
    "....##############....",
]

dorayaki_palette = {
    '.': None,
    '#': (69, 26, 3, 255),
    'G': (180, 83, 9, 255),
    'g': (217, 119, 6, 255),
    'L': (254, 240, 138, 255),
    'A': (69, 10, 10, 255),
    'a': (127, 29, 29, 255)
}

def make_dorayaki():
    img = parse_ascii_art(dorayaki_matrix, dorayaki_palette, scale=3)
    img.save(os.path.join(ASSETS_DIR, "dorayaki.png"))
    print("Exported 16-bit Dorayaki sprite!")

# ==========================================
# 3. NOBITA 16-BIT (Glasses, Yellow Polo, Navy Shorts)
# ==========================================
nobita_matrix = [
    "........########........",
    "......##HHHHHHHH##......",
    ".....#HHHHHHHHHHHH#.....",
    "....#HHHHHHHHHHHHHH#....",
    "...#HHHHH######HHHHH#...",
    "...#HHH##SSSSSS##HHH#...",
    "...#HH#SSSSSSSSSS#HH#...",
    "...#H#S##SS##SS##S#H#...",
    "...#H#S#w#S#w#S#w#S#H#..",
    "...#H#S#w#S#w#S#w#S#H#..",
    "...#HH#SSSSSSSSSS#HH#...",
    "...#HH#SSS####SSS#HH#...",
    "....#HH#SSSSSSSS#HH#....",
    ".....#YY########YY#.....",
    "....#YYYYYYYYYYYYYY#....",
    "...#YYYYYYYwwYYYYYYY#...",
    "...#YY#YYYYwwYYYY#YY#...",
    "..#SS#YYYYYwwYYYYY#SS#..",
    "..#SS#YYYYYYYYYYYY#SS#..",
    "...##.############.##...",
    "......#PPPP##PPPP#......",
    "......#PPPP##PPPP#......",
    "......#SSSS##SSSS#......",
    ".....#WWWW####WWWW#.....",
]

nobita_palette = {
    '.': None,
    '#': (17, 24, 39, 255),
    'H': (30, 27, 24, 255),    # Black/dark hair
    'S': (254, 215, 170, 255), # Skin
    'w': (255, 255, 255, 255), # Glasses shine
    'Y': (234, 179, 8, 255),   # Yellow shirt
    'P': (30, 41, 59, 255),    # Navy shorts
    'W': (226, 232, 240, 255)  # White socks/shoes
}

# ==========================================
# 4. SHIZUKA 16-BIT (Pigtails, Pink Dress)
# ==========================================
shizuka_matrix = [
    "....##............##....",
    "...#HH#..######..#HH#...",
    "...#HH###HHHHHH###HH#...",
    "...#HHHHHHHHHHHHHHHH#...",
    "....#HHHH######HHHH#....",
    "....#HH##SSSSSS##HH#....",
    "....#H#SSSSSSSSSS#H#....",
    "....#H#S##SSSS##S#H#....",
    "....#H#S##SSSS##S#H#....",
    "....#H#SSSSSSSSSS#H#....",
    "....#HH#SS####SS#HH#....",
    ".....#HH#SSSSSS#HH#.....",
    "......############......",
    ".....#KKKKKKKKKKKK#.....",
    "....#KKKKKwwwwKKKKK#....",
    "...#KK#KKKwwwwKKK#KK#...",
    "..#SS#KKKKKKKKKKKK#SS#..",
    "..#SS#KKKKKKKKKKKK#SS#..",
    "...##.KKKKKKKKKKKK.##...",
    "......#SSSS##SSSS#......",
    "......#SSSS##SSSS#......",
    "......#SSSS##SSSS#......",
    "......#SSSS##SSSS#......",
    ".....#WWWW####WWWW#.....",
]

shizuka_palette = {
    '.': None,
    '#': (17, 24, 39, 255),
    'H': (69, 26, 3, 255),     # Brown pigtails
    'S': (254, 215, 170, 255), # Soft skin
    'w': (255, 255, 255, 255), # White collar
    'K': (236, 72, 153, 255),  # Pink dress
    'W': (244, 114, 182, 255)  # Pink shoes
}

# ==========================================
# 5. JAIAN 16-BIT (Orange striped sweater, Strong posture)
# ==========================================
jaian_matrix = [
    ".......##########.......",
    ".....##HHHHHHHHHH##.....",
    "....#HHHHHHHHHHHHHH#....",
    "...#HHHHHHHHHHHHHHHH#...",
    "...#HHH############H#...",
    "...#HH#SSSSSSSSSSSS#H#..",
    "...#H#SSSSSSSSSSSSSS#H#.",
    "...#H#SS##SSSSSS##SS#H#.",
    "...#H#SS##SSSSSS##SS#H#.",
    "...#H#SSSS######SSSS#H#.",
    "...#HH#SS#SSSSSS#SS#HH#.",
    "....#HH#SSSSSSSSSS#HH#..",
    ".....##############.....",
    "...###OOOOOOOOOOOO###...",
    "..#OOO#WWWWWWWWWW#OOO#..",
    ".#OOOO#WWWWWWWWWW#OOOO#.",
    "#SS#OO#OOOOOOOOOO#OO#SS#",
    "#SS#OO#WWWWWWWWWW#OO#SS#",
    ".##.#O#WWWWWWWWWW#O#.##.",
    "....#OOOOOOOOOOOOOO#....",
    "....#PPPPPP##PPPPPP#....",
    "....#PPPPPP##PPPPPP#....",
    "....#SSSSSS##SSSSSS#....",
    "...#BBBBBB####BBBBBB#...",
]

jaian_palette = {
    '.': None,
    '#': (15, 23, 42, 255),
    'H': (17, 24, 39, 255),    # Black hair
    'S': (253, 186, 116, 255), # Tanned skin
    'O': (249, 115, 22, 255),  # Orange sweater
    'W': (254, 240, 138, 255), # Yellow stripe
    'P': (71, 85, 105, 255),   # Pants
    'B': (120, 53, 15, 255)    # Boots
}

def make_characters():
    c1 = parse_ascii_art(nobita_matrix, nobita_palette, scale=2)
    c1.save(os.path.join(ASSETS_DIR, "customer_1.png"))
    
    c2 = parse_ascii_art(shizuka_matrix, shizuka_palette, scale=2)
    c2.save(os.path.join(ASSETS_DIR, "customer_2.png"))
    
    c3 = parse_ascii_art(jaian_matrix, jaian_palette, scale=2)
    c3.save(os.path.join(ASSETS_DIR, "customer_3.png"))
    print("Exported 16-bit Nobita, Shizuka, Jaian sprites!")

# ==========================================
# 6. DORAMI 16-BIT (Yellow cat robot with red bow)
# ==========================================
dorami_matrix = [
    "...##..............##...",
    "..#RR##..........##RR#..",
    "..#RRRR##########RRRR#..",
    "...#RRRRR######RRRRR#...",
    "....#RRR#YYYYYY#RRR#....",
    ".....###YYYYYYYY###.....",
    "....#YY##WW##WW##YY#....",
    "...#YY#WWWWWWWWWW#YY#...",
    "...#YY#WW##WW##WW#YY#...",
    "...#YY#WW##WW##WW#YY#...",
    "...#YY#WWWWWWWWWW#YY#...",
    "...#YY#WWWWPPWWWW#YY#...",
    "...#YY#WW######WW#YY#...",
    "....#YY#WWWWWWWW#YY#....",
    ".....#BBBBBBBBBBBB#.....",
    "....##BBBB##YY##BB##....",
    "...#YY#BB#YYYYYY#B#YY#..",
    "..#WWY#BB#YYYYYY#BYWW#..",
    "..#WW#YY##wWWw##YY#WW#..",
    "..#ww#YYY#WWWW#YYY#ww#..",
    "...##.YYY#wwww#YYY.##...",
    ".......#WWWWWWWW#.......",
    "......#WWWW##WWWW#......",
    "......############......",
]

dorami_palette = {
    '.': None,
    '#': (17, 24, 39, 255),
    'Y': (250, 204, 21, 255),  # Dorami Yellow
    'R': (239, 68, 68, 255),   # Red Bow
    'B': (59, 130, 246, 255),  # Blue collar
    'W': (255, 255, 255, 255), # White
    'w': (203, 213, 225, 255), # White shadow
    'P': (244, 114, 182, 255)  # Pink nose
}

def make_dorami():
    d = parse_ascii_art(dorami_matrix, dorami_palette, scale=2)
    d.save(os.path.join(ASSETS_DIR, "dorami.png"))
    print("Exported 16-bit Dorami sprite!")

# ==========================================
# 7. DIRTY DISH 16-BIT RETRO
# ==========================================
dish_matrix = [
    "......############......",
    "....##WWWWWWWWWWWW##....",
    "..##WWWWWWWWWWWWWWWW##..",
    ".#WWWWwAAawwWGGWwwWWWW#.",
    "#WWWWwAAAAAwGGGGwWWWWWW#",
    "#WWWWwwAAAAwwGGwwWWWWWW#",
    ".#WWWWwwwwwwwwwwwwWWWW#.",
    "..##WWWWWWWWWWWWWWWW##..",
    "....##WWWWWWWWWWWW##....",
    "......############......",
]

dish_palette = {
    '.': None,
    '#': (71, 85, 105, 255),
    'W': (241, 245, 249, 255), # Ceramic white
    'w': (203, 213, 225, 255), # Shadow
    'A': (69, 10, 10, 255),     # Bean paste stains
    'a': (127, 29, 29, 255),
    'G': (180, 83, 9, 255)      # Pancake crumbs
}

def make_dish():
    d = parse_ascii_art(dish_matrix, dish_palette, scale=2)
    d.save(os.path.join(ASSETS_DIR, "dirty_dish.png"))
    print("Exported 16-bit Dirty dish sprite!")

if __name__ == "__main__":
    make_doraemon_sheet()
    make_dorayaki()
    make_characters()
    make_dorami()
    make_dish()
    print("ALL RETRO 16-BIT ASSETS SUCCESSFULLY BUILT!")
