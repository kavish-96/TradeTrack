from django.urls import path
from .views import RegisterView, MeView, UpdateProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('profile/', UpdateProfileView.as_view(), name='update_profile'),
] 