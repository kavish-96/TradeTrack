from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Transaction
		fields = ['id', 'symbol', 'action', 'quantity', 'price', 'total', 'created_at']
		read_only_fields = ['total', 'created_at'] 