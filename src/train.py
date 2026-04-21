from pathlib import Path

import joblib
import mlflow
import mlflow.xgboost
import pandas as pd
import yaml
from xgboost import XGBClassifier


def load_params(path: str = "params.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def main() -> None:
    params = load_params()

    tracking_uri = params["mlflow"]["tracking_uri"]
    experiment_name = params["mlflow"]["experiment_name"]
    processed_dir = Path(params["data"]["processed_dir"])
    models_dir = Path("models")

    models_dir.mkdir(parents=True, exist_ok=True)

    X_train = pd.read_csv(processed_dir / "X_train.csv")
    y_train = pd.read_csv(processed_dir / "y_train.csv").squeeze("columns")

    negative_count = (y_train == 0).sum()
    positive_count = (y_train == 1).sum()
    scale_pos_weight = negative_count / positive_count

    model_params = {
        "n_estimators": params["model"]["n_estimators"],
        "max_depth": params["model"]["max_depth"],
        "learning_rate": params["model"]["learning_rate"],
        "subsample": params["model"]["subsample"],
        "colsample_bytree": params["model"]["colsample_bytree"],
        "scale_pos_weight": scale_pos_weight,
        "random_state": params["data"]["random_state"],
        "eval_metric": "logloss",
    }

    mlflow.set_tracking_uri(tracking_uri)
    mlflow.set_experiment(experiment_name)

    with mlflow.start_run(run_name="xgboost-training") as run:
        model = XGBClassifier(**model_params)
        model.fit(X_train, y_train)

        joblib.dump(model, models_dir / "model.pkl")

        mlflow.log_params(model_params)
        mlflow.xgboost.log_model(model, artifact_path="model")

        with open(models_dir / "run_id.txt", "w", encoding="utf-8") as file:
            file.write(run.info.run_id)

        print("Training completed successfully.")
        print(f"Run ID: {run.info.run_id}")
        print(f"scale_pos_weight: {scale_pos_weight:.4f}")


if __name__ == "__main__":
    main()