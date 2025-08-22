
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
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from .models import StockModelInfo

# Ensure model directory exists
MODEL_DIR = os.path.join(settings.BASE_DIR, "predictor", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

SEQUENCE_LENGTH = 60  # timesteps used for training/prediction

def build_and_train_model(symbol, lookback=SEQUENCE_LENGTH, epochs=25):
    print(f"📈 Training improved model for {symbol}...")

    df = yf.download(symbol, period="3y", auto_adjust=True)
    if df.empty:
        raise ValueError(f"No data found for {symbol}")

    # Use OHLCV instead of just Close
    close_prices = df[['Close']].values 
    scaler = MinMaxScaler(feature_range=(0, 1)) 
    scaled_data = scaler.fit_transform(close_prices)

    X, y = [], [] 
    for i in range(lookback, len(scaled_data)): 
        X.append(scaled_data[i - lookback:i, 0]) 
        y.append(scaled_data[i, 0]) 
        
    X, y = np.array(X), np.array(y) 
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    # Model
    model = Sequential([
        Bidirectional(LSTM(64, return_sequences=True), input_shape=(X.shape[1], X.shape[2])),
        BatchNormalization(),
        Dropout(0.2),

        LSTM(128, return_sequences=True),
        BatchNormalization(),
        Dropout(0.3),

        LSTM(64),
        Dense(50, activation="relu"),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss="mean_squared_error")

    es = EarlyStopping(monitor="loss", patience=10, restore_best_weights=True)

    model.fit(
        X, y,
        epochs=epochs,
        batch_size=32,
        verbose=1,
        callbacks=[es]
    )

    # Save model & scaler
    model_path = os.path.join(MODEL_DIR, f"{symbol}_model.h5")
    scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")
    model.save(model_path)
    joblib.dump(scaler, scaler_path)

    StockModelInfo.objects.update_or_create(
        symbol=symbol,
        defaults={"model_file": model_path, "scaler_file": scaler_path}
    )

    print(f"✅ model trained and saved for {symbol}")
    return model, scaler

def load_existing_model(symbol):
    """Load saved model + scaler if exists."""
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


def predict_future(symbol, days=7, lookback=SEQUENCE_LENGTH):
    """
    Predict future prices for a given stock symbol using improved model (OHLCV input).
    """
    model, scaler = load_existing_model(symbol)
    if model is None:
        model, scaler = build_and_train_model(symbol, lookback=lookback)

    # Get recent data
    df = yf.download(symbol, period="200d")
    if df.empty:
        raise ValueError(f"No recent data found for {symbol}")

    last_data = df[['Close']].values
    if len(last_data) < 2:
        raise ValueError(f"Not enough recent data for {symbol} to make prediction")

    effective_lookback = min(lookback, len(last_data))
    scaled_last = scaler.transform(last_data)
    X_input = scaled_last[-effective_lookback:].reshape(1, effective_lookback, 1)  

    predictions = []
    for i in range(days):
        pred = model.predict(X_input, verbose=0)  # shape (1,1)
        predictions.append(pred[0][0])

        # reshape pred into (1,1,1) to match time-series input 
        pred_reshaped = np.reshape(pred, (1,1,1))

        # Append as next sequence
        X_input = np.concatenate([X_input[:, 1:, :], pred_reshaped], axis=1)

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)) 
    future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=days)
    
    return pd.DataFrame({"date": future_dates, "predicted_close": predictions.flatten()})
