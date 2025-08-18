from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, PasswordResetVerifySerializer
from .models import PasswordResetToken


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def get_permissions(self):
        return [permissions.IsAuthenticated()]


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = PasswordResetToken.create_for_user(user)
        subject = 'Your TradeTrack password reset code'
        message = f'Your password reset code is: {token.code}. It expires in 10 minutes.'
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@tradetrack.local')
        send_mail(subject, message, from_email, [user.email], fail_silently=False)
        return Response({'detail': 'Reset code sent to email'}, status=status.HTTP_200_OK)


class PasswordResetVerifyView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'detail': 'Code verified'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password has been reset'}, status=status.HTTP_200_OK) 