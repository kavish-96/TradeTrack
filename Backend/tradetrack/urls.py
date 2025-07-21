from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet, PortfolioViewSet, UserDashboardView, UserStocksView
from .views import HistoricalPriceListView

router = DefaultRouter()
router.register(r'stocks', StockViewSet, basename='stocks')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path("stocks/", UserStocksView.as_view(), name="user-stocks"),
    path('historical/', HistoricalPriceListView.as_view(), name='historical-prices'),
]