# DevOps Notes — Sidi (matricule 21031)

Personal working notes for the DevOps scope of the MLOps fraud-detection project.
Branch: `dev-21031`. Do **not** merge this file to `main`; it is a scratchpad.

---

## 1. My responsibilities (~10 / 19 pts)

- Dockerize the FastAPI backend (`Dockerfile`).
- Orchestrate services with `docker-compose.yml` (API + MLflow client, optional Nginx).
- Write the two GitHub Actions workflows:
  - `.github/workflows/deploy.yml` — build image, push, deploy on EC2 on merge to `main`/`staging`.
  - `.github/workflows/retrain.yml` — trigger DVC/XGBoost retraining pipeline.
- Manage GitHub Secrets (AWS creds, EC2 SSH key, Docker Hub creds).
- Enforce branch protection on `main` (PR-only, required checks).
- Own AWS infra lifecycle (EC2, S3, IAM, Security Groups).

## 2. Infrastructure cheat-sheet

### AWS
| Item | Value |
|------|-------|
| Region | `eu-west-3` (Paris) |
| EC2 instance (public IP) | `13.36.24.137` |
| EC2 OS | Ubuntu 22.04 |
| EC2 type | `t3.medium` |
| SSH user | `ubuntu` |
| SSH key | `mlops-key.pem` (local only, **never commit**) |
| S3 bucket | `fraud-mlops-team` |
| S3 prefixes | `data/raw/`, `data/processed/`, `mlflow-artifacts/`, `dvc-store/` |

### Security Group (open ports)
- `22` — SSH
- `5000` — MLflow UI / tracking server
- `8000` — FastAPI backend

### Services
- **MLflow server** → `http://13.36.24.137:5000` (managed via `systemd`, auto-restart).
- **FastAPI backend** (Emani) → will run on port `8000` inside Docker.
- **Model registry name** → `fraud-detector` (stage `Production` loaded at app startup).

## 3. Repository

- GitHub: https://github.com/SidiElvaly/mlops-project
- Protected branch: `main` (PRs only, never push directly).
- Working branches:
  - `main` — prod
  - `staging` — pre-prod / integration
  - `dev-21031` — mine (DevOps)
  - `dev-21068` — Emani (FastAPI backend)
  - `dev-24264` — Zidbih (DVC + XGBoost)
  - `dev-21016` — Khatu (frontend + README)

## 4. Conventions I follow

- Conventional commits: `feat(...)`, `fix(...)`, `chore(...)`, `docs(...)`, `ci(...)`.
- No secrets in git: `*.pem`, `params.yaml`, `.env` must stay gitignored.
- PRs into `main` only after CI passes.

## 5. Phase plan

- **Phase A** — Local env setup, notes, push dev-21031. *(in progress)*
- **Phase B** — `Dockerfile` (FastAPI) + `docker-compose.yml`.
- **Phase C** — GitHub Secrets + branch protection rules.
- **Phase D** — CI/CD workflows: `deploy.yml`, `retrain.yml`.

## 6. Useful commands (reminder)

```bash
# SSH to EC2
ssh -i ~/.ssh/mlops-key.pem ubuntu@13.36.24.137

# Check MLflow systemd unit on EC2
sudo systemctl status mlflow

# S3 listing
aws s3 ls s3://fraud-mlops-team/ --region eu-west-3
```
