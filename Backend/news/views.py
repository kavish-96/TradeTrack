import os
import requests
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

FINNHUB_API_KEY = getattr(settings, "FINNHUB_API_KEY", os.getenv("FINNHUB_API_KEY"))

@csrf_exempt
def latest_news(request):
    """
    Fetch latest stock/market news from Finnhub for a given category.
    Supported categories: general, forex, crypto, merger
    """
    category = request.GET.get("category", "general").lower()

    # Ensure valid category
    valid_categories = ["general", "forex", "crypto", "merger"]
    if category not in valid_categories:
        category = "general"

    url = "https://finnhub.io/api/v1/news"
    params = {
        "category": category,
        "token": FINNHUB_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        formatted_news = []
        for i, item in enumerate(data[:20]):  # limit to 20
            formatted_news.append({
                "id": i + 1,
                "headline": item.get("headline"),
                "source": item.get("source"),
                "timestamp": item.get("datetime"),
                "summary": item.get("summary"),
                "category": category.capitalize(),
                "url": item.get("url"),
                "image": item.get("image"),
                # Breaking news: only mark top 3 IF total articles > 3
                "isBreaking": True if (i < 3 and len(data) > 3) else False,
            })

        return JsonResponse({"news": formatted_news}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
