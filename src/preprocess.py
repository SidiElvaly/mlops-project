from pathlib import Path
import joblib
import pandas as pd
import yaml

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


def load_params(path: str = "params.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def main() -> None:
    params = load_params()

    raw_path = params["data"]["raw_path"]
    processed_dir = Path(params["data"]["processed_dir"])
    target_col = params["data"]["target"]
    test_size = params["data"]["test_size"]
    random_state = params["data"]["random_state"]

    models_dir = Path("models")
    processed_dir.mkdir(parents=True, exist_ok=True)
    models_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(raw_path)

    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    scaler = StandardScaler()

    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=X.columns
    )

    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=X.columns
    )

    X_train_scaled.to_csv(processed_dir / "X_train.csv", index=False)
    X_test_scaled.to_csv(processed_dir / "X_test.csv", index=False)
    y_train.to_csv(processed_dir / "y_train.csv", index=False)
    y_test.to_csv(processed_dir / "y_test.csv", index=False)

    joblib.dump(scaler, models_dir / "scaler.pkl")

    print("Preprocessing completed successfully.")
    print(f"X_train shape: {X_train_scaled.shape}")
    print(f"X_test shape: {X_test_scaled.shape}")


if __name__ == "__main__":
    main()