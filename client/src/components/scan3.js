import React, { useState, useEffect } from "react";
import PieChart from "./pie";


const VirusScan = () => {
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const [submissionTime, setSubmissionTime] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
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
    }finally {
      setIsLoading(false); // set the state variable back to false when data is fetched
    }
  };

  useEffect(() => {
    if (
      scanResult?.data?.attributes?.status === "queued" ||
      scanResult?.data?.attributes?.status === "in_progress"
    ) {
      const id = setInterval(async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/virustotal?url=${encodeURIComponent(url)}`
          );
          const data = await response.json();
          setScanResult(data);
        } catch (error) {
          console.error(error);
          setScanResult({ error: "Server error" });
        } finally {
          setIsLoading(false); // set the state variable back to false when data is fetched
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
            <img style={{height:"150px"}}src="https://vectorlogoseek.com/wp-content/uploads/2018/11/virustotal-vector-logo.png" alt="logo"></img>
          </div>
          <div >
            <label>URL to scan:</label>
          </div>
          <img style={{height:"50px"}} src="ss.png" alt="logo"></img>
          {/* need to insert  vt logo */}

          <div className="py-2">
            <input
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <button type='submit' className="btn btn-primary" >Scan</button>
      </form>
      <div >

      {url && (
        <div>
          Given URL: {url}
        </div>
      )}
      {isLoading && <div>
        Scaning...
        <div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" alt="logo"></img>
        </div>
        </div>}
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
      </div>

      {scanResult && (
        <div>
          <h2>Scan Results</h2>
          <p>Status: {scanResult.data?.attributes?.status}</p>
          {Object.values(scanResult.data.attributes.results).filter((result) => result.result === 'clean').length > Object.values(scanResult.data.attributes.results).filter((result) => result.result === 'unrated').length ?
            <p style={{ color: 'blue' }}>No security vendors flagged this URL as malicious</p> :
            <p style={{ color: 'blue' }}>Malicious</p>
          }

          {scanResult.data?.attributes?.status === "completed" && (
            <>
            <div className="py-5" style={{ display: 'flex' }}>
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
            
            </>


          )}
        </div>
      )}
      
    </div>
  );
};

export default VirusScan;
