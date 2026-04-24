<div align="center">

# Credit Card Fraud Detection

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

[Live Demo](#live-services) • [Architecture](#architecture) • [Quick Start](#quick-start) • [CI/CD](#cicd-workflows)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Team](#team)
- [Architecture](#architecture)
- [Live Services](#live-services)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [CI/CD Workflows](#cicd-workflows)
- [Model Performance](#model-performance)
- [Development Workflow](#development-workflow)
- [Dataset](#dataset)

---

## Project Overview

This project implements an **end-to-end MLOps pipeline** for detecting fraudulent credit card transactions, built as part of the **MLOps II course at SupNum (DEML M2)** under Professor **Yehdhih ANNA**.

The system combines machine learning operations best practices with cloud-native deployment:

- **XGBoost model** trained on 284,807 real transactions with 0.17% fraud rate
- **MLflow Registry** for model versioning and stage management
- **DVC pipeline** for reproducible data processing and training
- **Dockerized FastAPI** backend serving predictions in real-time
- **Interactive web UI** for non-technical users
- **GitHub Actions** for automated deployment and smart retraining
- **AWS infrastructure** (EC2 + S3) with proper IAM security

---

## Team

| Member | Matricule | Role | Branch |
|--------|-----------|------|--------|
| **Sidi Elvaly Souleymane** | 21031 | DevOps & CI/CD Lead | `dev-21031` |
| **Zidbih** | 24264 | ML Engineering & DVC | `dev-24264` |
| **Emani** | 21068 | Frontend | `dev-21068` |
| **Khatu** | 21016 | FastAPI Backend | `dev-21016` |

---

## Architecture

<div align="center">

<svg width="800" height="480" viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M2 1 L 8 5 L 2 9" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"/>
    </marker>
  </defs>

  <rect x="280" y="30" width="240" height="70" rx="12" fill="#EEEDFE" stroke="#7F77DD" stroke-width="2"/>
  <text x="400" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#26215C">GitHub</text>
  <text x="400" y="82" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#534AB7">Source control + PR workflow</text>

  <line x1="400" y1="100" x2="400" y2="130" stroke="#555" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="280" y="140" width="240" height="70" rx="12" fill="#E6F1FB" stroke="#378ADD" stroke-width="2"/>
  <text x="400" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#042C53">GitHub Actions</text>
  <text x="400" y="192" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#185FA5">deploy.yml + retrain.yml</text>

  <line x1="400" y1="210" x2="400" y2="240" stroke="#555" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="40" y="250" width="720" height="130" rx="14" fill="#E1F5EE" stroke="#1D9E75" stroke-width="2"/>
  <text x="400" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#04342C">AWS EC2 (Paris)</text>

  <rect x="80" y="300" width="190" height="60" rx="10" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text x="175" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#04342C">FastAPI</text>
  <text x="175" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#085041">Docker • Port 8000</text>

  <rect x="305" y="300" width="190" height="60" rx="10" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text x="400" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#04342C">MLflow</text>
  <text x="400" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#085041">Registry • Port 5000</text>

  <rect x="530" y="300" width="190" height="60" rx="10" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text x="625" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#04342C">DVC</text>
  <text x="625" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#085041">4-stage pipeline</text>

  <line x1="400" y1="380" x2="400" y2="410" stroke="#555" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="280" y="420" width="240" height="55" rx="12" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/>
  <text x="400" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#412402">AWS S3</text>
  <text x="400" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#633806">Data + model artifacts</text>
</svg>

</div>

### How It Works

1. **GitHub** — Developers push code via pull requests
2. **GitHub Actions** — Automatically deploys on merge + retrains on ML code changes
3. **AWS EC2** — Hosts FastAPI (predictions), MLflow (registry), and DVC (training)
4. **AWS S3** — Stores datasets and model artifacts with versioning

---

## Live Services

All services are live and accessible:

| Service | URL | Description |
|---------|-----|-------------|
| **Web UI** | [http://13.36.24.137:8000/ui](http://13.36.24.137:8000/ui) | Interactive fraud prediction form |
| **Swagger Docs** | [http://13.36.24.137:8000/docs](http://13.36.24.137:8000/docs) | OpenAPI documentation |
| **API Health** | [http://13.36.24.137:8000/](http://13.36.24.137:8000/) | Service health check |
| **MLflow UI** | [http://13.36.24.137:5000](http://13.36.24.137:5000) | Experiment tracking & registry |

### API Endpoints

```http
GET  /           - Health check (returns model info)
GET  /docs       - Interactive Swagger documentation
GET  /ui         - Frontend web interface
POST /predict    - Submit transaction for fraud prediction
```

---

## Tech Stack

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

## Project Structure

```
mlops-project/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Auto-deploy on push to main
│       └── retrain.yml         # Smart retrain on ML file changes
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
├── models/                     # DVC-tracked (not in git)
├── data/                       # DVC-tracked (not in git)
│
├── Dockerfile                  # Multi-stage build, non-root user
├── docker-compose.yml          # Service orchestration + env
├── dvc.yaml                    # 4-stage ML pipeline definition
├── params.yaml                 # Model hyperparameters (gitignored)
├── requirements.txt            # Python dependencies
└── README.md
```

---

## Quick Start

### For End Users (Try the Live Demo)

Visit the **[Web UI](http://13.36.24.137:8000/ui)** and submit a test transaction. Try:
- Click **Normal** - see `SAFE TRANSACTION` (green)
- Click **Fraud** - see `FRAUD TRANSACTION` (red)
- Click **Random** - see a random result

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

---

## CI/CD Workflows

Two intelligent workflows orchestrate the entire pipeline with **zero manual intervention**.

### 1. `deploy.yml` — Continuous Deployment

```yaml
Triggers:
  - push to main (automatic on every merge)
  - workflow_dispatch (manual)

Runtime: ~45 seconds

Steps:
  1. Checkout repo on ubuntu-latest runner
  2. Configure SSH key from secrets
  3. Add EC2 to known hosts
  4. SSH to EC2:
     - git reset --hard origin/main
     - Generate .env from secrets
     - docker compose down && build && up -d
  5. Wait 30s for container startup
  6. Health check: curl http://13.36.24.137:8000/
```

**Every merge to `main` triggers automatic production deployment.**

---

### 2. `retrain.yml` — Smart Continuous Training

Our retrain workflow is **intelligently triggered** — only fires when it matters, preserving compute resources.

```yaml
Triggers:
  1. workflow_dispatch (manual on-demand)
  2. schedule (weekly, every Sunday at 02:00 UTC)
  3. push to main with path filters:
     - src/preprocess.py
     - src/train.py
     - src/evaluate.py
     - src/register.py
     - dvc.yaml
     - params.yaml
     - requirements.txt
     - data/raw/**.dvc

Runtime: ~5-8 minutes

Steps:
  1. Checkout repo on ubuntu-latest runner
  2. Configure SSH key from secrets
  3. SSH to EC2:
     - git reset --hard origin/main
     - Activate ~/.venv/mlpipeline
     - dvc pull (sync artifacts from S3)
     - dvc repro (run 4-stage pipeline)
     - dvc push (upload new artifacts)
     - docker compose restart fraud-api
  4. Wait 30s + health check
```

### How Smart Triggering Works

The workflow differentiates between **code changes that affect the model** and **cosmetic changes**:

| Change Type | Example Files | `deploy.yml` | `retrain.yml` |
|-------------|---------------|--------------|---------------|
| Documentation | `README.md`, `INFRASTRUCTURE.md` | Runs | Skipped |
| Frontend | `frontend/index.html`, `script.js` | Runs | Skipped |
| API | `src/api/main.py`, `schemas.py` | Runs | Skipped |
| Infrastructure | `Dockerfile`, `docker-compose.yml` | Runs | Skipped |
| ML Code | `src/train.py`, `preprocess.py` | Runs | **Retrains** |
| Hyperparams | `params.yaml`, `dvc.yaml` | Runs | **Retrains** |
| New Data | `data/raw/creditcard.csv.dvc` | Runs | **Retrains** |

### Why This Matters

- **Compute efficiency** — no wasted retraining on doc updates
- **Clean model history** — new versions only when model code actually changes
- **Automatic freshness** — updating hyperparameters auto-triggers a new version
- **Storage optimization** — S3 artifacts only grow when meaningful

### Manual Retrain (any time)

You can always trigger retraining manually from:
**[GitHub Actions](https://github.com/SidiElvaly/mlops-project/actions) -> Retrain Model -> Run workflow -> Select `main` -> Run**

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

## Model Performance

Our XGBoost classifier achieves excellent performance on a highly imbalanced dataset:

| Metric | Score | Notes |
|--------|-------|-------|
| **AUC-PR** | **0.876** | Primary metric for imbalanced data |
| **Recall** | 83.7% | Catches 82 / 98 frauds |
| **Precision** | 88.2% | Low false-alarm rate |
| **F1 Score** | 85.8% | Balanced measure |

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

## Development Workflow

We follow a **branch-per-developer** model with PR-based integration:

```
     main (protected)
        ^
        | PR + review
        |
     staging (integration)
        ^
        | PR per feature
        |
   +----+----+---------+---------+---------+
   |         |         |         |         |
dev-21031 dev-24264 dev-21068 dev-21016
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

- **No direct pushes to `main`** (ruleset enforced)
- **Pull requests required** for all changes
- **Force pushes blocked**
- **Deletions restricted**

---

## Dataset

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

<div align="center">

**Built by Team 4 — April 2026**

*Fraud detection that ships on every commit.*

</div>
