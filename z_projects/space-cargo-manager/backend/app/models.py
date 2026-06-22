from pydantic import BaseModel
from typing import Optional, List

class Coordinates(BaseModel):
    width: float
    depth: float
    height: float

class Position(BaseModel):
    startCoordinates: Coordinates
    endCoordinates: Coordinates

class Item(BaseModel):
    itemId: str
    name: str
    width: float
    depth: float
    height: float
    mass: float
    priority: int
    expiryDate: Optional[str] = None
    usageLimit: Optional[int] = None
    preferredZone: Optional[str] = None

class Container(BaseModel):
    containerId: str
    zone: str
    width: float
    depth: float
    height: float

class PlacementRequest(BaseModel):
    items: List[Item]
    containers: List[Container]