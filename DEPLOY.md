# Quick Deployment Guide

## Update and Redeploy Commands

### Standard Update (After Code Changes)

```powershell
# Stop, rebuild, and restart
docker-compose down
docker-compose build
docker-compose up -d

# Check status
docker-compose logs --tail 10
```

### One-Line Update

```powershell
docker-compose down && docker-compose build && docker-compose up -d
```

### Quick Restart (No Code Changes)

```powershell
docker-compose restart
```

### View Logs

```powershell
# Recent logs
docker-compose logs --tail 20

# Follow logs
docker-compose logs -f
```

### Check Status

```powershell
# Container status
docker ps --filter "name=ao-interview"

# Health check
curl http://localhost:3000/health
```

### Force Full Rebuild

```powershell
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Common Workflow

1. **Make changes** to your code files
2. **Run update command**: `docker-compose down && docker-compose build && docker-compose up -d`
3. **Check logs**: `docker-compose logs --tail 10`
4. **Test**: Open `http://localhost:3000` in your browser

## Files That Require Rebuild

These files require a rebuild when changed:
- `server.js`
- `form-handler.js`
- `package.json`
- `Dockerfile`
- `docker-compose.yml`

## Files That Don't Require Rebuild

These files are served statically (but still require restart):
- `AO Interview.html` (served dynamically with script injection)

