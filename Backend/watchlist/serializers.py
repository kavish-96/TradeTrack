from rest_framework import serializers
from .models import WatchlistItem


class WatchlistItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = WatchlistItem
		fields = ['id', 'symbol', 'name', 'created_at'] 