from django.db import models
from django.conf import settings

# user = User.objects.get(username='kavishpatel96')

# Stocks tracked by a user
class Stock(models.Model):
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=255, blank=True)
    price = models.FloatField(default=0.0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.symbol} ({self.user.username})"


# Portfolio entries (stocks actually bought)
class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolio')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    buying_price = models.FloatField()
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"

# Historical prices for a stock
class HistoricalPrice(models.Model):
    symbol = models.CharField(max_length=10)
    date = models.DateField()
    close_price = models.FloatField()

    class Meta:
        unique_together = ('symbol', 'date')

    def __str__(self):
        return f"{self.symbol} - {self.date}"
