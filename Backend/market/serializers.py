from rest_framework import serializers


class QuoteRequestSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=16)


class HistoryRequestSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=16)
    interval = serializers.ChoiceField(choices=['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly'], default='daily')
    outputsize = serializers.ChoiceField(choices=['compact', 'full'], default='compact') 