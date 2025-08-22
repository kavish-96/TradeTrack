from rest_framework import permissions, views, generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from .serializers import QuoteRequestSerializer, HistoryRequestSerializer
from .services import (
    get_simple_quote_cached,
    get_company_overview_cached,
    search_symbol,
    fetch_time_series,
    AlphaRateLimited,
)
from watchlist.models import WatchlistItem
from watchlist.serializers import WatchlistItemSerializer

import yfinance as yf


# ✅ Friendly names mapping
INDEX_NAMES = {
    "^NSEI": "Nifty 50",
    "^IXIC": "NASDAQ",
    "^GSPC": "S&P 500",
}


# Market indices via yfinance
class MarketIndicesYFView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        symbols = request.query_params.getlist("symbols")
        if not symbols:
            symbols = ["^NSEI", "^IXIC", "^GSPC"]

        result = []
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)

                # fetch last 5 days of history (safe for weekends/holidays)
                hist = ticker.history(period="5d")
                if hist.empty or len(hist) < 2:
                    result.append({"symbol": symbol, "error": "Not enough data"})
                    continue

                latest = hist["Close"].iloc[-1]
                prev_close = hist["Close"].iloc[-2]

                change = latest - prev_close
                change_percent = (change / prev_close) * 100 if prev_close else 0

                result.append({
                    "symbol": symbol,
                    "name": INDEX_NAMES.get(symbol, symbol),  # 👈 friendly name
                    "price": float(latest),
                    "previous_close": float(prev_close),
                    "change": float(change),
                    "change_percent": float(change_percent),
                })

            except Exception as e:
                result.append({"symbol": symbol, "error": str(e)})

        return Response(result)


class QuoteView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = QuoteRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        symbol = serializer.validated_data['symbol']
        try:
            data = get_simple_quote_cached(symbol)
            return Response({'Global Quote': {'05. price': data['price'], '08. previous close': data['previous_close'], '09. change': data['change'], '10. change percent': data['change_percent']}})
        except AlphaRateLimited as e:
            return Response({'detail': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)


class HistoryView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = HistoryRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data
        data = fetch_time_series(v['symbol'], v['interval'], v['outputsize'])
        return Response(data)


class AddToWatchlistView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request):
        symbol = request.data.get('symbol', '').upper().strip()
        if not symbol:
            return Response({'symbol': 'Symbol is required'}, status=status.HTTP_400_BAD_REQUEST)
        data = search_symbol(symbol)
        matches = data.get('bestMatches', [])
        if not matches:
            return Response({'symbol': 'No such symbol found'}, status=status.HTTP_404_NOT_FOUND)
        best = matches[0]
        resolved_symbol = best.get('1. symbol', symbol).upper()
        name = best.get('2. name', '')
        item, created = WatchlistItem.objects.get_or_create(user=request.user, symbol=resolved_symbol, defaults={'name': name})
        serializer = WatchlistItemSerializer(instance=item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class SimpleQuoteView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = QuoteRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        symbol = serializer.validated_data['symbol']
        try:
            data = get_simple_quote_cached(symbol)
            return Response(data)
        except AlphaRateLimited as e:
            return Response({'detail': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)


class CompanyOverviewView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = QuoteRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        symbol = serializer.validated_data['symbol']
        try:
            data = get_company_overview_cached(symbol)
            return Response(data)
        except AlphaRateLimited as e:
            return Response({'detail': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS) 