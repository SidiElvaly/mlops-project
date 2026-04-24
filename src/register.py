from pathlib import Path
import json
import time
import yaml
import mlflow
from mlflow.tracking import MlflowClient


def load_params(path: str = "params.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def main() -> None:
    params = load_params()

    tracking_uri = params["mlflow"]["tracking_uri"]
    registered_model_name = params["mlflow"]["registered_model_name"]
    auc_pr_min = params["thresholds"]["auc_pr_min"]

    models_dir = Path("models")

    with open(models_dir / "metrics.json", "r", encoding="utf-8") as file:
        metrics = json.load(file)

    auc_pr = metrics["auc_pr"]

    if auc_pr <= auc_pr_min:
        print(f"Model not registered. auc_pr={auc_pr:.4f} <= threshold={auc_pr_min:.4f}")
        return

    with open(models_dir / "run_id.txt", "r", encoding="utf-8") as file:
        run_id = file.read().strip()

    mlflow.set_tracking_uri(tracking_uri)
    client = MlflowClient(tracking_uri=tracking_uri)

    model_uri = f"runs:/{run_id}/model"

    registered_model = mlflow.register_model(
        model_uri=model_uri,
        name=registered_model_name,
    )

    version = registered_model.version

    for _ in range(20):
        model_version = client.get_model_version(
            name=registered_model_name,
            version=version,
        )

        if model_version.status == "READY":
            break

        time.sleep(1)

    client.transition_model_version_stage(
        name=registered_model_name,
        version=version,
        stage="Production",
        archive_existing_versions=True,
    )

    print("Model registered successfully.")
    print(f"Model name: {registered_model_name}")
    print(f"Version: {version}")
    print("Stage: Production")


if __name__ == "__main__":
    main()