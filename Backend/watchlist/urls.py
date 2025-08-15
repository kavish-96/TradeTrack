from django.urls import path
from .views import WatchlistListCreateView, WatchlistDeleteView

urlpatterns = [
	path('', WatchlistListCreateView.as_view(), name='watchlist_list_create'),
	path('<int:pk>/', WatchlistDeleteView.as_view(), name='watchlist_delete'),
] 