import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib

# Load CSV
df = pd.read_csv("risk_training_data.csv")
df = df.fillna("")
# Combine text fields
df["combined"] = (
    df["description"].astype(str) + " " +
    df["objects_detected"].astype(str) + " " +
    df["text_detected"].astype(str)
)

X = df["combined"]
y_level = df["risk_level"]
y_percentage = df["risk_percentage"]

# Split
X_train, X_test, y_train_lvl, y_test_lvl = train_test_split(
    X, y_level, test_size=0.30, random_state=42
)

_, _, y_train_pct, y_test_pct = train_test_split(
    X, y_percentage, test_size=0.30, random_state=42
)

# Pipeline
risk_level_model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("rf", RandomForestClassifier())
])

risk_percentage_model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("rf", RandomForestClassifier())
])

# Train models
risk_level_model.fit(X_train, y_train_lvl)
risk_percentage_model.fit(X_train, y_train_pct)

# Save models with JOBLIB
joblib.dump(risk_level_model, "risk_level_model.pkl")
joblib.dump(risk_percentage_model, "risk_percentage_model.pkl")

print("Models trained and saved using joblib!")
