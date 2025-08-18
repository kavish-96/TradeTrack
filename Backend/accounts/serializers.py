from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from .models import Profile, PasswordResetToken


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['two_factor_enabled']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    two_factor_enabled = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'two_factor_enabled']

    def validate_username(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Username is required')
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Username already taken')
        return value

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError('Invalid email address')
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email already registered')
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError([str(m) for m in e.messages])
        return value

    def create(self, validated_data):
        two_factor_enabled = validated_data.pop('two_factor_enabled', False)
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, two_factor_enabled=two_factor_enabled)
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs['email']
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'No user with this email'})
        attrs['user'] = user
        return attrs


class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs['email']
        code = attrs['code']
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'No user with this email'})
        try:
            token = PasswordResetToken.objects.filter(user=user, code=code).latest('created_at')
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({'code': 'Invalid code'})
        if not token.is_valid():
            raise serializers.ValidationError({'code': 'Expired or used code'})
        attrs['user'] = user
        attrs['token'] = token
        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email']
        code = attrs['code']
        new_password = attrs['new_password']
        try:
            validate_password(new_password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'new_password': [str(m) for m in e.messages]})
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'No user with this email'})
        try:
            token = PasswordResetToken.objects.filter(user=user, code=code).latest('created_at')
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({'code': 'Invalid code'})
        if not token.is_valid():
            raise serializers.ValidationError({'code': 'Expired or used code'})
        attrs['user'] = user
        attrs['token'] = token
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        token = self.validated_data['token']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        token.used = True
        token.save(update_fields=['used'])
        return user 