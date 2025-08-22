# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from django.contrib.auth.models import User
# from django.core.mail import send_mail
# from django.conf import settings
# from django.template.loader import render_to_string
# from django.utils.html import strip_tags
# from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, PasswordResetVerifySerializer
# from .models import PasswordResetToken


# class RegisterView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = RegisterSerializer


# class MeView(generics.RetrieveUpdateAPIView):
#     serializer_class = UserSerializer

#     def get_object(self):
#         return self.request.user

#     def get_permissions(self):
#         return [permissions.IsAuthenticated()]


# class UpdateProfileView(generics.UpdateAPIView):
#     serializer_class = ProfileSerializer

#     def get_object(self):
#         return self.request.user.profile

#     def get_permissions(self):
#         return [permissions.IsAuthenticated()]


# class PasswordResetRequestView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = PasswordResetRequestSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token = PasswordResetToken.create_for_user(user)
        
#         # Create HTML email content
#         html_message = render_to_string('accounts/password_reset_email.html', {
#             'user': user,
#             'code': token.code,
#             'expiry_minutes': 10
#         })
        
#         # Create plain text version
#         plain_message = strip_tags(html_message)
        
#         subject = 'TradeTrack - Password Reset Code'
#         from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@tradetrack.local')
        
#         try:
#             # Send email
#             send_mail(
#                 subject=subject,
#                 message=plain_message,
#                 from_email=from_email,
#                 recipient_list=[user.email],
#                 html_message=html_message,
#                 fail_silently=False
#             )
            
#             # Log success (for debugging)
#             print(f"Password reset code {token.code} sent to {user.email}")
            
#             return Response({
#                 'detail': 'Password reset code sent to your email address',
#                 'email': user.email
#             }, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             print(f"Failed to send email: {str(e)}")
#             # Still return success to user but log the error
#             return Response({
#                 'detail': 'Password reset code generated. Check console for code.',
#                 'email': user.email,
#                 'code': token.code  # Include code in response for development
#             }, status=status.HTTP_200_OK)


# class PasswordResetVerifyView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = PasswordResetVerifySerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response({'detail': 'Code verified'}, status=status.HTTP_200_OK)


# class PasswordResetConfirmView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = PasswordResetConfirmSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({'detail': 'Password has been reset'}, status=status.HTTP_200_OK) 


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
        # DEV: Print code to console and return in response
        print(f"Password reset code for {user.email}: {token.code}")
        return Response({
            'detail': 'Password reset code generated. Check backend console for code.',
            'email': user.email,
            'code': token.code
        }, status=status.HTTP_200_OK)


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