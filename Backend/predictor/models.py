from django.db import models

# Create your models here.

class StockModelInfo(models.Model):
	symbol = models.CharField(max_length=20, unique=True)
	model_file = models.CharField(max_length=255)
	scaler_file = models.CharField(max_length=255)
	last_trained = models.DateTimeField(auto_now=True)
	notes = models.TextField(blank=True, null=True)

	def __str__(self):
		return f"{self.symbol} model info"
