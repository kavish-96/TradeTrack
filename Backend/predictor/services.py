# # tradetrack/prediction.py

# import os
# import numpy as np
# import pandas as pd
# import yfinance as yf
# from sklearn.preprocessing import MinMaxScaler
# from tensorflow.keras.models import Sequential, load_model
# from tensorflow.keras.layers import LSTM, Dense, Dropout
# from tensorflow.keras.callbacks import EarlyStopping
# from django.conf import settings
# from .models import StockModelInfo
# import joblib

# MODEL_DIR = os.path.join(settings.BASE_DIR, "predictor", "models")
# os.makedirs(MODEL_DIR, exist_ok=True)


# def build_and_train_model(symbol, lookback=60, epochs=10):
#     """
#     Fetch data, train LSTM model for given stock, save model to disk.
#     """
#     print(f"📈 Training new model for {symbol}...")

#     df = yf.download(symbol, period="2y")  # last 2 years for better context
#     if df.empty:
#         raise ValueError(f"No data found for {symbol}")

#     close_prices = df[['Close']].values
#     scaler = MinMaxScaler(feature_range=(0, 1))
#     scaled_data = scaler.fit_transform(close_prices)

#     X, y = [], []
#     for i in range(lookback, len(scaled_data)):
#         X.append(scaled_data[i - lookback:i, 0])
#         y.append(scaled_data[i, 0])
#     X, y = np.array(X), np.array(y)
#     X = np.reshape(X, (X.shape[0], X.shape[1], 1))

#     model = Sequential([
#         LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)),
#         Dropout(0.2),
#         LSTM(units=50, return_sequences=False),
#         Dropout(0.2),
#         Dense(units=25),
#         Dense(units=1),
#     ])

#     model.compile(optimizer="adam", loss="mean_squared_error")

#     es = EarlyStopping(monitor="loss", patience=3, restore_best_weights=True)
#     model.fit(X, y, epochs=epochs, batch_size=32, verbose=1, callbacks=[es])

#     # Save model + scaler
#     model_path = os.path.join(MODEL_DIR, f"{symbol}_model.h5")
#     scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")
#     model.save(model_path)
#     joblib.dump(scaler, scaler_path)   # ✅ save full scaler

#     # Update DB entry
#     StockModelInfo.objects.update_or_create(
#         symbol=symbol,
#         defaults={
#             'model_file': model_path,
#             'scaler_file': scaler_path,
#         }
#     )

#     print(f"✅ Model trained and saved for {symbol}")
#     return model, scaler


# def load_existing_model(symbol):
#     try:
#         info = StockModelInfo.objects.get(symbol=symbol)
#         if os.path.exists(info.model_file) and os.path.exists(info.scaler_file):
#             print(f"📂 Loading saved model for {symbol}")
#             model = load_model(info.model_file)
#             scaler = joblib.load(info.scaler_file)   # ✅ load full scaler
#             return model, scaler
#     except StockModelInfo.DoesNotExist:
#         pass
#     return None, None


# def predict_future(symbol, days=7, lookback=60):
#     """
#     Predict future prices for a given stock symbol.
#     """
#     # Load model if exists, else train new one
#     model, scaler = load_existing_model(symbol)
#     if model is None:
#         model, scaler = build_and_train_model(symbol, lookback=lookback)

#     # Fetch last 100 days for prediction seed
#     df = yf.download(symbol, period="100d")
#     last_data = df[['Close']].values
#     scaled_last = last_data / scaler.data_max_

#     X_input = scaled_last[-lookback:].reshape(1, lookback, 1)

#     predictions = []
#     for _ in range(days):
#         pred = model.predict(X_input, verbose=0)
#         predictions.append(pred[0][0])

#         X_input = np.append(X_input[:, 1:, :], [[pred]], axis=1)

#     # Rescale back to original prices
#     predictions = np.array(predictions) * scaler.data_max_
#     future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=days)

#     return pd.DataFrame({"date": future_dates, "predicted_close": predictions.flatten()})







import os
import io
import base64
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
import joblib

from django.conf import settings
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

from .models import StockModelInfo

# Ensure model directory exists
MODEL_DIR = os.path.join(settings.BASE_DIR, "predictor", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

SEQUENCE_LENGTH = 60  # timesteps used for training/prediction


def build_and_train_model(symbol, lookback=SEQUENCE_LENGTH, epochs=10):
    
    print(f"📈 Training new model for {symbol}...")

    df = yf.download(symbol, period="2y")
    if df.empty:
        raise ValueError(f"No data found for {symbol}")

    close_prices = df[['Close']].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)

    X, y = [], []
    for i in range(lookback, len(scaled_data)):
        X.append(scaled_data[i - lookback:i, 0])
        y.append(scaled_data[i, 0])
    X, y = np.array(X), np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    # Build LSTM
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)),
        Dropout(0.2),
        LSTM(units=50, return_sequences=False),
        Dropout(0.2),
        Dense(units=25),
        Dense(units=1),
    ])

    model.compile(optimizer="adam", loss="mean_squared_error")

    es = EarlyStopping(monitor="loss", patience=3, restore_best_weights=True)
    model.fit(X, y, epochs=epochs, batch_size=32, verbose=1, callbacks=[es])

    # Save model & scaler
    model_path = os.path.join(MODEL_DIR, f"{symbol}_model.h5")
    scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")
    model.save(model_path)
    joblib.dump(scaler, scaler_path)

    # Save/update DB entry
    StockModelInfo.objects.update_or_create(
        symbol=symbol,
        defaults={"model_file": model_path, "scaler_file": scaler_path}
    )

    print(f"✅ Model trained and saved for {symbol}")
    return model, scaler


def load_existing_model(symbol):
    """
    Load saved model + scaler if exists.
    """
    try:
        info = StockModelInfo.objects.get(symbol=symbol)
        if os.path.exists(info.model_file) and os.path.exists(info.scaler_file):
            print(f"📂 Loading saved model for {symbol}")
            model = load_model(info.model_file, compile=False)
            scaler = joblib.load(info.scaler_file)
            return model, scaler
    except StockModelInfo.DoesNotExist:
        pass
    return None, None


def predict_future(symbol, days=7, lookback=60):
    """
    Predict future prices for a given stock symbol using saved or new model.
    """
    model, scaler = load_existing_model(symbol)
    if model is None:
        model, scaler = build_and_train_model(symbol, lookback=lookback)

    df = yf.download(symbol, period="100d")
    if df.empty:
        raise ValueError(f"No recent data found for {symbol}")

    last_data = df[['Close']].values
    if len(last_data) < 2:
        raise ValueError(f"Not enough recent data for {symbol} to make prediction")

    effective_lookback = min(lookback, len(last_data))
    scaled_last = scaler.transform(last_data)

    # Debugging logs
    print(f"🔎 last_data shape: {last_data.shape}")
    print(f"🔎 scaled_last shape: {scaled_last.shape}")
    print(f"🔎 effective_lookback: {effective_lookback}")

    X_input = scaled_last[-effective_lookback:].reshape(1, effective_lookback, 1)

    print(f"🔎 X_input shape: {X_input.shape}")
    print(f"🔎 Model input shape: {model.input_shape}")

    predictions = []
    for i in range(days):
        pred = model.predict(X_input, verbose=0)   # shape (1,1)
        print(f"🔎 Prediction {i+1}: {pred}")

        predictions.append(pred[0][0])

        # reshape pred into (1,1,1) to match time-series input
        pred_reshaped = np.reshape(pred, (1,1,1))

        X_input = np.concatenate([X_input[:, 1:, :], pred_reshaped], axis=1)



    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
    future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=days)

    return pd.DataFrame({"date": future_dates, "predicted_close": predictions.flatten()})






# import os
# import numpy as np
# import pandas as pd
# import yfinance as yf
# import joblib

# from django.conf import settings
# from sklearn.preprocessing import MinMaxScaler
# from tensorflow.keras.models import Sequential, load_model
# from tensorflow.keras.layers import LSTM, Dense, Dropout
# from tensorflow.keras.callbacks import EarlyStopping

# from .models import StockModelInfo

# # Ensure model directory exists
# MODEL_DIR = os.path.join(settings.BASE_DIR, "predictor", "models")
# os.makedirs(MODEL_DIR, exist_ok=True)

# SEQUENCE_LENGTH = 60  # timesteps


# def safe_download(symbol, period="2y", interval="1d"):
#     """Download Yahoo data with fallback dummy data if rate-limited."""
#     try:
#         df = yf.download(symbol, period=period, interval=interval)
#         if not df.empty:
#             return df
#     except Exception as e:
#         print(f"⚠️ yfinance error for {symbol}: {e}")

#     # fallback dummy data
#     print(f"⚠️ Using fallback dummy data for {symbol}")
#     dates = pd.date_range(end=pd.Timestamp.today(), periods=500, freq="B")
#     base = np.linspace(100, 200, len(dates))
#     noise = np.random.normal(0, 2, len(dates))
#     close = base + noise
#     openp = close + np.random.normal(0, 1, len(dates))
#     high = np.maximum(openp, close) + np.random.rand(len(dates)) * 2
#     low = np.minimum(openp, close) - np.random.rand(len(dates)) * 2
#     return pd.DataFrame({"Open": openp, "High": high, "Low": low, "Close": close}, index=dates)


# def build_and_train_model(symbol, lookback=SEQUENCE_LENGTH, epochs=10):
#     print(f"📈 Training new model for {symbol}...")

#     df = safe_download(symbol, period="2y", interval="1d")
#     if df.empty:
#         raise ValueError(f"No data found for {symbol}")

#     data = df[["Open", "High", "Low", "Close"]].values
#     scaler = MinMaxScaler()
#     scaled_data = scaler.fit_transform(data)

#     X, y = [], []
#     for i in range(lookback, len(scaled_data)):
#         X.append(scaled_data[i - lookback:i])
#         y.append(scaled_data[i])
#     X, y = np.array(X), np.array(y)

#     # Build LSTM
#     model = Sequential([
#         LSTM(64, return_sequences=True, input_shape=(lookback, 4)),
#         Dropout(0.2),
#         LSTM(64, return_sequences=False),
#         Dropout(0.2),
#         Dense(32, activation="relu"),
#         Dense(4)  # Open, High, Low, Close
#     ])
#     model.compile(optimizer="adam", loss="mean_squared_error")

#     es = EarlyStopping(monitor="loss", patience=3, restore_best_weights=True)
#     model.fit(X, y, epochs=epochs, batch_size=32, verbose=1, callbacks=[es])

#     # Save model & scaler
#     model_path = os.path.join(MODEL_DIR, f"{symbol}_model.h5")
#     scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")
#     model.save(model_path)
#     joblib.dump(scaler, scaler_path)

#     StockModelInfo.objects.update_or_create(
#         symbol=symbol,
#         defaults={"model_file": model_path, "scaler_file": scaler_path}
#     )
#     print(f"✅ Model trained and saved for {symbol}")
#     return model, scaler


# def load_existing_model(symbol):
#     try:
#         info = StockModelInfo.objects.get(symbol=symbol)
#         if os.path.exists(info.model_file) and os.path.exists(info.scaler_file):
#             print(f"📂 Loading saved model for {symbol}")
#             model = load_model(info.model_file, compile=False)
#             scaler = joblib.load(info.scaler_file)
#             return model, scaler
#     except StockModelInfo.DoesNotExist:
#         pass
#     return None, None


# def predict_future(symbol, days=7, lookback=SEQUENCE_LENGTH):
#     """Predict future OHLC values."""
#     model, scaler = load_existing_model(symbol)
#     if model is None:
#         model, scaler = build_and_train_model(symbol, lookback=lookback)

#     df = safe_download(symbol, period="120d", interval="1d")
#     if df.empty:
#         return pd.DataFrame()  # ✅ safe exit

#     recent = df[["Open", "High", "Low", "Close"]].values
#     scaled_recent = scaler.transform(recent)

#     effective_lookback = min(lookback, len(scaled_recent))
#     X_input = scaled_recent[-effective_lookback:].reshape(1, effective_lookback, 4)

#     predictions = []
#     for _ in range(days):
#         pred = model.predict(X_input, verbose=0)  # shape (1,4)
#         predictions.append(pred[0])
#         pred_reshaped = pred.reshape(1, 1, 4)
#         X_input = np.concatenate([X_input[:, 1:, :], pred_reshaped], axis=1)

#     predictions = scaler.inverse_transform(np.array(predictions))
#     future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=days)

#     return pd.DataFrame({
#         "date": future_dates,
#         "Open": predictions[:, 0],
#         "High": predictions[:, 1],
#         "Low": predictions[:, 2],
#         "Close": predictions[:, 3],
#     })
