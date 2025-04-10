
import React, { useState } from "react";
import QRCodeScanner from "react-qr-scanner";

function QRCodeScan() {
    const [scanResult, setScanResult] = useState(null);
   
    const handleScan = (data) => {
        
        if (data) {
          setScanResult(data); // Store the scanned QR code result
          alert(data)
        }
      };
    
      const handleError = (err) => {
        console.error(err); // Handle errors
      };
    
      return (
        <div>
          <h1>QR Code Scanner</h1>
          <QRCodeScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
          {scanResult && (
            <div>
              <h2>Scanned QR Code Data:</h2>
              <p>{scanResult}</p>
            </div>
          )}
        </div>
      );
}

export default QRCodeScan;