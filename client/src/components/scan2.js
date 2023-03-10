import React, { useState, useEffect } from 'react';

const VirusScan2 = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

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

  useEffect(() => {
    if (scanResult?.data?.attributes?.status === 'queued' || scanResult?.data?.attributes?.status === 'in_progress') {
      const id = setInterval(async () => {
        try {
          const response = await fetch(`/api/virustotal?url=${encodeURIComponent(url)}`);
          const data = await response.json();
          setScanResult(data);
          console.log(scanResult);
        } catch (error) {
          console.error(error);
          setScanResult({ error: 'Server error' });
        }
      }, 5000);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [scanResult, url, intervalId]);
  

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
          {scanResult.data.attributes.status === 'completed' && (
            <p>Results: {JSON.stringify(scanResult)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VirusScan2;
