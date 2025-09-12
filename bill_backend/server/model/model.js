import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import decode from "image-decode";

let model;

// Load MobileNet once
export async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
    console.log("✅ MobileNet model loaded");
  }
  return model;
}

// Convert buffer -> tensor
export async function classifyImage(buffer) {
  if (!model) {
    await loadModel();
  }

  // Decode image (gives Uint8Array, width, height)
  const img = decode(buffer);

  // Build tensor
  const tensor = tf.tensor3d(img.data, [img.height, img.width, 4]); // 4 channels (RGBA)

  // Drop alpha → [h, w, 3]
  const rgb = tf.slice(tensor, [0, 0, 0], [-1, -1, 3]);

  // Resize → [224,224,3] and normalize
  const resized = tf.image
    .resizeBilinear(rgb, [224, 224])
    .div(255)
    .expandDims(0);

  // Predict
  const predictions = await model.classify(resized);

  // Clean memory
  tensor.dispose();
  rgb.dispose();
  resized.dispose();

  return predictions;
}
