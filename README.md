# AO Interview Form with Telegram Bot Integration

This application allows you to submit form data from the AO Interview HTML page to a Telegram bot.

## Setup Instructions

### 1. Configure Telegram Bot

1. Create a bot on Telegram:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow the instructions
   - Copy the bot token you receive

2. Get your Chat ID:
   - Search for `@userinfobot` on Telegram
   - Send any message to it
   - Copy your user ID (this is your chat ID)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env` (if not already created)
2. Edit `.env` and add your credentials:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   PORT=3000
   ```

### 3. Run with Docker

#### Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

#### Option 2: Using Docker directly
```bash
# Build the image
docker build -t ao-interview-app .

# Run the container
docker run -d -p 3000:3000 --env-file .env --name ao-interview ao-interview-app
```

### 4. Run without Docker

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Fill in the form fields on the AO Interview page
3. Submit the form
4. The form data will be sent to your Telegram bot

## API Endpoint

- **POST** `/api/submit` - Submit form data to Telegram bot
  - Body: JSON object with form field names and values
  - Response: `{ success: true/false, message: "..." }`

## Files Structure

- `AO Interview.html` - The main HTML form page
- `server.js` - Express server that handles form submissions
- `form-handler.js` - Client-side JavaScript that collects and submits form data
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration
- `.env` - Environment variables (Telegram bot credentials)

## Updating and Redeploying

### Quick Update and Redeploy

After making changes to your code files (like `server.js`, `form-handler.js`, etc.), follow these steps:

```bash
# 1. Stop the current container
docker-compose down

# 2. Rebuild the image with your changes
docker-compose build

# 3. Start the container again
docker-compose up -d

# 4. Check the logs to verify it's running
docker-compose logs --tail 10
```

### One-Line Update Command

You can also do it all in one go:

```bash
docker-compose down && docker-compose build && docker-compose up -d
```

### Viewing Logs

To see what's happening in real-time:

```bash
# View recent logs
docker-compose logs --tail 20

# Follow logs in real-time
docker-compose logs -f

# View logs for a specific service
docker-compose logs ao-interview
```

### Checking Container Status

```bash
# Check if container is running
docker ps --filter "name=ao-interview"

# Check container health
curl http://localhost:3000/health
```

### Restarting Without Rebuild

If you only need to restart the container (no code changes):

```bash
docker-compose restart
```

### Force Rebuild (No Cache)

If you want to rebuild everything from scratch:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

- Make sure your `.env` file has the correct Telegram bot token and chat ID
- Check that the server is running on port 3000
- Verify that your Telegram bot token is valid
- Ensure your chat ID is correct (you can test by sending a message to your bot)
- If changes don't appear, try a full rebuild: `docker-compose build --no-cache`
- Check logs for errors: `docker-compose logs --tail 50`

