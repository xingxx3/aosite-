const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inject script tag into HTML file when serving
app.get('*.html', (req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return next();
  }
  
  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    
    // Check if script tag already exists
    if (data.includes('form-handler.js')) {
      return res.send(data);
    }
    
    // Inject script tag before closing body or html tag, or at the end
    let modifiedData = data;
    
    // Try to inject before </body>
    if (modifiedData.includes('</body>')) {
      modifiedData = modifiedData.replace('</body>', '<script src="/form-handler.js"></script></body>');
    } else if (modifiedData.includes('</html>')) {
      modifiedData = modifiedData.replace('</html>', '<script src="/form-handler.js"></script></html>');
    } else {
      // If no closing tags found, append at the end
      modifiedData += '<script src="/form-handler.js"></script>';
    }
    
    res.send(modifiedData);
  });
});

// Default route - serve the main HTML file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'AO Interview.html');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('HTML file not found');
  }
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    
    // Check if script tag already exists
    if (data.includes('form-handler.js')) {
      return res.send(data);
    }
    
    // Inject script tags with cache-busting version
    const version = Date.now(); // Use timestamp to force cache refresh
    let modifiedData = data;
    const scripts = `<script src="/override-multiselect.js?v=${version}"></script><script src="/form-handler.js?v=${version}"></script>`;
    if (modifiedData.includes('</body>')) {
      modifiedData = modifiedData.replace('</body>', `${scripts}</body>`);
    } else if (modifiedData.includes('</html>')) {
      modifiedData = modifiedData.replace('</html>', `${scripts}</html>`);
    } else {
      modifiedData += scripts;
    }
    
    res.send(modifiedData);
  });
});

// Serve static files (JS, CSS, images, etc.) with no-cache headers
app.use(express.static('.', {
  setHeaders: (res, path) => {
    // Disable caching for JavaScript files to ensure updates are loaded
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Function to send message to Telegram
async function sendToTelegram(data) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram bot token or chat ID not configured');
  }

  // Format the message
  let message = '📋 *New Form Submission*\n\n';
  
  // Add all form fields to the message
  for (const [key, value] of Object.entries(data)) {
    if (value && value.toString().trim() !== '') {
      // Format field name (replace underscores/hyphens with spaces, capitalize)
      const fieldName = key
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      message += `*${fieldName}:* ${value}\n`;
    }
  }

  // Add timestamp
  message += `\n_Submitted at: ${new Date().toLocaleString()}_`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to Telegram:', error.response?.data || error.message);
    throw error;
  }
}

// API endpoint to handle form submissions
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate that we have data
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No form data provided' 
      });
    }

    // Send to Telegram
    await sendToTelegram(formData);

    res.json({ 
      success: true, 
      message: 'Form submitted successfully and sent to Telegram!' 
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit form' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Telegram Bot Token: ${TELEGRAM_BOT_TOKEN ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`Telegram Chat ID: ${TELEGRAM_CHAT_ID ? 'Configured' : 'NOT CONFIGURED'}`);
});

