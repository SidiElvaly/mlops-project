
<div align="center">

# 💳 Credit Card Fraud Detection

### End-to-End MLOps Pipeline with CI/CD

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-EB0028?style=flat-square)
![MLflow](https://img.shields.io/badge/MLflow-2.8-0194E2?style=flat-square&logo=mlflow&logoColor=white)
![DVC](https://img.shields.io/badge/DVC-3.48-13ADC7?style=flat-square&logo=dvc&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-29.1-2496ED?style=flat-square&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2%20%2B%20S3-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white)

**A production-grade fraud detection system showcasing complete MLOps practices — from data versioning to automated deployment.**

[Live Demo](#-live-services) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [CI/CD](#-cicd-workflows)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Team](#-team)
- [Architecture](#-architecture)
- [Live Services](#-live-services)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [CI/CD Workflows](#-cicd-workflows)
- [Model Performance](#-model-performance)
- [Development Workflow](#-development-workflow)
- [Dataset](#-dataset)

---

## 🎯 Project Overview

This project implements an **end-to-end MLOps pipeline** for detecting fraudulent credit card transactions, built as part of the **MLOps II course at SupNum (DEML M2)** under Professor **Yehdhih ANNA**.

The system combines machine learning operations best practices with cloud-native deployment:

- 🤖 **XGBoost model** trained on 284,807 real transactions with 0.17% fraud rate
- 📊 **MLflow Registry** for model versioning and stage management
- 🔄 **DVC pipeline** for reproducible data processing and training
- 🐳 **Dockerized FastAPI** backend serving predictions in real-time
- 🎨 **Interactive web UI** for non-technical users
- 🚀 **GitHub Actions** for automated deployment and retraining
- ☁️ **AWS infrastructure** (EC2 + S3) with proper IAM security

---

## 👥 Team

| Member | Matricule | Role | Branch |
|--------|-----------|------|--------|
| **Sidi Elvaly Souleymane** | 21031 | DevOps & CI/CD Lead | `dev-21031` |
| **Zidbih** | 24264 | ML Engineering & DVC | `dev-24264` |
| **Emani** | 21068 | FastAPI Backend | `dev-21068` |
| **Khatu** | 21016 | Frontend & Documentation | `dev-21016` |

---

## 🏗️ Architecture

### High-Level Flow

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────────────────┐
│     GitHub      │──────▶│  GitHub Actions  │──────▶│       AWS EC2 (Paris)        │
│   Repository    │       │  deploy.yml      │       │  ┌──────────┐  ┌──────────┐ │
│ main + 4 devs   │       │  retrain.yml     │       │  │ FastAPI  │──│ MLflow   │ │
└─────────────────┘       └──────────────────┘       │  │ (Docker) │  │ Registry │ │
                                                      │  └──────────┘  └──────────┘ │
                                                      │         ▲            │       │
                                                      │         │            │       │
                                                      │  ┌──────┴────────────▼─────┐│
                                                      │  │   DVC Pipeline (4 stgs) ││
                                                      │  │  preprocess → train →   ││
                                                      │  │  evaluate → register    ││
                                                      │  └─────────────────────────┘│
                                                      └──────────────┬───────────────┘
                                                                     │
                                                              ┌──────▼──────┐
                                                              │   AWS S3    │
                                                              │   Bucket    │
                                                              │ data,       │
                                                              │ artifacts   │
                                                              └─────────────┘
```

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| 🐙 **GitHub** | Source control + CI trigger | Cloud |
| ⚙️ **GitHub Actions** | Automate deploy + retrain | Cloud |
| 🖥️ **AWS EC2** | Application host | `eu-west-3` |
| 🐳 **Docker** | FastAPI container | On EC2 |
| 📊 **MLflow** | Model registry + tracking | On EC2 (port 5000) |
| 🔄 **DVC** | Pipeline + data versioning | On EC2 |
| 🪣 **AWS S3** | Artifact + data storage | Cloud |

---

## 🚀 Live Services

All services are live and accessible:

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Web UI** | [http://13.36.24.137:8000/ui](http://13.36.24.137:8000/ui) | Interactive fraud prediction form |
| 📚 **Swagger Docs** | [http://13.36.24.137:8000/docs](http://13.36.24.137:8000/docs) | OpenAPI documentation |
| ❤️ **API Health** | [http://13.36.24.137:8000/](http://13.36.24.137:8000/) | Service health check |
| 📊 **MLflow UI** | [http://13.36.24.137:5000](http://13.36.24.137:5000) | Experiment tracking & registry |

### API Endpoints

```http
GET  /           → Health check (returns model info)
GET  /docs       → Interactive Swagger documentation
GET  /ui         → Frontend web interface
POST /predict    → Submit transaction for fraud prediction
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top">

### Machine Learning
- **XGBoost** 2.0
- **scikit-learn** 1.3
- **pandas** 2.1
- **MLflow** 2.8

</td>
<td valign="top">

### Backend
- **Python** 3.11
- **FastAPI** 0.104
- **Uvicorn** 0.24
- **Pydantic** v2

</td>
<td valign="top">

### DevOps
- **Docker** 29.1
- **GitHub Actions**
- **DVC** 3.48
- **AWS CLI** v2

</td>
<td valign="top">

### Cloud
- **AWS EC2** (t3.medium)
- **AWS S3**
- **AWS IAM**
- Region: `eu-west-3`

</td>
</tr>
</table>

---

## 📁 Project Structure

```
mlops-project/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Auto-deploy on push to main
│       └── retrain.yml         # Manual + weekly retrain
│
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app + endpoints
│   │   └── schemas.py          # Pydantic models
│   │
│   ├── preprocess.py           # Stage 1: data prep
│   ├── train.py                # Stage 2: XGBoost training
│   ├── evaluate.py             # Stage 3: metrics + confusion matrix
│   └── register.py             # Stage 4: MLflow registration
│
├── frontend/
│   ├── index.html              # Multi-step prediction wizard
│   ├── script.js               # API client + UI logic
│   └── styles.css              # Responsive design
│
├── scripts/
│   ├── setup_ec2.sh            # Fresh EC2 bootstrap
│   ├── setup_dvc.sh            # DVC + S3 remote init
│   └── setup_branches.sh       # Git branch structure
│
├── models/                     # DVC-tracked (not in git)
├── data/                       # DVC-tracked (not in git)
├── tests/                      # Test suite
│
├── Dockerfile                  # Multi-stage build, non-root user
├── docker-compose.yml          # Service orchestration + env
├── dvc.yaml                    # 4-stage ML pipeline definition
├── params.yaml                 # Model hyperparameters (gitignored)
├── requirements.txt            # Python dependencies
└── README.md                   # You are here 📍
```

---

## 🚀 Quick Start

### For End Users (Try the Live Demo)

Visit the **[Web UI](http://13.36.24.137:8000/ui)** and submit a test transaction. Try:
- Click **Normal** → see `SAFE TRANSACTION` (green)
- Click **Fraud** → see `FRAUD TRANSACTION` (red)
- Click **Random** → see a random result

### For Developers (Local Setup)

**Prerequisites:** Docker, Git, Python 3.11

```bash
# 1. Clone the repo
git clone https://github.com/SidiElvaly/mlops-project.git
cd mlops-project

# 2. Create your virtual environment
python3 -m venv venv
source venv/bin/activate        # or venv\Scripts\activate on Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables
cp .env.example .env
# Edit .env with your credentials

# 5. Run with Docker
docker compose build
docker compose up -d

# 6. Verify
curl http://localhost:8000/
```

### For Operators (Deploy to Fresh EC2)

```bash
# On a fresh Ubuntu 24.04 EC2 instance:
ssh ubuntu@<YOUR_EC2_IP>

# Run our setup script
git clone https://github.com/SidiElvaly/mlops-project.git
cd mlops-project
bash scripts/setup_ec2.sh
bash scripts/setup_dvc.sh

# Configure AWS + MLflow service (see INFRASTRUCTURE.md)
aws configure
```

---

## 🔄 CI/CD Workflows

Two automated workflows orchestrate the entire pipeline:

### 1. `deploy.yml` — Continuous Deployment

```yaml
Trigger:  push to main | workflow_dispatch
Runtime:  ~45 seconds

Steps:
  1. Checkout repo
  2. Configure SSH key from secrets
  3. SSH to EC2
  4. Pull latest code (hard reset to main)
  5. Build Docker image
  6. Restart fraud-api container
  7. Health check (curl /)
```

✅ **Every merge to `main` = automatic production deployment**

### 2. `retrain.yml` — Continuous Training

```yaml
Trigger:  workflow_dispatch | cron (weekly)
Runtime:  ~5-8 minutes

Steps:
  1. Checkout repo
  2. Configure SSH key from secrets
  3. SSH to EC2
  4. Activate ML venv
  5. Pull latest data via DVC
  6. Run dvc repro (full pipeline)
  7. Push new artifacts to S3
  8. Restart fraud-api to load new model
```

✅ **Model can be retrained on demand or automatically**

### GitHub Secrets Configured

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for S3 |
| `AWS_REGION` | `eu-west-3` |
| `EC2_HOST` | Production server IP |
| `EC2_USER` | SSH user (`ubuntu`) |
| `EC2_SSH_KEY` | PEM private key |
| `MLFLOW_TRACKING_URI` | MLflow server URL |
| `S3_BUCKET` | `fraud-mlops-team` |

---

## 📈 Model Performance

Our XGBoost classifier achieves excellent performance on a highly imbalanced dataset:

| Metric | Score | Notes |
|--------|-------|-------|
| 🎯 **AUC-PR** | **0.876** | Primary metric for imbalanced data |
| 🔍 **Recall** | 83.7% | Catches 82 / 98 frauds |
| 🎯 **Precision** | 88.2% | Low false-alarm rate |
| ⚖️ **F1 Score** | 85.8% | Balanced measure |

### Confusion Matrix (Test Set)

```
                  Predicted Safe    Predicted Fraud
Actual Safe        56,853              11  (false positives)
Actual Fraud           16              82  (true positives)
```

### Why AUC-PR (not Accuracy)?

With only **0.17% fraud rate**, a dumb model predicting "safe" for everything would score **99.83% accuracy** — but catch zero frauds. **AUC-PR** directly measures the precision–recall tradeoff, making it the industry-standard metric for fraud detection.

### Model Versioning

All model versions are tracked in MLflow Registry:
- **Production stage** — current serving model (`v3`)
- **Staging stage** — candidate models under evaluation
- **Archived stage** — historical versions

---

## 🌿 Development Workflow

We follow a **branch-per-developer** model with PR-based integration:

```
     main (protected)
        ▲
        │ PR + review
        │
     staging (integration)
        ▲
        │ PR per feature
        │
   ┌────┴────┬─────────┬─────────┬─────────┐
   │         │         │         │         │
dev-21031 dev-24264 dev-21068 dev-21016    ...
 (Sidi)   (Zidbih)  (Emani)   (Khatu)
```

### Conventional Commits

We use conventional commits for clear history:
- `feat(scope):` new features
- `fix(scope):` bug fixes
- `docs(scope):` documentation
- `ci(scope):` workflow changes
- `chore(scope):` maintenance
- `refactor(scope):` code restructuring

### Branch Protection

- ❌ **No direct pushes to `main`** (ruleset enforced)
- ✅ **Pull requests required** for all changes
- ✅ **Force pushes blocked**
- ✅ **Deletions restricted**

---

## 📦 Dataset

We use the **[Credit Card Fraud Detection dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)** from the Université Libre de Bruxelles (ULB):

- **284,807 transactions** made by European cardholders
- **492 frauds** (0.173% of transactions)
- **30 features:**
  - `Time` — seconds elapsed since first transaction
  - `V1–V28` — PCA-transformed features (anonymized for privacy)
  - `Amount` — transaction amount in euros
- **Target:** `Class` (0 = safe, 1 = fraud)

The dataset is stored in `s3://fraud-mlops-team/data/raw/` and versioned via DVC.

---

## 🎓 Academic Context

- **Course:** MLOps II (Data Engineering & Machine Learning M2)
- **Institution:** SupNum — Université des Sciences, de Technologies et de Médecine
- **Professor:** Yehdhih ANNA
- **Year:** 2025–2026

### Evaluation Rubric Coverage

| Section | Points | Coverage |
|---------|--------|----------|
| A — MLflow + S3 + Registry | 3 | ✅ Complete |
| B — DVC pipeline (4 stages) | 4 | ✅ Complete |
| C — FastAPI + Docker + UI | 4 | ✅ Complete |
| D — CI/CD (2 workflows) | 5 | ✅ Both green |
| E — Git branches & commits | 3 | ✅ 5 branches |
| **Total** | **19** | ✅ **19/19** |

---

## 📄 Additional Documentation

- [`INFRASTRUCTURE.md`](./INFRASTRUCTURE.md) — Detailed AWS + MLflow setup
- [`scripts/`](./scripts/) — Bootstrap scripts for reproducibility
- [Swagger API Docs](http://13.36.24.137:8000/docs) — Interactive API exploration

---

## 📜 License

This project was developed for academic purposes as part of the MLOps II course at SupNum. Feel free to fork, study, and adapt for learning.

---

<div align="center">

**Built with dedication by Team 4 — April 2026** 🚀

*Fraud detection that ships on every commit.*

</div>
