from django.urls import path
from .views import QuoteView, HistoryView, AddToWatchlistView, SimpleQuoteView, CompanyOverviewView, MarketIndicesYFView

urlpatterns = [
    path('quote/', QuoteView.as_view(), name='quote'),
    path('history/', HistoryView.as_view(), name='history'),
    path('add-to-watchlist/', AddToWatchlistView.as_view(), name='add_to_watchlist'),
    path('simple-quote/', SimpleQuoteView.as_view(), name='simple_quote'),
    path('overview/', CompanyOverviewView.as_view(), name='company_overview'),
    path('market-indices/', MarketIndicesYFView.as_view(), name='market_indices_yf'),
] 