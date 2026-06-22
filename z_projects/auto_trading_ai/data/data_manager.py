import pandas as pd
import numpy as np
from kiteconnect import KiteConnect
import asyncio
import websockets
import redis
from datetime import datetime, timedelta

class DataManager:
    def __init__(self):
        self.kite = KiteConnect(api_key="your_api_key")
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        
    async def collect_live_data(self, instruments):
        """Collect real-time OHLCV data with WebSocket"""
        async with websockets.connect("wss://ws.kite.trade/") as websocket:
            for instrument in instruments:
                # Subscribe to live ticks
                await websocket.send(f"subscribe:{instrument}")
                
    def get_historical_data(self, symbol, days=365):
        """Fetch historical data for backtesting"""
        to_date = datetime.now()
        from_date = to_date - timedelta(days=days)
        
        data = self.kite.historical_data(
            instrument_token=symbol,
            from_date=from_date,
            to_date=to_date,
            interval="minute"
        )
        
        df = pd.DataFrame(data)
        return self.clean_data(df)
    
    def clean_data(self, df):
        """Clean and structure market data"""
        df['timestamp'] = pd.to_datetime(df['date'])
        df = df.dropna()
        df = df.sort_values('timestamp')
        return df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]