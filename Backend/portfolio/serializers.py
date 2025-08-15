from rest_framework import serializers
from .models import Position


class PositionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Position
		fields = ['id', 'symbol', 'name', 'quantity', 'purchase_price', 'created_at'] 