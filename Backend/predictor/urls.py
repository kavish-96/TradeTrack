from django.urls import path
from .views import PredictView, RetrainView, ModelExistsView
from .historical import HistoricalChartView

urlpatterns = [
    path("predict/", PredictView.as_view(), name="predict"),
    path("retrain/", RetrainView.as_view(), name="retrain"),
    path("exists/", ModelExistsView.as_view(), name="model-exists"),
    path("historical/", HistoricalChartView.as_view(), name="historical"),
]