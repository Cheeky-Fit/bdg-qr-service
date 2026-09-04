const express = require('express');
const QRCode = require('qrcode');

const app = express();
// Use PORT provided by Render, or 3000 for local development
const port = process.env.PORT || 3000;

// The target URL for the QR code
const TARGET_URL = 'https://www.blankenshipdrygoods.com/';

// The main endpoint to get the QR code image
app.get('/qr', async (req, res) => {
  try {
    const buffer = await QRCode.toBuffer(TARGET_URL, {
      type: 'png',
      width: 500,
      margin: 2,
      color: {
        dark: '#000000', // Black dots
        light: '#ffffff' // White background
      }
    });

    res.type('png');
    // Cache the image for 1 day since the destination is static
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// A simple landing page to preview the QR code
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BDG QR Service</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            margin: 0; 
            background-color: #f5f5f5; 
            color: #333;
          }
          .container { 
            text-align: center; 
            background: white; 
            padding: 2rem 3rem; 
            border-radius: 12px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
            max-width: 90%;
          }
          h1 { margin-top: 0; font-size: 1.5rem; }
          .qr-container {
            margin: 1.5rem 0;
            padding: 1rem;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            display: inline-block;
          }
          img { max-width: 100%; height: auto; }
          .url-bar {
            background: #f8f9fa;
            padding: 0.75rem;
            border-radius: 6px;
            font-family: monospace;
            font-size: 0.9rem;
            color: #555;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Blankenship Dry Goods</h1>
          <p>Official QR Code Service</p>
          <div class="qr-container">
            <img src="/qr" alt="BDG QR Code" />
          </div>
          <p>Redirects to:</p>
          <div class="url-bar">${TARGET_URL}</div>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint for Render zero-downtime deploys
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`QR service listening at http://localhost:${port}`);
});
