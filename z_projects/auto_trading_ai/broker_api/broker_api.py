# broker_api/config.py

# Primary APIs for Indian Markets
BROKER_APIS = {
    'zerodha_kite': {
        'api_key': 'your_kite_api_key',
        'access_token': 'generated_token',
        'rate_limit': '3 requests/second',
        'features': ['live_data', 'historical', 'order_execution']
    },
    'upstox': {
        'client_id': 'your_upstox_client_id',
        'rate_limit': '25 requests/second',
        'features': ['websocket_streaming', 'options_chain']
    },
    'angel_one': {
        'client_code': 'your_angel_client_code',
        'features': ['smart_api', 'historical_data']
    }
}

# Crypto Exchange APIs
CRYPTO_APIS = {
    'wazirx': 'https://api.wazirx.com/api/v2/',
    'coindcx': 'https://api.coindcx.com/',
    'binance': 'https://api.binance.com/api/v3/'
}
