from django.contrib.auth.models import User
from django.db import models


class Transaction(models.Model):
	ACTION_CHOICES = (
		('BUY', 'BUY'),
		('SELL', 'SELL'),
	)

	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
	symbol = models.CharField(max_length=16)
	action = models.CharField(max_length=4, choices=ACTION_CHOICES)
	quantity = models.PositiveIntegerField()
	price = models.DecimalField(max_digits=12, decimal_places=2)
	total = models.DecimalField(max_digits=14, decimal_places=2)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def save(self, *args, **kwargs):
		self.total = self.quantity * self.price
		return super().save(*args, **kwargs)

	def __str__(self) -> str:
		return f"{self.user.username}:{self.action} {self.symbol} x{self.quantity}" 