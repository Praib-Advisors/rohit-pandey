import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

def create_background(W, H, crowd_img_path):
    # 1. Base warm gradient
    base_small = Image.new("RGB", (4, 4))
    palette = [
        (255, 248, 235), (255, 238, 215), (255, 225, 190), (250, 205, 165),
        (255, 245, 228), (255, 232, 205), (253, 218, 180), (248, 195, 150),
        (255, 240, 220), (252, 225, 195), (250, 210, 170), (245, 185, 140),
        (255, 235, 210), (250, 218, 185), (245, 200, 160), (240, 175, 130)
    ]
    base_small.putdata(palette)
    base = base_small.resize((W, H), Image.Resampling.BICUBIC)

    # 2. Crowd photo as atmospheric background texture
    if os.path.exists(crowd_img_path):
        crowd = Image.open(crowd_img_path).convert("RGB")
        scale = max(W / crowd.width, H / crowd.height)
        cw = int(crowd.width * scale)
        ch = int(crowd.height * scale)
        crowd_scaled = crowd.resize((cw, ch), Image.Resampling.LANCZOS)
        # Center crop
        cx = (cw - W) // 2
        cy = (ch - H) // 2
        crowd_crop = crowd_scaled.crop((cx, cy, cx + W, cy + H))
        
        # Soft blur
        crowd_blur = crowd_crop.filter(ImageFilter.GaussianBlur(22))
        
        # Make crowd high-key / bright
        enhancer = ImageEnhance.Brightness(crowd_blur)
        crowd_bright = enhancer.enhance(1.25)
        
        # Blend base with bright blurred crowd
        base = Image.blend(base, crowd_bright, 0.28)

    # 3. Radiant warm sunlight flare from upper left (behind leader)
    sun = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(sun)
    center_x, center_y = 480, 120
    for r in range(650, 0, -15):
        alpha = int(70 * (1 - (r / 650) ** 1.5))
        # Warm golden white light
        s_draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=(255, 245, 210, alpha))
    sun = sun.filter(ImageFilter.GaussianBlur(30))

    canvas = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    canvas.paste(base, (0, 0))
    canvas.paste(sun, (0, 0), sun)
    return canvas

def create_framed_photo(img_path, target_w, target_h, border_color=(251, 171, 30), border_w=12, angle=0):
    img = Image.open(img_path).convert("RGB")
    
    # Scale & crop
    scale = max(target_w / img.width, target_h / img.height)
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    img_scaled = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    img_cropped = img_scaled.crop((left, top, left + target_w, top + target_h))
    
    # Add crisp golden border
    framed_w = target_w + border_w * 2
    framed_h = target_h + border_w * 2
    framed = Image.new("RGBA", (framed_w, framed_h), (*border_color, 255))
    framed.paste(img_cropped, (border_w, border_w))
    
    # Rotated image
    rotated = framed.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Shadow
    pad = 60
    shadow_pad = Image.new("RGBA", (framed_w + pad * 2, framed_h + pad * 2), (0, 0, 0, 0))
    shadow_mask = Image.new("L", framed.size, 160)
    shadow_pad.paste(Image.new("RGBA", framed.size, (25, 12, 5, 180)), (pad + 12, pad + 18), shadow_mask)
    shadow_pad = shadow_pad.filter(ImageFilter.GaussianBlur(20))
    shadow_rotated = shadow_pad.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    
    # Composite shadow + frame
    cw = max(rotated.width, shadow_rotated.width) + 10
    ch = max(rotated.height, shadow_rotated.height) + 10
    comp = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    
    sx = (cw - shadow_rotated.width) // 2
    sy = (ch - shadow_rotated.height) // 2
    comp.paste(shadow_rotated, (sx, sy), shadow_rotated)
    
    rx = (cw - rotated.width) // 2
    ry = (ch - rotated.height) // 2
    comp.paste(rotated, (rx, ry), rotated)
    
    return comp

def draw_brush_swoosh(draw, x_start, y_start, width, height, color=(216, 68, 9, 255)):
    steps = 120
    points = []
    for i in range(steps + 1):
        t = i / steps
        x = x_start + t * width
        # Gentle curve: dip then rise
        y = y_start + math.sin(t * math.pi) * height * 0.45 + (t * 6)
        points.append((x, y))
    
    for i in range(steps):
        t = i / steps
        if t < 0.25:
            thick = 6 + (t / 0.25) * 11
        else:
            thick = 17 * ((1.0 - (t - 0.25) / 0.75) ** 1.3)
        thick = max(1.5, thick)
        draw.line([points[i], points[i+1]], fill=color, width=int(round(thick)))

def generate_banner(output_filename, p_cutout, p_top, p_mid, p_bot, text_line1="Rooted in", text_line2="Janseva"):
    W, H = 2048, 870
    
    # 1. Background
    canvas = create_background(W, H, p_top)
    
    # 2. Photos collage on the right
    # Exact coordinates matching reference:
    # Top frame (1240..2040, y: 10..460)
    top_frame = create_framed_photo(p_top, target_w=780, target_h=460, border_color=(251, 171, 30), border_w=12, angle=-2.5)
    canvas.paste(top_frame, (1220, 20), top_frame)
    
    # Middle frame (820..1480, y: 310..760)
    mid_frame = create_framed_photo(p_mid, target_w=620, target_h=490, border_color=(251, 171, 30), border_w=12, angle=3.2)
    canvas.paste(mid_frame, (810, 310), mid_frame)
    
    # Bottom frame (1300..2040, y: 440..860)
    bot_frame = create_framed_photo(p_bot, target_w=710, target_h=440, border_color=(251, 171, 30), border_w=12, angle=-1.6)
    canvas.paste(bot_frame, (1290, 430), bot_frame)
    
    # 3. Typography
    font_serif = ImageFont.truetype(r"C:\Windows\Fonts\georgiaz.ttf", 102)
    font_script = ImageFont.truetype(r"C:\Windows\Fonts\BRUSHSCI.TTF", 185)
    
    txt_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(txt_layer)
    
    tx = 630
    ty1 = 45
    ty2 = 135
    
    # Clean white subtle halo for maximum clarity
    for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2), (-1, -1), (1, 1)]:
        t_draw.text((tx + dx, ty1 + dy), text_line1, font=font_serif, fill=(255, 255, 255, 140))
        t_draw.text((tx + dx, ty2 + dy), text_line2, font=font_script, fill=(255, 255, 255, 140))
    
    # Primary colored text
    t_draw.text((tx, ty1), text_line1, font=font_serif, fill=(8, 10, 101, 255))
    t_draw.text((tx, ty2), text_line2, font=font_script, fill=(216, 68, 9, 255))
    
    # Brush stroke underline
    draw_brush_swoosh(t_draw, x_start=tx + 30, y_start=ty2 + 180, width=320, height=22, color=(216, 68, 9, 255))
    
    canvas.paste(txt_layer, (0, 0), txt_layer)
    
    # 4. Cutout on the left
    cutout = Image.open(p_cutout).convert("RGBA")
    target_cutout_h = 870
    scale = target_cutout_h / cutout.height
    target_cutout_w = int(cutout.width * scale)
    cutout_scaled = cutout.resize((target_cutout_w, target_cutout_h), Image.Resampling.LANCZOS)
    
    # Soft drop shadow behind cutout
    cutout_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mask = cutout_scaled.getchannel("A")
    shadow_fill = Image.new("RGBA", cutout_scaled.size, (20, 10, 5, 110))
    cutout_shadow.paste(shadow_fill, (45, 16), mask)
    cutout_shadow = cutout_shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.paste(cutout_shadow, (0, 0), cutout_shadow)
    
    # Paste cutout
    canvas.paste(cutout_scaled, (25, 0), cutout_scaled)
    
    # Save
    out_dir = r"C:\Users\kumar\OneDrive\Desktop\rohit-pandey-main\rohit-pandey-main\public\images"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, output_filename)
    canvas.convert("RGB").save(out_file, quality=96)
    
    # Also copy to artifact dir so we can embed in artifact
    artifact_dir = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57"
    artifact_file = os.path.join(artifact_dir, output_filename)
    canvas.convert("RGB").save(artifact_file, quality=96)
    
    print(f"Generated: {out_file} & {artifact_file}")
    return out_file

def main():
    p_cutout = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57\.user_uploaded\media_1794918807967_c6b229f0.png"
    p_statue = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57\.user_uploaded\media_1794918830831_faed9221.jpg"
    p_library = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57\.user_uploaded\media_1794918854468_901c7bc2.jpg"
    p_hands = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57\.user_uploaded\media_1794918894961_a0e2b621.jpg"
    p_garland = r"C:\Users\kumar\.gemini\antigravity\brain\ce5dcab4-23b8-4a17-9890-ceeb84124e57\.user_uploaded\media_1794918918374_04e56774.jpg"
    
    # Option 1: Top=Garland, Mid=Hands with Akhilesh, Bot=Library bouquet
    generate_banner(
        output_filename="banner-rooted-in-janseva-opt1.png",
        p_cutout=p_cutout,
        p_top=p_garland,
        p_mid=p_hands,
        p_bot=p_library,
        text_line1="Rooted in",
        text_line2="Janseva"
    )
    
    # Option 2: Top=Garland, Mid=Hands with Akhilesh, Bot=Netaji Statue
    generate_banner(
        output_filename="banner-rooted-in-janseva-opt2.png",
        p_cutout=p_cutout,
        p_top=p_garland,
        p_mid=p_hands,
        p_bot=p_statue,
        text_line1="Rooted in",
        text_line2="Janseva"
    )

if __name__ == "__main__":
    main()
