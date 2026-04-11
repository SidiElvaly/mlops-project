# Projet MLOps II — Pipeline Complet

## Description du Projet
[Décrivez votre problème ML ici — ex: prédiction de prix immobilier, classification de spam, etc.]

## Membres du Groupe

| Nom | Matricule | Branche Git |
|-----|-----------|-------------|
| Étudiant 1 | 21031 | dev-21031 |
| Étudiant 2 | 21016 | dev-21016 |
| Étudiant 3 | 21068 | dev-21068 |
| Étudiant 4 | 24064 | dev-24064 |

## Architecture

```
GitHub Repository
    ├── merge → main          ├── .dvc modifié
    ▼                         ▼
GitHub Actions               GitHub Actions
Workflow 1 (Code CI)         Workflow 2 (Data CI)
→ SSH → EC2                  → SSH → EC2
→ docker rebuild             → dvc repro
→ restart API                → MLflow log
→ health check               → restart API
    │                             │
    ▼                             ▼
         AWS EC2 (t3.medium)
    ┌─────────────┬──────────────┐
    │ MLflow :5000│ Docker :8000 │
    │ (Registry)  │ (FastAPI)    │
    └──────┬──────┴──────┬───────┘
           ▼             ▼
         AWS S3 Bucket
    data/raw  data/processed
    MLflow artifacts  DVC store
```

## URLs des Services
- **MLflow UI** : http://[EC2_IP]:5000
- **API Prediction** : http://[EC2_IP]:8000
- **Interface Web** : http://[EC2_IP]:8000

## Dataset
- **Source** : [Lien du dataset original]
- **Stockage** : AWS S3 (`s3://[BUCKET_NAME]/data/raw/`)
- **Description** : [Décrire les features et la target]

## Structure du Repository

```
mlops-project/
├── .github/workflows/
│   ├── deploy.yml          # Workflow 1 : CI/CD sur merge main
│   └── retrain.yml         # Workflow 2 : Retraining sur données
├── src/
│   ├── preprocess.py       # Stage DVC : nettoyage et preprocessing
│   ├── train.py            # Stage DVC : entraînement + MLflow logging
│   ├── evaluate.py         # Stage DVC : évaluation + métriques MLflow
│   ├── register.py         # Stage DVC : enregistrement Model Registry
│   └── app.py              # API FastAPI + chargement modèle MLflow
├── frontend/
│   └── index.html          # Interface utilisateur web
├── data/                   # Données (gitignored, géré par DVC)
├── models/                 # Modèles (gitignored, géré par DVC)
├── tests/
│   └── test_api.py         # Tests de l'API
├── scripts/
│   └── setup_ec2.sh        # Script d'installation EC2
├── Dockerfile              # Conteneurisation de l'API
├── dvc.yaml                # Pipeline DVC (4 stages)
├── params.yaml             # Hyperparamètres (GITIGNORED)
├── requirements.txt        # Dépendances Python
├── .gitignore              # Exclut params.yaml et secrets
└── README.md               # Ce fichier
```

## Instructions de Déploiement

### 1. Cloner le repo
```bash
git clone https://github.com/[VOTRE_GROUPE]/mlops-project.git
cd mlops-project
```

### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 3. Configurer les variables AWS
```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

### 4. Lancer le pipeline DVC
```bash
dvc repro
```

### 5. Lancer l'API avec Docker
```bash
docker build -t mlops-api .
docker run -d -p 8000:8000 \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e MLFLOW_TRACKING_URI=http://[EC2_IP]:5000 \
  mlops-api
```

## Branches Git
- `main` — Production (protégée, merge depuis staging uniquement)
- `staging` — Intégration (merge des branches dev)
- `dev-21031`, `dev-21016`, `dev-21068`, `dev-24064` — Branche individuelle par membre

## Commandes utiles
```bash
dvc repro          # Relancer tout le pipeline
dvc push           # Pousser les données vers S3
dvc pull           # Récupérer les données depuis S3
```
