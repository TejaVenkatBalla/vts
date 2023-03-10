import React, { useState } from 'react';

const VirusScan = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/virustotal?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setScanResult(data);
      console.log(scanResult);
    } catch (error) {
      console.error(error);
      setScanResult({ error: 'Server error' });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          URL to scan:
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <button type="submit">Scan</button>
      </form>
      {scanResult && (
        <div>
          <h2>Scan Results</h2>
          <p>Status: {scanResult.data.attributes.status}</p>
          
        </div>
      )}
    </div>
  );
};

export default VirusScan;
