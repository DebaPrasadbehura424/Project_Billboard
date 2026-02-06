from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from easyocr import Reader
import cv2
import os
import joblib

app = Flask(__name__)
CORS(app)

# Load YOLO + OCR
model = YOLO("yolov8n.pt")
reader = Reader(['en'], gpu=False)

# Load ML models (joblib)
risk_level_model = joblib.load("risk_level_model.pkl")
risk_percentage_model = joblib.load("risk_percentage_model.pkl")

@app.post("/image_detection")
def imageDetection():

    print("FILES:", request.files)
    print("FORM:", request.form.get("description"))

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    description = request.form.get("description", "")

    img_path = "uploaded_temp.jpg"
    file.save(img_path)

    # YOLO detection
    results = model(img_path)
    detected_objects = [model.names[int(box.cls)] for box in results[0].boxes]

    # OCR text
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text_detected = " ".join(reader.readtext(gray, detail=0, paragraph=True))

    os.remove(img_path)

    # Prepare input for ML model
    combined_text = f"{description} {detected_objects} {text_detected}"

    # Predict
    predicted_level = risk_level_model.predict([combined_text])[0]
    predicted_percentage = risk_percentage_model.predict([combined_text])[0]

    return jsonify({
        "detected_objects": detected_objects,
        "text_detected": text_detected,
        "risk_level": predicted_level,
        "risk_percentage": int(predicted_percentage)
    })

if __name__ == "__main__":
    app.run(port=5001)
