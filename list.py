import requests
import json
import time

server_url = 'https://api.upbit.com'

def get_market_list():
    try:
        url = server_url + '/v1/market/all'
        headers = {"Accept": "application/json"}

        res = requests.get(url, headers=headers)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching market list: {e}")
        return []

def get_ticker(markets):
    try:
        url = server_url + '/v1/ticker'
        headers = {"Accept": "application/json"}
        params = {'markets': ','.join(markets)}

        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching ticker: {e}")
        return []

def get_market_with_price():
    market_list = get_market_list()

    krw_markets = [market['market'] for market in market_list if market['market'].startswith('KRW-')]

    ticker_info = get_ticker(krw_markets)

    market_info = {market['market']: market for market in market_list}

    result = []
    for ticker in ticker_info:
        market_code = ticker['market']
        market = market_info.get(market_code, {})
        name = market.get('korean_name', 'Unknown')
        english_name = market.get('english_name', 'Unknown')
        price = ticker.get('trade_price', 0)
        result.append({'name': name, 'english_name': english_name, 'market_code': market_code, 'price': price})

    result_sorted = sorted(result, key=lambda x: x['name'])

    return result_sorted

if __name__ == '__main__':
    try:
        while True:
            market_with_price = get_market_with_price()
            print(json.dumps(market_with_price, ensure_ascii=True, indent=4))
            time.sleep(5)  # 5초마다 갱신
    except Exception as e:
        print(f"Error in main: {e}")
