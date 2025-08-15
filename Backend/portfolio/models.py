from django.contrib.auth.models import User
from django.db import models


class Position(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='positions')
	symbol = models.CharField(max_length=16)
	name = models.CharField(max_length=128, blank=True, default='')
	quantity = models.PositiveIntegerField()
	purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self) -> str:
		return f"{self.user.username}:{self.symbol} x{self.quantity}" 