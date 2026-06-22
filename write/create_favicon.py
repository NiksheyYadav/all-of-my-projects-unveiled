from PIL import Image
import os

def create_favicon(input_path, output_path):
    try:
        img = Image.open(input_path)
        # Save as ICO with multiple sizes
        img.save(output_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Successfully created favicon at {output_path}")
        
        # Also save a PNG version for other uses
        png_path = output_path.replace('.ico', '.png')
        img.save(png_path, format='PNG')
        print(f"Successfully created png icon at {png_path}")
        
    except Exception as e:
        print(f"Error creating favicon: {e}")

if __name__ == "__main__":
    # Input path - using the one we know exists or will exist
    input_logo = "assets/logo.png"
    output_favicon = "favicon.ico"
    
    if os.path.exists(input_logo):
        create_favicon(input_logo, output_favicon)
    else:
        print(f"Input file not found: {input_logo}")
