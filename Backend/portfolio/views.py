from rest_framework import generics, permissions
from .models import Position
from .serializers import PositionSerializer

from django.utils import timezone
from datetime import timedelta

from rest_framework.response import Response
from rest_framework.views import APIView

# API endpoint for positions added in last 24 hours
class RecentPositionsView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		now = timezone.now()
		last_24h = now - timedelta(hours=24)
		positions = Position.objects.filter(user=request.user, created_at__gte=last_24h)
		serializer = PositionSerializer(positions, many=True)
		return Response(serializer.data)

class PositionListCreateView(generics.ListCreateAPIView):
	serializer_class = PositionSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Position.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class PositionDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PositionSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Position.objects.filter(user=self.request.user) 