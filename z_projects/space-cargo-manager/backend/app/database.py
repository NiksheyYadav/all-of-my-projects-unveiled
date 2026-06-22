import sqlite3
from typing import Dict, List, Optional
from datetime import datetime
from .models import Item, Container, Position, Coordinates
import logging
logger = logging.getLogger(__name__)

class LogEntry:
    def __init__(self, timestamp: str, userId: str, actionType: str, itemId: str, details: dict):
        self.timestamp = timestamp
        self.userId = userId
        self.actionType = actionType
        self.itemId = itemId
        self.details = details

class Database:
    def __init__(self):
        try:
            self.conn = sqlite3.connect("space_cargo.db")
            self.create_tables()
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {str(e)}")
            raise RuntimeError(f"Failed to initialize database: {str(e)}")

        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS items (
                    itemId TEXT PRIMARY KEY,
                    name TEXT,
                    width REAL,
                    depth REAL,
                    height REAL,
                    mass REAL,
                    priority INTEGER,
                    expiryDate TEXT,
                    usageLimit INTEGER,
                    preferredZone TEXT,
                    containerId TEXT,
                    position_start_width REAL,
                    position_start_depth REAL,
                    position_start_height REAL,
                    position_end_width REAL,
                    position_end_depth REAL,
                    position_end_height REAL
                )
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS containers (
                    containerId TEXT PRIMARY KEY,
                    zone TEXT,
                    width REAL,
                    depth REAL,
                    height REAL
                )
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS logs (
                    timestamp TEXT,
                    userId TEXT,
                    actionType TEXT,
                    itemId TEXT,
                    details TEXT
                )
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS orbital_paths (
                    timestamp TEXT,
                    latitude REAL,
                    longitude REAL,
                    altitude REAL
                )
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    userId TEXT PRIMARY KEY,
                    role TEXT
                )
            """)

    def add_container(self, container: Container):
        with self.conn:
            self.conn.execute("""
                INSERT OR REPLACE INTO containers (containerId, zone, width, depth, height)
                VALUES (?, ?, ?, ?, ?)
            """, (container.containerId, container.zone, container.width, container.depth, container.height))

    def place_item(self, item: Item, container_id: Optional[str] = None, position: Optional[Position] = None, userId: str = "system"):
        if position is None:
            # Create default position with zero coordinates
            position = Position(
                startCoordinates=Coordinates(width=0, depth=0, height=0),
                endCoordinates=Coordinates(width=item.width, depth=item.depth, height=item.height)
            )
        
        with self.conn:
            self.conn.execute("""
                INSERT OR REPLACE INTO items (
                    itemId, name, width, depth, height, mass, priority, expiryDate, usageLimit, preferredZone,
                    containerId, position_start_width, position_start_depth, position_start_height,
                    position_end_width, position_end_depth, position_end_height
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.itemId, item.name, item.width, item.depth, item.height, item.mass, item.priority,
                item.expiryDate, item.usageLimit, item.preferredZone, container_id,
                position.startCoordinates.width, position.startCoordinates.depth, position.startCoordinates.height,
                position.endCoordinates.width, position.endCoordinates.depth, position.endCoordinates.height
            ))
            self.log_action(
                timestamp=datetime.utcnow().isoformat(),
                userId=userId,
                actionType="placement",
                itemId=item.itemId,
                details={
                    "containerId": container_id,
                    "position": position.dict()
                }
            )

    def get_item(self, itemId: str) -> Optional[tuple[Item, str, Position]]:
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM items WHERE itemId = ?
        """, (itemId,))
        row = cursor.fetchone()
        if not row:
            return None
        item = Item(
            itemId=row[0],
            name=row[1],
            width=row[2],
            depth=row[3],
            height=row[4],
            mass=row[5],
            priority=row[6],
            expiryDate=row[7],
            usageLimit=row[8],
            preferredZone=row[9]
        )
        container_id = row[10]
        position = Position(
            startCoordinates=Coordinates(width=row[11], depth=row[12], height=row[13]),
            endCoordinates=Coordinates(width=row[14], depth=row[15], height=row[16])
        )
        return item, container_id, position

    def add_containers(self, containers: List[Container]):
        for container in containers:
            self.add_container(container)

    def log_action(self, timestamp: str, userId: str, actionType: str, itemId: str, details: dict):
        with self.conn:
            self.conn.execute("""
                INSERT INTO logs (timestamp, userId, actionType, itemId, details)
                VALUES (?, ?, ?, ?, ?)
            """, (timestamp, userId, actionType, itemId, str(details)))

    def get_logs(self, startDate: Optional[str] = None, endDate: Optional[str] = None, 
                 itemId: Optional[str] = None, userId: Optional[str] = None, 
                 actionType: Optional[str] = None) -> List[dict]:
        query = "SELECT * FROM logs WHERE 1=1"
        params = []
        if startDate:
            query += " AND timestamp >= ?"
            params.append(startDate)
        if endDate:
            query += " AND timestamp <= ?"
            params.append(endDate)
        if itemId:
            query += " AND itemId = ?"
            params.append(itemId)
        if userId:
            query += " AND userId = ?"
            params.append(userId)
        if actionType:
            query += " AND actionType = ?"
            params.append(actionType)
        cursor = self.conn.cursor()
        cursor.execute(query, params)
        logs = []
        for row in cursor.fetchall():
            logs.append({
                "timestamp": row[0],
                "userId": row[1],
                "actionType": row[2],
                "itemId": row[3],
                "details": eval(row[4])  # Convert string back to dict (use json.loads for better safety)
            })
        return logs

    def retrieve_item(self, itemId: str, userId: str, timestamp: str):
        item_data = self.get_item(itemId)
        if not item_data:
            return False
        item, container_id, position = item_data
        # Decrement usage limit
        if item.usageLimit is not None:
            item.usageLimit -= 1
            with self.conn:
                self.conn.execute("""
                    UPDATE items SET usageLimit = ? WHERE itemId = ?
                """, (item.usageLimit, itemId))
            if item.usageLimit <= 0:
                self.log_action(
                    timestamp=timestamp,
                    userId=userId,
                    actionType="waste",
                    itemId=itemId,
                    details={"reason": "Out of Uses"}
                )
        # Log the retrieval
        self.log_action(
            timestamp=timestamp,
            userId=userId,
            actionType="retrieval",
            itemId=itemId,
            details={"containerId": container_id}
        )
        return True

    def identify_waste(self, current_date: str):
        cursor = self.conn.cursor()
        cursor.execute("SELECT itemId, containerId, position_start_width, position_start_depth, position_start_height, position_end_width, position_end_depth, position_end_height, expiryDate, usageLimit FROM items")
        waste_items = []
        for row in cursor.fetchall():
            itemId, container_id, start_width, start_depth, start_height, end_width, end_depth, end_height, expiryDate, usageLimit = row
            is_waste = False
            reason = []
            if expiryDate and expiryDate < current_date:
                is_waste = True
                reason.append("Expired")
            if usageLimit is not None and usageLimit <= 0:
                is_waste = True
                reason.append("Out of Uses")
            if is_waste:
                position = Position(
                    startCoordinates=Coordinates(width=start_width, depth=start_depth, height=start_height),
                    endCoordinates=Coordinates(width=end_width, depth=end_depth, height=end_height)
                )
                waste_items.append({
                    "itemId": itemId,
                    "containerId": container_id,
                    "position": position.dict(),
                    "reason": reason
                })
        return waste_items

    def generate_return_plan(self, maxWeight: float, undockingContainerId: str):
        waste_items = self.identify_waste("2025-03-23")
        total_weight = 0.0
        items_to_move = []
        for waste in waste_items:
            item_data = self.get_item(waste["itemId"])
            if not item_data:
                continue
            item, _, _ = item_data
            if total_weight + item.mass <= maxWeight:
                total_weight += item.mass
                items_to_move.append(waste["itemId"])
        return {
            "undockingContainerId": undockingContainerId,
            "items": items_to_move,
            "totalWeight": total_weight
        }

    def complete_undocking(self, itemIds: list, userId: str, timestamp: str):
        for itemId in itemIds:
            with self.conn:
                self.conn.execute("DELETE FROM items WHERE itemId = ?", (itemId,))
                self.log_action(
                    timestamp=timestamp,
                    userId=userId,
                    actionType="undocking",
                    itemId=itemId,
                    details={}
                )
        return True

    def simulate_day(self, current_date: str, userId: str):
        cursor = self.conn.cursor()
        cursor.execute("SELECT itemId, usageLimit FROM items")
        for row in cursor.fetchall():
            itemId, usageLimit = row
            if usageLimit is not None and usageLimit > 0:
                new_usage_limit = usageLimit - 1
                with self.conn:
                    self.conn.execute("UPDATE items SET usageLimit = ? WHERE itemId = ?", (new_usage_limit, itemId))
                self.log_action(
                    timestamp=current_date,
                    userId=userId,
                    actionType="usage",
                    itemId=itemId,
                    details={"remainingUses": new_usage_limit}
                )
                if new_usage_limit <= 0:
                    self.log_action(
                        timestamp=current_date,
                        userId=userId,
                        actionType="waste",
                        itemId=itemId,
                        details={"reason": "Out of Uses"}
                    )

    def add_orbital_path(self, timestamp: str, latitude: float, longitude: float, altitude: float):
        with self.conn:
            self.conn.execute("""
                INSERT INTO orbital_paths (timestamp, latitude, longitude, altitude)
                VALUES (?, ?, ?, ?)
            """, (timestamp, latitude, longitude, altitude))

    def get_orbital_paths(self) -> List[Dict[str, float]]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM orbital_paths")
        return [{"timestamp": row[0], "latitude": row[1], "longitude": row[2], "altitude": row[3]} for row in cursor.fetchall()]

db = Database()