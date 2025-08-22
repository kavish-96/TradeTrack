
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

#             # ✅ Ensure clean dates and floats in prediction response
#             if "date" in result:
#                 result["date"] = [
#                     pd.to_datetime(d).strftime("%Y-%m-%d") if not isinstance(d, str) else d
#                     for d in result["date"]
#                 ]
#             if "predicted_close" in result:
#                 result["predicted_close"] = [float(v) for v in result["predicted_close"]]

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






# problemtic

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
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
#             df = predict_future(symbol, days=days)

#             # ✅ Handle empty dataframe gracefully
#             if df.empty:
#                 return Response({"error": "No prediction data available"}, status=status.HTTP_200_OK)

#             result = {
#                 "date": [d.strftime("%Y-%m-%d") for d in df["date"]],
#                 "Open": [float(v) for v in df["Open"]],
#                 "High": [float(v) for v in df["High"]],
#                 "Low": [float(v) for v in df["Low"]],
#                 "Close": [float(v) for v in df["Close"]],
#             }
#             return Response(result, status=status.HTTP_200_OK)

#         except Exception as e:
#             print(f"❌ Prediction error for {symbol}: {e}")
#             return Response({"error": str(e)}, status=status.HTTP_200_OK)


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
#             StockModelInfo.objects.update_or_create(
#                 symbol=symbol,
#                 defaults={"model_file": model_path, "scaler_file": scaler_path}
#             )
#             return Response({"success": True})
#         except Exception as e:
#             print(f"❌ Retrain error for {symbol}: {e}")
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class ModelExistsView(APIView):
#     def get(self, request):
#         symbol = request.query_params.get("symbol")
#         if not symbol:
#             return Response({"exists": False})

#         try:
#             model, scaler = load_existing_model(symbol)
#             exists = model is not None
#         except Exception as e:
#             print(f"⚠️ ModelExists check failed for {symbol}: {e}")
#             exists = False

#         return Response({"exists": exists})




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
                result["date"] = [ pd.to_datetime(d).strftime("%Y-%m-%d") if not isinstance(d, str) else d for d in result["date"] ] 
                
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
            info, created = StockModelInfo.objects.update_or_create( symbol=symbol, defaults={ "model_file": model_path, "scaler_file": scaler_path, } ) 
            
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
