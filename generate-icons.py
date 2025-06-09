#!/usr/bin/env python3
"""
Generate PWA icons for SAFE MOM app
Creates all required icon sizes programmatically
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a single icon of specified size"""
    # Create image with gradient-like background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle background
    radius = size // 5
    draw.rounded_rectangle(
        [(0, 0), (size-1, size-1)], 
        radius=radius, 
        fill=(233, 30, 99, 255)  # #e91e63
    )
    
    # Try to load a font, fall back to default if not available
    try:
        if size >= 192:
            font_size = size // 8
        else:
            font_size = size // 4
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.load_default()
        except:
            font = None
    
    # Draw text
    if size >= 192:
        # Draw "SAFE MOM" for larger icons
        text1 = "SAFE"
        text2 = "MOM"
        if font:
            bbox1 = draw.textbbox((0, 0), text1, font=font)
            bbox2 = draw.textbbox((0, 0), text2, font=font)
            text1_width = bbox1[2] - bbox1[0]
            text1_height = bbox1[3] - bbox1[1]
            text2_width = bbox2[2] - bbox2[0]
            text2_height = bbox2[3] - bbox2[1]
            
            draw.text(
                ((size - text1_width) // 2, (size // 2) - text1_height - 5),
                text1, 
                fill=(255, 255, 255, 255),
                font=font
            )
            draw.text(
                ((size - text2_width) // 2, (size // 2) + 5),
                text2, 
                fill=(255, 255, 255, 255),
                font=font
            )
        else:
            # Fallback without font
            draw.text((size//4, size//3), "SAFE", fill=(255, 255, 255, 255))
            draw.text((size//4, size//2), "MOM", fill=(255, 255, 255, 255))
    else:
        # Draw "SM" for smaller icons
        text = "SM"
        if font:
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            draw.text(
                ((size - text_width) // 2, (size - text_height) // 2),
                text, 
                fill=(255, 255, 255, 255),
                font=font
            )
        else:
            # Fallback without font
            draw.text((size//3, size//3), text, fill=(255, 255, 255, 255))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Generate all required icons"""
    print("Generating PWA icons for SAFE MOM app...")
    
    # Icon sizes from manifest.json
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        filename = f"icon-{size}.png"
        create_icon(size, filename)
    
    print("\nAll icons generated successfully!")
    print("Icons created:")
    for size in sizes:
        print(f"  - icon-{size}.png")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("Error: PIL (Pillow) not found. Install it with:")
        print("pip install Pillow")
        print("\nAlternatively, you can generate icons manually using create-icons.html") 