from django.urls import path
from .views import RegisterView, MeView, UpdateProfileView, PasswordResetRequestView, PasswordResetConfirmView, PasswordResetVerifyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('profile/', UpdateProfileView.as_view(), name='update_profile'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
] 