
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import yfinance as yf
# import pandas as pd
# import matplotlib.pyplot as plt
# import io
# import base64
# import os
# from django.conf import settings

# from .services import build_and_train_model, predict_future, load_existing_model
# from .models import StockModelInfo


# class PredictView(APIView):
#     def get(self, request):
#         symbol = request.query_params.get("symbol")
#         days = int(request.query_params.get("days", 7))
#         if not symbol:
#             return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             result = predict_future(symbol, days=days)
#             return Response(result)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class RetrainView(APIView):
#     def post(self, request):
#         symbol = request.data.get("symbol")
#         if not symbol:
#             return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             model, scaler = build_and_train_model(symbol)
#             # Update or create DB entry
#             model_path = os.path.join(settings.BASE_DIR, "predictor", "models", f"{symbol}_model.h5")
#             scaler_path = os.path.join(settings.BASE_DIR, "predictor", "models", f"{symbol}_scaler.pkl")
#             info, created = StockModelInfo.objects.update_or_create(
#                 symbol=symbol,
#                 defaults={
#                     "model_file": model_path,
#                     "scaler_file": scaler_path,
#                 }
#             )
#             return Response({"success": True, "created": created})
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class ModelExistsView(APIView):
#     def get(self, request):
#         symbol = request.query_params.get("symbol")
#         exists = False
#         if symbol:
#             model, scaler = load_existing_model(symbol)
#             exists = model is not None
#         return Response({"exists": exists})


# class HistoricalDataView(APIView):
#     def get(self, request):
#         symbol = request.query_params.get("symbol")
#         if not symbol:
#             return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             df = yf.download(symbol, period="1mo", interval="1d")  # 30 days
#             if df.empty:
#                 return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)

#             # Ensure Date is a column
#             if not isinstance(df.index, pd.DatetimeIndex):
#                 return Response({"error": "Unexpected data format"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#             df = df.reset_index()  # brings Date out of index

#             data = []
#             for _, row in df.iterrows():
#                 date_val = row["Date"]
#                 if hasattr(date_val, "date"):
#                     date_val = date_val.date()
#                 data.append({
#                     "date": str(date_val),
#                     # "close_price": round(float(row["Close"]), 2)
#                     "close_price": round(float(row["Close"]), 2) if not isinstance(row["Close"], pd.Series) else round(float(row["Close"].iloc[0]), 2)
#                 })

#             return Response(data)
#         except Exception as e:
#             import traceback
#             traceback.print_exc()
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import os
from django.conf import settings

from .services import build_and_train_model, predict_future, load_existing_model
from .models import StockModelInfo


class PredictView(APIView):
    def get(self, request):
        symbol = request.query_params.get("symbol")
        days = int(request.query_params.get("days", 7))
        if not symbol:
            return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = predict_future(symbol, days=days)

            # ✅ Ensure clean dates and floats in prediction response
            if "date" in result:
                result["date"] = [
                    pd.to_datetime(d).strftime("%Y-%m-%d") if not isinstance(d, str) else d
                    for d in result["date"]
                ]
            if "predicted_close" in result:
                result["predicted_close"] = [float(v) for v in result["predicted_close"]]

            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RetrainView(APIView):
    def post(self, request):
        symbol = request.data.get("symbol")
        if not symbol:
            return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            model, scaler = build_and_train_model(symbol)
            # Update or create DB entry
            model_path = os.path.join(settings.BASE_DIR, "predictor", "models", f"{symbol}_model.h5")
            scaler_path = os.path.join(settings.BASE_DIR, "predictor", "models", f"{symbol}_scaler.pkl")
            info, created = StockModelInfo.objects.update_or_create(
                symbol=symbol,
                defaults={
                    "model_file": model_path,
                    "scaler_file": scaler_path,
                }
            )
            return Response({"success": True, "created": created})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModelExistsView(APIView):
    def get(self, request):
        symbol = request.query_params.get("symbol")
        exists = False
        if symbol:
            model, scaler = load_existing_model(symbol)
            exists = model is not None
        return Response({"exists": exists})


# class HistoricalDataView(APIView):
#     def get(self, request):
#         symbol = request.query_params.get("symbol")
#         if not symbol:
#             return Response({"error": "Symbol required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             df = yf.download(symbol, period="1mo", interval="1d")  # 30 days
#             if df.empty:
#                 return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)

#             # Ensure Date is a column
#             if not isinstance(df.index, pd.DatetimeIndex):
#                 return Response({"error": "Unexpected data format"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#             df = df.reset_index()  # brings Date out of index

#             data = []
#             for _, row in df.iterrows():
#                 # ✅ Clean date
#                 date_val = row["Date"]
#                 if hasattr(date_val, "strftime"):
#                     date_val = date_val.strftime("%Y-%m-%d")
#                 else:
#                     date_val = str(date_val)

#                 # ✅ Clean Close value
#                 close_val = row["Close"]
#                 if isinstance(close_val, (pd.Series, pd.DataFrame)):
#                     close_val = float(close_val.iloc[0])
#                 else:
#                     close_val = float(close_val)

#                 data.append({
#                     "date": date_val,
#                     "close_price": round(close_val, 2)
#                 })

#             return Response(data)
#         except Exception as e:
#             import traceback
#             traceback.print_exc()
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
