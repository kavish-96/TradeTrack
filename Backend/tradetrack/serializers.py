from rest_framework import serializers
from .models import Stock, Portfolio, HistoricalPrice
from django.contrib.auth.models import User

# ✅ Stock Serializer
class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'symbol', 'name', 'price', 'user']
        read_only_fields = ['name', 'price', 'user']


# ✅ Portfolio Serializer
class PortfolioSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)  # Nested serializer
    symbol = serializers.CharField(write_only=True)  # Input symbol when creating

    class Meta:
        model = Portfolio
        fields = ['id', 'stock', 'symbol', 'quantity']

    def create(self, validated_data):
        request = self.context['request']
        symbol = validated_data.pop('symbol').upper()
        quantity = validated_data.pop('quantity')

        try:
            stock = Stock.objects.get(symbol=symbol, user=request.user)
        except Stock.DoesNotExist:
            raise serializers.ValidationError({'symbol': 'Stock not found in your watchlist.'})

        return Portfolio.objects.create(
            stock=stock,
            user=request.user,
            quantity=quantity
        )


# ✅ Historical Price Serializer
class HistoricalPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalPrice
        fields = '__all__'


# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
