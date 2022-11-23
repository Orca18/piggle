# NowStockData.py
## 오늘 또는 최근 주식장 데이터
from pykrx import stock
from datetime import datetime, timedelta
import exchange_calendars as ecals

XKRX = ecals.get_calendar("XKRX")  # 한국 코드

stockopen = False
i = 0
r = 0

while stockopen == False:
    # 지정일 구하고
    today_forOpen = (datetime.today() - timedelta(days=i)).strftime("%Y-%m-%d")
    today_forKRX = (datetime.today() - timedelta(days=i)).strftime("%Y%m%d")
    # 오늘
    if (XKRX.is_session(today_forOpen) == False):
        stockopen = False
    else:  # 열려있는 날
        r = r + 1
        if (r == 1):
            f_today_forOpen = (datetime.today() - timedelta(days=i)).strftime("%Y-%m-%d")
            f_today_forKRX = (datetime.today() - timedelta(days=i)).strftime("%Y%m%d")
            stockopen = False
        if (r == 2):
            s_day_forKRX = (datetime.today() - timedelta(days=i)).strftime("%Y%m%d")
            stockopen = True
    i = i + 1


def getNowData(code):
    df = stock.get_market_ohlcv_by_date(s_day_forKRX, f_today_forKRX, code)

    data = {'open': str(df.at[f_today_forKRX, '시가']),
            'high': str(df.at[f_today_forKRX, '고가']),
            'low': str(df.at[f_today_forKRX, '저가']),
            'close': str(df.at[f_today_forKRX, '종가']),
            'updown': str(df.at[f_today_forKRX, '등락률']),
            'change': str(df.at[f_today_forKRX, '거래량']),
            'all': str(df.at[f_today_forKRX, '거래대금']),
            'before': str(df.at[s_day_forKRX, '종가'])} # 전일

    return data