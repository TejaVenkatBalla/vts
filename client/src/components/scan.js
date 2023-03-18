import React, { useState, useEffect } from "react";

const VirusScan = () => {
    const [url, setUrl] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                    <div className="py-2">
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
            {scanResult && (
                <div>
                    <h2>Scan Results</h2>
                    <p>Status: {scanResult.data?.attributes?.status}</p>
                    {scanResult.data?.attributes?.status === "completed" && (
                        <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1', paddingRight: '20px' }}>
                          {Object.keys(scanResult.data.attributes.results).slice(0, Math.ceil(Object.keys(scanResult.data.attributes.results).length / 2)).map((key) => (
                            <div key={key}>
                              <span style={{ display: 'inline-block', width: '250px', paddingRight: '30px' }}>{key}</span>
                              <span style={{ paddingLeft: '10px' }}>{scanResult.data.attributes.results[key].result === 'unrated' ? "unrated ?" : `${scanResult.data.attributes.results[key].result} ${scanResult.data.attributes.results[key].result === 'clean' && '✓'}`}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: '1', paddingLeft: '20px' }}>
                          {Object.keys(scanResult.data.attributes.results).slice(Math.ceil(Object.keys(scanResult.data.attributes.results).length / 2)).map((key) => (
                            <div key={key}>
                              <span style={{ display: 'inline-block', width: '250px', paddingRight: '30px' }}>{key}</span>
                              <span style={{ paddingLeft: '10px' }}>{scanResult.data.attributes.results[key].result === 'unrated' ? "unrated ?" : `${scanResult.data.attributes.results[key].result} ${scanResult.data.attributes.results[key].result === 'clean' && '✓'}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                    )}
                </div>
            )}
        </div>
    );
};

export default VirusScan;
