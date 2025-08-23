<h1 align="center">TradeTrack - Stock tracking and Portfolio management📈 </h1>
 
<p align="center"><i>Your All-in-One Stock Trading & Portfolio Management Platform</i></p>

## 📚 Table of Contents
- [Overview](#-overview)
- [Demo](#-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Configuration](#️-configuration)
- [Acknowledgements](#-acknowledgements)

---

## 🚀 Overview  

**TradeTrack** is a next-gen trading and portfolio management platform built for both **casual investors** and **professional traders**.  
With real-time market data, AI-powered predictions, interactive dashboards, and portfolio tracking, it helps users **analyze, simulate, and optimize trading strategies** — all in one place.  

---

## 🎥 Demo  

Check out a quick demo of TradeTrack in action:  

➡️ [![TradeTrack Demo](https://img.youtube.com/vi/your-video-id/0.jpg)](https://www.youtube.com/watch?v=your-video-id)

---

## ✨ Key Features  

✅ **User Authentication** – Secure signup, login, and password reset  
✅ **Real-Time Market Data** – Live updates & stock overviews  
✅ **Portfolio Management** – Track holdings, performance & transactions  
✅ **Simulated Trading** – Practice trades with realistic execution  
✅ **AI Predictive Analytics** – ML-powered price forecasts  
✅ **Personalized Watchlists** – Monitor your favorite stocks  
✅ **Financial News Feed** – Stay ahead with market news  
✅ **Interactive Charts** – Visualize trends & technicals  
✅ **Responsive Dashboard** – Clean, intuitive, and mobile-friendly  

---

## 🛠 Tech Stack  

**Frontend**  
- [React.js](https://reactjs.org/)  
- [Vite](https://vitejs.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  

**Backend**  
- [Django](https://www.djangoproject.com/)  
- [Django REST Framework](https://www.django-rest-framework.org/)  
- [SQLite](https://www.sqlite.org/)  

**Machine Learning**  
- [Keras](https://keras.io/)  
- [scikit-learn](https://scikit-learn.org/)  

**Other**  
- [JWT Authentication](https://jwt.io/)  
- [Python 3.8+](https://www.python.org/)  

---

## ⚡ Installation & Setup  

### 1. Clone the Repository  

```bash
git clone https://github.com/kavish-96/TradeTrack.git
cd TradeTrack
```

### 2. Backend Setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

pip install -r requirements.txt
python manage.py migrate
python setup_sqlite.py  # (Optional) Pre-populate database if needed
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

### 4. Environment Variables

- **Backend**: Configure environment variables in `Backend/Backend/settings.py` as needed (e.g., secret keys, debug mode).
- **Frontend**: Add API endpoint URLs in `Frontend/src/lib/api.js` if required.

---

## 📁 Project Structure
```csharp
TradeTrack/
├─ Backend/                  # Django backend
│  ├─ accounts/              # Auth
│  ├─ market/                # Market data APIs
│  ├─ news/                  # News feed
│  ├─ portfolio/             # Portfolios
│  ├─ predictor/             # ML models
│  ├─ trades/                # Trade execution/history
│  ├─ watchlist/             # Watchlists
│  ├─ Backend/               # Django settings
│  ├─ manage.py
│  └─ requirements.txt
├─ Frontend/                 # React app
│  ├─ src/
│  │  ├─ components/
│  │  ├─ lib/
│  │  └─ App.jsx
│  ├─ public/
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```
---

## ⚙️ Configuration

| Area     | Key              | Example / Notes                         |
|----------|------------------|-----------------------------------------|
| Backend  | `SECRET_KEY`     | Set in `Backend/Backend/settings.py`    |
| Backend  | `DEBUG`          | `False` in production                   |
| Backend  | API base path    | Default: `/api/`                        |
| Frontend | API URL          | Set in `Frontend/src/lib/api.js`        |

---

## 🙏 Acknowledgements

TradeTrack would not be possible without these amazing APIs and libraries:  

- [Alpha Vantage API](https://www.alphavantage.co/) — for **live stock prices and market data**  
- [yfinance](https://pypi.org/project/yfinance/) — for **historical stock data and model training datasets**  
- [Finnhub API](https://finnhub.io/) — for **real-time financial news and stock-related headlines**  

A huge thanks to their teams for providing reliable financial data and tools 🚀

---

<p align="center">
  Made with ❤️ by <b>Kavish Patel</b><br>
  🔗
  <a href="https://www.linkedin.com/in/kavish-patel-1a0a052b0/" target="_blank">
    Connect on LinkedIn
  </a>
</p>

