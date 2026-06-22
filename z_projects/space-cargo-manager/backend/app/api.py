from fastapi import FastAPI, HTTPException, APIRouter
from typing import List, Dict
from .models import PlacementRequest, Item, Container, Position, Coordinates
from .storage import storage
from .database import db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/api/placement")
async def placement(request: PlacementRequest):
    # Add containers to the database
    storage.add_containers(request.containers)
    
    placements = []
    for item in request.items:
        container_id, position = storage.suggest_placement(item, request.containers)
        if container_id:
            storage.place_item(item, container_id, position, userId="system")
            placements.append({
                "itemId": item.itemId,
                "containerId": container_id,
                "position": position.dict(),
                "rearrangements": []  # Placeholder
            })
    return {"success": True, "placements": placements}

@router.get("/api/search")
async def search(itemId: str = None, itemName: str = None):
    try:
        if not itemId and not itemName:
            raise HTTPException(status_code=400, detail="Either itemId or itemName is required")
            
        if itemId:
            item_data = db.get_item(itemId)
            if item_data:
                item, container_id, position = item_data
                return {
                    "success": True,
                    "found": True,
                    "item": {
                        "itemId": item.itemId,
                        "name": item.name,
                        "containerId": container_id,
                        "position": position.dict(),
                        "retrievalSteps": []
                    }
                }
        return {"success": True, "found": False}
    except Exception as e:
        logger.error(f"Error in search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/logs")
async def get_logs(startDate: str = None, endDate: str = None, itemId: str = None, 
                   userId: str = None, actionType: str = None):
    logs = db.get_logs(startDate, endDate, itemId, userId, actionType)
    return {"logs": logs}

@router.post("/api/retrieve")
async def retrieve(request: dict):
    itemId = request.get("itemId")
    userId = request.get("userId")
    timestamp = request.get("timestamp")
    if not all([itemId, userId, timestamp]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    success = db.retrieve_item(itemId, userId, timestamp)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True}

@router.post("/api/place")
async def place(request: dict):
    itemId = request.get("itemId")
    containerId = request.get("containerId")
    position = request.get("position")
    userId = request.get("userId")
    timestamp = request.get("timestamp")
    if not all([itemId, containerId, position, userId, timestamp]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    item_data = db.get_item(itemId)
    if not item_data:
        raise HTTPException(status_code=404, detail="Item not found")
    item, _, _ = item_data
    position_obj = Position(**position)
    storage.place_item(item, containerId, position_obj, userId)
    return {"success": True}

@router.get("/api/waste/identify")
async def identify_waste(currentDate: str):
    waste_items = db.identify_waste(currentDate)
    return {"wasteItems": waste_items}

@router.post("/api/test/populate")
async def populate_test_data():
    try:
        # Add a container
        container = Container(
            containerId="contA",
            zone="Crew Quarters",
            width=100,
            depth=85,
            height=200
        )
        storage.add_container(container)
        
        # Add an item
        item = Item(
            itemId="001",
            name="Food Packet",
            width=10,
            depth=10,
            height=20,
            mass=5,
            priority=80,
            expiryDate="2025-05-20",
            usageLimit=30,
            preferredZone="Crew Quarters"
        )
        position = Position(
            startCoordinates=Coordinates(width=0, depth=0, height=0),
            endCoordinates=Coordinates(width=10, depth=10, height=20)
        )
        storage.place_item(item, "contA", position, userId="test-user")
        
        return {"success": True, "message": "Test data populated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/waste/return-plan")
async def generate_return_plan(request: dict):
    try:
        max_weight = request.get("maxWeight")
        container_id = request.get("undockingContainerId")
        if not all([max_weight, container_id]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        return db.generate_return_plan(max_weight, container_id)
    except Exception as e:
        logger.error(f"Error generating return plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/orbital/import")
async def import_orbital_data(request: List[Dict[str, float]]):
    try:
        for data in request:
            db.add_orbital_path(data["timestamp"], data["latitude"], data["longitude"], data["altitude"])
        return {"success": True}
    except Exception as e:
        logger.error(f"Error importing orbital data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/orbital/paths")
async def get_orbital_paths():
    try:
        paths = db.get_orbital_paths()
        return paths
    except Exception as e:
        logger.error(f"Error retrieving orbital paths: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))