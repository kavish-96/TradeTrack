from rest_framework import generics, permissions
from .models import WatchlistItem
from .serializers import WatchlistItemSerializer


class WatchlistListCreateView(generics.ListCreateAPIView):
	serializer_class = WatchlistItemSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return WatchlistItem.objects.filter(user=self.request.user).order_by('-created_at')

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class WatchlistDeleteView(generics.DestroyAPIView):
	serializer_class = WatchlistItemSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return WatchlistItem.objects.filter(user=self.request.user) 