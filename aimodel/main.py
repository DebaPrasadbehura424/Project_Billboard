from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from easyocr import Reader
import cv2
import os

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8n.pt")
reader = Reader(['en'], gpu=False)

@app.post("/image_detection")
def imageDetection():
    print(request.files)

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img_path = "uploaded_image.jpg"
    file.save(img_path)

    results = model(img_path)
    detected = []

    for box in results[0].boxes:
        cls_id = int(box.cls)
        detected.append(model.names[cls_id])

    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = reader.readtext(gray, detail=0, paragraph=True)

    os.remove(img_path)

    return jsonify({
        "detected_objects": detected,
        "detected_texts": text
    })


if __name__ == "__main__":
    app.run(port=5001)
