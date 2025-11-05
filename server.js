const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// Load environment variables from .env file if it exists
if (fs.existsSync('.env')) {
  require('dotenv').config();
} else {
  console.log('Note: .env file not found. Using environment variables from system or Docker.');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve index page (AO Interview.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'AO Interview.html'));
});

// Handle form submission
app.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    
    console.log('=== RECEIVED REGISTRATION DATA ===');
    console.log('firstName:', formData.firstName);
    console.log('lastName:', formData.lastName);
    console.log('email:', formData.email);
    console.log('phone:', formData.phone);
    console.log('ao_leader:', formData.ao_leader);
    console.log('Full data:', JSON.stringify(formData, null, 2));
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.ao_leader) {
      console.error('Missing required fields:', {
        firstName: !!formData.firstName,
        lastName: !!formData.lastName,
        email: !!formData.email,
        phone: !!formData.phone,
        ao_leader: !!formData.ao_leader
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Format the message for Telegram
    let message = '📋 *New Registration*\n\n';
    message += `*First Name:* ${formData.firstName}\n`;
    message += `*Last Name:* ${formData.lastName}\n`;
    message += `*Email:* ${formData.email}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*AO Leader:* ${formData.ao_leader}\n`;
    
    // Also include any other fields that might be present
    for (const [key, value] of Object.entries(formData)) {
      if (value && !['firstName', 'lastName', 'email', 'phone', 'ao_leader'].includes(key)) {
        message += `*${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:* ${value}\n`;
      }
    }
    
    console.log('Telegram message:', message);
    
    // Send to Telegram bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials in .env file');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
      const telegramResponse = await axios.post(telegramUrl, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      });
      console.log('Message sent to Telegram successfully:', telegramResponse.data);
    } catch (telegramError) {
      console.error('Error sending message to Telegram:', telegramError.response?.data || telegramError.message);
      return res.status(500).json({ error: 'Failed to send registration data to Telegram' });
    }
    
    // Send success response
    res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error processing registration:', error);
    res.status(500).json({ error: 'Failed to process registration' });
  }
});

// Serve success page
app.get('/success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'AO SUCCESS.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

