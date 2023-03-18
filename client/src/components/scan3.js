import React, { useState, useEffect } from "react";
import PieChart from "./pie";


const VirusScan = () => {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const [submissionTime, setSubmissionTime] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/virustotal?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setScanResult(data);
      setSubmissionTime(new Date());
      setStatus(response.status);
    } catch (error) {
      console.error(error);
      setScanResult({ error: "Server error" });
    }
  };

  useEffect(() => {
    if (
      scanResult?.data?.attributes?.status === "queued" ||
      scanResult?.data?.attributes?.status === "in_progress"
    ) {
      const id = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/virustotal?url=${encodeURIComponent(url)}`
          );
          const data = await response.json();
          setScanResult(data);
        } catch (error) {
          console.error(error);
          setScanResult({ error: "Server error" });
        }
      }, 5000);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [scanResult, url, intervalId]);

  return (
    <div className="form" >
      <form onSubmit={handleSubmit}>
        <div>

          <div>
            <img src="data:image/png;base64,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" alt="Italian Trulli"></img>
          </div>
          <div className="py-1">
            <label>URL to scan:</label>

          </div>
          {/* need to insert  vt logo */}

          <div className="py-2">
            <input
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <button type='submit' className="btn btn-primary " >Scan</button>
      </form>

      {url && (
        <div>
          Given URL: {url}
        </div>
      )}
      {submissionTime && (
        <div>
          Submission Time: {submissionTime.toLocaleString()}
        </div>
      )}
      {status && (
        <div>
          Response Status: {status}
        </div>
      )}

      {scanResult && (
        <div>
          <h2>Scan Results</h2>
          <p>Status: {scanResult.data?.attributes?.status}</p>
          {Object.values(scanResult.data.attributes.results).filter((result) => result.result === 'clean').length > Object.values(scanResult.data.attributes.results).filter((result) => result.result === 'unrated').length ?
            <p style={{ color: 'blue' }}>No security vendors flagged this URL as malicious</p> :
            <p style={{ color: 'blue' }}>Malicious</p>
          }

          {scanResult.data?.attributes?.status === "completed" && (
            <div style={{ display: 'flex' }}>
              <PieChart data={scanResult.data.attributes.results} />
              <div style={{ flex: '1', paddingRight: '20px' }}>
                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                  <tbody>
                    {Object.keys(scanResult.data.attributes.results).slice(0, Math.ceil(Object.keys(scanResult.data.attributes.results).length / 2)).map((key) => (
                      <tr key={key}>
                        <td style={{ border: '1px solid black', padding: '5px 10px' }}>{key}</td>
                        <td style={{ border: '1px solid black', padding: '5px 10px' }}>
                          {scanResult.data.attributes.results[key].result === 'unrated' ? "unrated ?" : `${scanResult.data.attributes.results[key].result} 
                          ${scanResult.data.attributes.results[key].result === 'clean' && '✓'}`}
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ flex: '1', paddingLeft: '20px' }}>
                <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                  <tbody>
                    {Object.keys(scanResult.data.attributes.results).slice(Math.ceil(Object.keys(scanResult.data.attributes.results).length / 2)).map((key) => (
                      <tr key={key}>
                        <td style={{ border: '1px solid black', padding: '5px 10px' }}>{key}</td>
                        <td style={{ border: '1px solid black', padding: '5px 10px' }}>
                          {scanResult.data.attributes.results[key].result === 'unrated' ? "unrated ?" : `${scanResult.data.attributes.results[key].result} 
                          ${scanResult.data.attributes.results[key].result === 'clean' && '✓'}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>


          )}
        </div>
      )}
    </div>
  );
};

export default VirusScan;
