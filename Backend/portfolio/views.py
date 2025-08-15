from rest_framework import generics, permissions
from .models import Position
from .serializers import PositionSerializer


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