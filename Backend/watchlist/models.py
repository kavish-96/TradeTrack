from django.contrib.auth.models import User
from django.db import models


class WatchlistItem(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist_items')
	symbol = models.CharField(max_length=16)
	name = models.CharField(max_length=128, blank=True, default='')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('user', 'symbol')

	def __str__(self) -> str:
		return f"{self.user.username}:{self.symbol}" 