# AO Interview Registration Application

This application provides a registration form that sends registration data to a Telegram bot via a Node.js backend server.

## Features

- Registration form (AO Interview.html) as the main index page
- Form submission sends data to Telegram bot using credentials from .env file
- Redirects to success page (AO SUCCESS.html) after successful registration

## Prerequisites

- Docker installed on your system
- Telegram Bot Token and Admin Chat ID

## Setup

### Option 1: Deploying to Coolify

1. **Configure Environment Variables in Coolify:**
   - Go to your application settings in Coolify
   - Navigate to **Environment Variables** section
   - Add the following required variables:
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token_here
     ADMIN_CHAT_ID=your_chat_id_here
     PORT=3000
     ```
   - **IMPORTANT:** These environment variables MUST be set in Coolify, otherwise registration will fail with "Server configuration error"

2. **Deploy the application:**
   - Push your code to your Git repository
   - Coolify will automatically build and deploy using the Dockerfile
   - Check the application logs to verify environment variables are set correctly

3. **Verify Deployment:**
   - Check the server logs in Coolify - you should see startup messages indicating whether environment variables are configured
   - If variables are missing, you'll see warnings in the logs

**Troubleshooting Coolify Deployment:**
- If you see "Server configuration error" when users try to register, check that `TELEGRAM_BOT_TOKEN` and `ADMIN_CHAT_ID` are set in Coolify's environment variables
- The server logs will show which variables are missing
- Make sure to restart/redeploy the application after adding environment variables

### Option 2: Using Docker Compose (Recommended for Local)

1. Make sure you have a `.env` file in the project root with the following variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ADMIN_CHAT_ID=your_chat_id_here
   PORT=3000
   ```

2. Build and run using Docker Compose:
   ```bash
   docker-compose up -d
   ```

   Or build and run in one command:
   ```bash
   docker-compose up --build -d
   ```

3. Access the application at `http://localhost:3000`

### Option 3: Using Docker directly

1. Make sure you have a `.env` file in the project root with the following variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ADMIN_CHAT_ID=your_chat_id_here
   PORT=3000
   ```

2. Build the Docker image:
   ```bash
   docker build -t ao-interview-app .
   ```

3. Run the Docker container with .env file:
   ```bash
   docker run -d -p 3000:3000 --env-file .env ao-interview-app
   ```

   Or using environment variables directly (without .env file):
   ```bash
   docker run -d -p 3000:3000 \
     -e TELEGRAM_BOT_TOKEN=your_bot_token \
     -e ADMIN_CHAT_ID=your_chat_id \
     -e PORT=3000 \
     ao-interview-app
   ```

4. Access the application at `http://localhost:3000`

**Note:** If you get a "no configuration file provided: not found" error, make sure:
- The `.env` file exists in the project root directory
- The `.env` file has the correct format (no spaces around `=`)
- You're using `--env-file .env` when running docker, or using `docker-compose up` which automatically loads .env

## Local Development

If you want to run the application locally without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Telegram bot credentials

3. Start the server:
   ```bash
   npm start
   ```

## File Structure

- `AO Interview.html` - Main registration form page (served as index)
- `AO SUCCESS.html` - Success page shown after registration
- `server.js` - Express.js backend server
- `form-handler.js` - Client-side form submission handler
- `package.json` - Node.js dependencies
- `Dockerfile` - Docker configuration
- `.env` - Environment variables (Telegram bot credentials)

## Form Fields

The registration form collects:
- First Name
- Last Name
- Email
- Phone / WhatsApp / Telegram
- AO Leader (dropdown selection)

All form data is sent to the Telegram bot when the user clicks "Register Now".

