from django.urls import path
from .views import QuoteView, HistoryView

urlpatterns = [
    path('quote/', QuoteView.as_view(), name='quote'),
    path('history/', HistoryView.as_view(), name='history'),
] 