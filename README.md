# Advanced AI Demand Forecasting Enhancement

Developed for Priya

A full-stack enterprise demand intelligence platform with FastAPI, React, JWT authentication, live analytics, AI-optimized forecasting, reports, monitoring, and access controls.

## Enterprise Features

- Live dashboard refresh and sales monitoring every 15 seconds.
- Ensemble forecasting, automated model retraining, anomaly detection, and seasonal analysis.
- Region/category analytics, revenue prediction, inventory risk intelligence, and AI insight narratives.
- Roles: `super_admin`, `analyst`, and `viewer`; the first registered account becomes Super Admin.
- Global search, advanced dashboard filters, dark/light mode, forecast history, API metrics, and audit logs.
- Excel analytics summary/forecast comparison workbook and PDF executive insight brief.

Analysts can import workbooks and run forecasting operations. Viewers have read-only dashboard access. Super Admins can assign roles and review system monitoring.

## Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server.app:app --reload --host 127.0.0.1 --port 8100
```

API docs:

```text
http://127.0.0.1:8100/docs
```

## Frontend

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5274 --strictPort
```

App:

```text
http://127.0.0.1:5274
```

Register the first user to become Super Admin, import `sample_lavanya_demand_csv`, and run an Ensemble scenario to populate all analytics panels.
