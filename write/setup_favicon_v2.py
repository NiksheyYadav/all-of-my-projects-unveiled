import os
import shutil
import subprocess
import sys

# Do not import PIL here to avoid crash if not installed

def install_pillow():
    print("Checking/Installing Pillow...")
    try:
        import PIL
        print("Pillow is already installed.")
    except ImportError:
        print("Installing Pillow...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            print("Pillow installed.")
        except Exception as e:
            print(f"Failed to install Pillow: {e}")

def setup_assets():
    assets_dir = "assets"
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        print(f"Created directory: {assets_dir}")
    else:
        print(f"Directory exists: {assets_dir}")

def copy_logo():
    source = r"C:\Users\IQBAL SINGH\.gemini\antigravity\brain\57ae0c2e-a29f-4d86-b289-5142ac6ac76e\research_writer_logo_1764173261935.png"
    target = "assets/logo.png"
    
    if os.path.exists(source):
        shutil.copy2(source, target)
        print(f"Copied logo to {target}")
    else:
        # Try to find it in the artifacts dir if the path is slightly different
        base_dir = r"C:\Users\IQBAL SINGH\.gemini\antigravity\brain\57ae0c2e-a29f-4d86-b289-5142ac6ac76e"
        found = False
        if os.path.exists(base_dir):
            for file in os.listdir(base_dir):
                if file.startswith("research_writer_logo") and file.endswith(".png"):
                    source = os.path.join(base_dir, file)
                    shutil.copy2(source, target)
                    print(f"Found and copied logo from {source}")
                    found = True
                    break
        if not found:
            print(f"Could not find logo file at {source} or in {base_dir}")

def create_favicon():
    input_path = "assets/logo.png"
    output_path = "favicon.ico"
    
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        return

    try:
        from PIL import Image
        img = Image.open(input_path)
        img.save(output_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Successfully created favicon at {output_path}")
        
        png_path = output_path.replace('.ico', '.png')
        img.save(png_path, format='PNG')
        print(f"Successfully created png icon at {png_path}")
    except ImportError:
        print("PIL not installed even after attempt.")
    except Exception as e:
        print(f"Error creating favicon: {e}")

if __name__ == "__main__":
    setup_assets()
    copy_logo()
    install_pillow()
    create_favicon()
