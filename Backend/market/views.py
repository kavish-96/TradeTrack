from rest_framework import permissions, views, generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from .serializers import QuoteRequestSerializer, HistoryRequestSerializer
from .services import get_simple_quote_cached, get_company_overview_cached, search_symbol, fetch_time_series, AlphaRateLimited
from watchlist.models import WatchlistItem
from watchlist.serializers import WatchlistItemSerializer


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