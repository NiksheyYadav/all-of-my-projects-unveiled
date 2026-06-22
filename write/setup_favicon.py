import os
import shutil
import subprocess
import sys
from PIL import Image

def install_pillow():
    print("Checking/Installing Pillow...")
    try:
        import PIL
        print("Pillow is already installed.")
    except ImportError:
        print("Installing Pillow...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        print("Pillow installed.")

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
        print(f"Source logo not found at {source}")
        # Try to find it in the artifacts dir if the path is slightly different
        base_dir = r"C:\Users\IQBAL SINGH\.gemini\antigravity\brain\57ae0c2e-a29f-4d86-b289-5142ac6ac76e"
        for file in os.listdir(base_dir):
            if file.startswith("research_writer_logo") and file.endswith(".png"):
                source = os.path.join(base_dir, file)
                shutil.copy2(source, target)
                print(f"Found and copied logo from {source}")
                return
        print("Could not find logo file.")

def create_favicon():
    input_path = "assets/logo.png"
    output_path = "favicon.ico"
    
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        return

    try:
        img = Image.open(input_path)
        img.save(output_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Successfully created favicon at {output_path}")
        
        png_path = output_path.replace('.ico', '.png')
        img.save(png_path, format='PNG')
        print(f"Successfully created png icon at {png_path}")
    except Exception as e:
        print(f"Error creating favicon: {e}")

if __name__ == "__main__":
    setup_assets()
    copy_logo()
    install_pillow()
    # Re-import Image after installation if needed, but we imported at top. 
    # If it wasn't installed, the top import would fail. 
    # So we need to handle import inside the function or restart.
    # Actually, if we install it, we might need to restart the process or use importlib.
    # But let's assume it's installed or we can import it now.
    
    # We need to import PIL here if it was just installed
    try:
        from PIL import Image
        create_favicon()
    except ImportError:
        print("Pillow installed but import failed. Please run the script again.")
