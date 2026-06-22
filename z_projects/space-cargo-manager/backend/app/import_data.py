import csv
import os
from .database import db
from .models import Item, Container, Position, Coordinates  # Add Position and Coordinates

def get_data_path(filename: str) -> str:
    """Get the correct path for data files in both development and Docker environments."""
    if os.getenv("ENV") == "docker":
        return f"/app/data/{filename}"
    return os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), filename)

def import_containers(file_path: str = None):
    if file_path is None:
        file_path = get_data_path("containers.csv")
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        containers = []
        for row in reader:
            container = Container(
                containerId=row['containerId'],
                zone=row['zone'],
                width=float(row['width']),
                depth=float(row['depth']),
                height=float(row['height'])
            )
            containers.append(container)
        db.add_containers(containers)
        print(f"Imported {len(containers)} containers from {file_path}")

def import_items(file_path: str = None):
    if file_path is None:
        file_path = get_data_path("items.csv")
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        items = []
        for row in reader:
            item = Item(
                itemId=row['itemId'],
                name=row['name'],
                width=float(row['width']),
                depth=float(row['depth']),
                height=float(row['height']),
                mass=float(row['mass']),
                priority=int(row['priority']),
                expiryDate=row['expiryDate'],
                usageLimit=int(row['usageLimit']) if row['usageLimit'] else None,
                preferredZone=row['preferredZone']
            )
            position = Position(
                startCoordinates=Coordinates(width=0, depth=0, height=0),
                endCoordinates=Coordinates(
                    width=item.width,
                    depth=item.depth,
                    height=item.height
                )
            )
            db.place_item(item, None, position)  # Place item with default position
            items.append(item)
        print(f"Imported {len(items)} items from {file_path}")

def import_users(file_path: str = None):
    if file_path is None:
        file_path = get_data_path("users.csv")
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            db.conn.execute("""
                INSERT OR REPLACE INTO users (userId, role)
                VALUES (?, ?)
            """, (row['userId'], row['Role']))
        db.conn.commit()
        print(f"Imported users from {file_path}")

def import_orbital_paths(file_path: str = None):
    if file_path is None:
        file_path = get_data_path("orbital_paths.csv")
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            db.add_orbital_path(
                timestamp=row['timestamp'],
                latitude=float(row['latitude']),
                longitude=float(row['longitude']),
                altitude=float(row['altitude'])
            )
        print(f"Imported orbital paths from {file_path}")

if __name__ == "__main__":
    import_containers()
    import_items()
    import_users()
    import_orbital_paths()
