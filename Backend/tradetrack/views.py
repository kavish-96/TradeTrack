from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import Stock, Portfolio, HistoricalPrice
from .serializers import StockSerializer, PortfolioSerializer, HistoricalPriceSerializer
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .utils import get_stock_price_and_name
from .utils import fetch_and_store_historical_data


class HistoricalPriceListView(generics.ListAPIView):
    serializer_class = HistoricalPriceSerializer

    def get_queryset(self):
        symbol = self.request.query_params.get('symbol')
        if symbol:
            return HistoricalPrice.objects.filter(symbol=symbol.upper()).order_by('-date')
        return HistoricalPrice.objects.none()
    


class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Welcome {request.user.username}! This is your dashboard."})

class StockListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Your existing logic
        return Response({...})


# class StockViewSet(viewsets.ModelViewSet):
#     serializer_class = StockSerializer
#     # permission_classes = [IsAuthenticated]
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         symbol = self.request.data.get("symbol", "").upper()
#         stock_data = get_stock_price_and_name(symbol)

#         if not stock_data:
#             raise ValueError("Invalid stock symbol or API error")

#         serializer.save(
#             user=self.request.user,
#             name=stock_data["name"],
#             price=stock_data["price"]
#         )

#     def get_queryset(self):
#         return Stock.objects.filter(user=self.request.user)

#     @action(detail=True, methods=['get'])
#     def history(self, request, pk=None):
#         stock = self.get_object()
#         history = HistoricalPrice.objects.filter(stock=stock).order_by('date')
#         serializer = HistoricalPriceSerializer(history, many=True)
#         return Response(serializer.data)
    
#     def create(self, request, *args, **kwargs):
#         user = request.user
#         symbol = request.data.get("symbol")

#         if not symbol:
#             return Response({"detail": "Stock symbol is required."}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch name and price from API
#         stock_data = get_stock_price_and_name(symbol)
#         if not stock_data:
#             return Response({"detail": "Invalid stock symbol or data not found."}, status=status.HTTP_400_BAD_REQUEST)

#         stock = Stock.objects.create(
#             user=user,
#             symbol=symbol.upper(),
#             name=stock_data["name"],
#             price=stock_data["price"]
#         )

#         serializer = self.get_serializer(stock)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        symbol = request.data.get("symbol")

        # 💡 Validate symbol with API
        stock_data = get_stock_price_and_name(symbol)

        if not stock_data:
            return Response(
                {"error": "Invalid symbol or API error."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Save using correct fields
        stock = Stock.objects.create(
            symbol=symbol.upper(),
            name=stock_data["name"],
            price=stock_data["price"],
            user=request.user
        )

        serializer = StockSerializer(stock)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        stock = serializer.save(user=self.request.user)
        fetch_and_store_historical_data(stock)


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        portfolio = serializer.save(user=self.request.user)

        # ✅ Fetch historical data after saving the portfolio
        if portfolio.stock:
            fetch_and_store_historical_data(portfolio.stock)


class UserStocksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stocks = Stock.objects.filter(user=request.user)
        serializer = StockSerializer(stocks, many=True)
        return Response(serializer.data)

    def post(self, request):
        symbol = request.data.get("symbol")
        if not symbol:
            return Response({"error": "Stock symbol required."}, status=400)

        # Auto fetch name and price
        name, price = get_stock_price_and_name(symbol)
        if not price:
            return Response({"error": "Invalid stock symbol."}, status=400)

        stock = Stock.objects.create(user=request.user, symbol=symbol.upper(), name=name, price=price)
        return Response(StockSerializer(stock).data, status=201)

    def delete(self, request):
        symbol = request.data.get("symbol")
        try:
            stock = Stock.objects.get(user=request.user, symbol=symbol.upper())
            stock.delete()
            return Response({"message": f"Removed stock {symbol}"})
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found."}, status=404)
