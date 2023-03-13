const express = require("express");

// const fetch = require('node-fetch');


let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});


const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

// // Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api/virustotal', async (req, res) => {
  const url = req.query.url;
  const API_KEY = 'ee9a95de89da158a7983bfe95d3f54d5027a0f951d4b16ab0438bb04e25285f6';

  const options = {
    method: 'POST',
    headers: {
      'x-apikey': API_KEY,
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ url })
  };

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/urls?url=${url}`, options);
    const data = await response.json();
    const analysisId = data.data.id;

    const checkScanStatus = async () => {
      const statusResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          'x-apikey': API_KEY,
          accept: 'application/json'
        }
      });
      const statusData = await statusResponse.json();
      if (statusData.data.attributes.status === 'completed') {
        res.json(statusData);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkScanStatus, 5000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// // All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});