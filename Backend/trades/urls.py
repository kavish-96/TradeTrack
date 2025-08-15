from django.urls import path
from .views import TransactionListCreateView

urlpatterns = [
	path('', TransactionListCreateView.as_view(), name='transactions_list_create'),
] 