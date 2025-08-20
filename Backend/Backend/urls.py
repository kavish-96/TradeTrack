"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def api_status(request):
    """Simple root view to show API status"""
    return JsonResponse({
        'status': 'TradeTrack API is running!',
        'endpoints': {
            'auth': {
                'login': '/api/auth/token/',
                'refresh': '/api/auth/token/refresh/',
            },
            'accounts': {
                'register': '/api/accounts/register/',
                'profile': '/api/accounts/me/',
            },
            'market': {
                'quote': '/api/market/quote/?symbol=AAPL',
                'history': '/api/market/history/?symbol=AAPL&interval=daily',
            },
            'portfolio': {
                'positions': '/api/portfolio/positions/',
            },
            'watchlist': {
                'items': '/api/watchlist/',
            },
            'trades': {
                'transactions': '/api/trades/',
            },
        },
        'docs': 'Use these endpoints with your frontend. All except auth/market require JWT token in Authorization header.',
    })

urlpatterns = [
    path('', api_status, name='api_status'),
    path('admin/', admin.site.urls),
    # Auth (JWT)
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # App routes
    path('api/accounts/', include('accounts.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/watchlist/', include('watchlist.urls')),
    path('api/trades/', include('trades.urls')),
    path('api/market/', include('market.urls')),
    path("api/predictor/", include("predictor.urls")),
    # Predictor ML endpoints
    path('api/predictor/predict/', __import__('predictor.views').views.PredictView.as_view()),
    path('api/predictor/retrain/', __import__('predictor.views').views.RetrainView.as_view()),
    path('api/predictor/model_exists/', __import__('predictor.views').views.ModelExistsView.as_view()),
]
