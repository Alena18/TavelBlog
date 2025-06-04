import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FaCheck, FaTimes, FaSearch, FaCamera } from "react-icons/fa";

export default function ReceiptUploadModal({
  isOpen,
  onRequestClose,
  planId,
  refreshReceipts,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedAmount, setExtractedAmount] = useState("");
  const [category, setCategory] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtract = async (inputImage) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(inputImage, "eng");
      const text = result.data.text;
      console.log("OCR text:", text);

      const lines = text.split("\n");
      let totalAmount = null;

      // Step 1: Look for custom keywords
      const keywordPattern = /(total|payment card|sale)/i;

      for (let line of lines) {
        if (keywordPattern.test(line)) {
          const numMatch = line.match(/(\d+[\.,]?\d*)/g);
          if (numMatch) {
            const lastNumber = numMatch[numMatch.length - 1];
            totalAmount = parseFloat(lastNumber.replace(",", "."));
            console.log("Matched by keyword line:", line, "→", totalAmount);
            break;
          }
        }
      }

      // Step 2: Fallback — largest reasonable number
      if (!totalAmount) {
        const allMatches = text.match(/(\d+[\.,]?\d*)/g);
        if (allMatches && allMatches.length > 0) {
          const amounts = allMatches
            .map((n) => parseFloat(n.replace(",", ".")))
            .filter((n) => !isNaN(n) && n < 10000); // skip crazy OCR noise

          if (amounts.length > 0) {
            const maxAmount = Math.max(...amounts);
            totalAmount = maxAmount;
            console.log("Matched by fallback max:", maxAmount);
          }
        }
      }

      if (totalAmount) {
        setExtractedAmount(totalAmount);
      } else {
        alert("No valid amount detected.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during extraction.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error(err);
      alert("Failed to access camera.");
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      handleExtract(blob);
    }, "image/png");
  };

  const handleSave = async () => {
    if (!planId) {
      alert("No plan selected. Please try again.");
      console.error("Missing planId");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      console.error("Missing category");
      return;
    }
    if (!extractedAmount || isNaN(extractedAmount)) {
      alert("Please extract a valid amount.");
      console.error("Invalid amount");
      return;
    }

    try {
      await addDoc(collection(db, "receipts"), {
        planId,
        category: capitalizeWords(category), // apply capitalizeWords before save
        amount: extractedAmount,
        date: new Date().toISOString(),
      });
      refreshReceipts();
      onRequestClose();
    } catch (err) {
      console.error("Failed to save receipt:", err);
      alert("Failed to save receipt.");
    }
  };

  return (
    <div className="modal-overlay">
      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <h3>Upload & Scan Receipt</h3>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          type="button"
          onClick={() => handleExtract(file)}
          disabled={loading || !file}
        >
          <FaSearch style={{ marginRight: "5px" }} />
          {loading ? "Extracting..." : "Extract from File"}
        </button>

        <button type="button" onClick={handleStartCamera}>
          <FaCamera style={{ marginRight: "5px" }} />
          Scan with Camera
        </button>

        {showCamera && (
          <div>
            <video
              ref={videoRef}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <button type="button" onClick={handleCapturePhoto}>
              Capture & Extract
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {extractedAmount && <p>Detected Amount: €{extractedAmount}</p>}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="shopping">Shopping</option>
          <option value="attractions">Attractions</option>
          <option value="transport">Transport</option>
        </select>

        <div className="modal-actions">
          <button type="submit" title="Save">
            <FaCheck />
          </button>
          <button type="button" title="Cancel" onClick={onRequestClose}>
            <FaTimes />
          </button>
        </div>
      </form>
    </div>
  );
}
