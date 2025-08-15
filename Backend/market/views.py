from rest_framework import permissions, views
from rest_framework.response import Response
from rest_framework.request import Request
from .serializers import QuoteRequestSerializer, HistoryRequestSerializer
from .services import fetch_global_quote, fetch_time_series


class QuoteView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = QuoteRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        data = fetch_global_quote(serializer.validated_data['symbol'])
        return Response(data)


class HistoryView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: Request):
        serializer = HistoryRequestSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data
        data = fetch_time_series(v['symbol'], v['interval'], v['outputsize'])
        return Response(data) 