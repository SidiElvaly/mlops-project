from pathlib import Path
import json
import joblib
import mlflow
import pandas as pd
import yaml

from sklearn.metrics import (
    average_precision_score,
    recall_score,
    precision_score,
    f1_score,
    confusion_matrix
)


def load_params():
    with open("params.yaml", "r") as f:
        return yaml.safe_load(f)


def main():
    params = load_params()

    processed_dir = Path("data/processed")
    models_dir = Path("models")

    X_test = pd.read_csv(processed_dir / "X_test.csv")
    y_test = pd.read_csv(processed_dir / "y_test.csv").squeeze()

    model = joblib.load(models_dir / "model.pkl")

    y_prob = model.predict_proba(X_test)[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)

    metrics = {
        "auc_pr": float(average_precision_score(y_test, y_prob)),
        "recall": float(recall_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
    }

    with open(models_dir / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=4)

    run_id = open(models_dir / "run_id.txt").read().strip()

    mlflow.set_tracking_uri(params["mlflow"]["tracking_uri"])

    with mlflow.start_run(run_id=run_id):
        mlflow.log_metric("auc_pr", metrics["auc_pr"])
        mlflow.log_metric("recall", metrics["recall"])
        mlflow.log_metric("precision", metrics["precision"])
        mlflow.log_metric("f1_score", metrics["f1_score"])

    print("Evaluation completed.")
    print(metrics)


if __name__ == "__main__":
    main()