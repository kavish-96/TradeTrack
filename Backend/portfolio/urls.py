from django.urls import path
from .views import PositionListCreateView, PositionDetailView

urlpatterns = [
	path('positions/', PositionListCreateView.as_view(), name='positions_list_create'),
	path('positions/<int:pk>/', PositionDetailView.as_view(), name='position_detail'),
] 