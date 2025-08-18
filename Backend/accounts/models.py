from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Profile({self.user.username})"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self) -> bool:
        return (not self.used) and timezone.now() <= self.expires_at

    @classmethod
    def create_for_user(cls, user: User, ttl_minutes: int = 10) -> "PasswordResetToken":
        from random import randint
        code = f"{randint(0, 999999):06d}"
        token = cls.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )
        return token 