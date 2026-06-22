from .models import Item, Container, Position, Coordinates
from .database import db
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class StorageManager:
    def __init__(self):
        pass

    def add_container(self, container: Container):
        logger.debug(f"Adding container: {container.containerId}")
        db.add_container(container)

    def add_containers(self, containers: list[Container]):
        for container in containers:
            self.add_container(container)

    def place_item(self, item: Item, container_id: str, position: Position, userId: str = "system"):
        logger.debug(f"Placing item {item.itemId} in container {container_id}")
        db.place_item(item, container_id, position, userId)

    def suggest_placement(self, item: Item, containers: list[Container]):
        # Simple logic: Find first container with enough space
        for container in containers:
            if (container.width >= item.width and 
                container.depth >= item.depth and 
                container.height >= item.height):
                return container.containerId, Position(
                    startCoordinates=Coordinates(width=0, depth=0, height=0),
                    endCoordinates=Coordinates(width=item.width, depth=item.depth, height=item.height)
                )
        return None, None  # No space found

storage = StorageManager()