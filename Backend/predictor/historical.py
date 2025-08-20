
# import yfinance as yf
# import pandas as pd
# df = yf.download("AAPL", period='35d', interval='1d')
# df = df.tail(30)
# print(df)


import yfinance as yf
import pandas as pd
from django.http import JsonResponse
from django.views import View

class HistoricalChartView(View):
    def get(self, request):
        symbol = request.GET.get('symbol')
        if not symbol:
            return JsonResponse({'error': 'Symbol required'}, status=400)
        try:
            df = yf.download(symbol, period='70d', interval='1d')

            # flatten multi-index columns if present
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = [col[0] for col in df.columns]

            df = df.tail(60)

            if df.empty:
                return JsonResponse({'error': 'No data found or rate limited by Yahoo Finance'}, status=404)

            df = df.reset_index()
            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"]).dt.strftime('%Y-%m-%d')
            else:
                return JsonResponse({'error': 'No Date column in data'}, status=500)

            records = df[["Date", "Open", "High", "Low", "Close"]].to_dict(orient="records")
            return JsonResponse(records, safe=False)

        except Exception as e:
            print("❌ HistoricalChartView error:", str(e))
            return JsonResponse({'error': str(e)}, status=500)