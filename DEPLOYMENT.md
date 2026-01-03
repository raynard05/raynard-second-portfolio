# Cloudflare Pages Deployment Guide

## Quick Setup Commands

Since PowerShell script execution is restricted, run these commands in **Command Prompt (CMD)** or **Git Bash**:

```bash
# 1. Install Wrangler CLI
npm install -D wrangler

# 2. Login to Cloudflare (opens browser)
npx wrangler login

# 3. Build your site for production
npm run pages:build

# 4. Deploy to Cloudflare Pages
npm run pages:deploy
```

## Alternative: Deploy via Cloudflare Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Cloudflare Pages deployment"
   git push
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Create application** → **Pages**
   - Click **Connect to Git**
   - Select your repository: `raynard-second-portfolio`

3. **Configure Build Settings**:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (leave default)
   - Click **Save and Deploy**

4. **Automatic Deployments**:
   - Every push to `main` branch will automatically trigger a new deployment
   - Preview deployments for pull requests

## Configuration Files Created

- ✅ `wrangler.toml` - Cloudflare Pages configuration
- ✅ `next.config.ts` - Static export settings
- ✅ `package.json` - Deployment scripts added
- ✅ `.gitignore` - Wrangler cache excluded

## Build Configuration

Your Next.js app is now configured for static export:
- **Output mode**: Static HTML/CSS/JS
- **Output directory**: `out/`
- **Images**: Unoptimized (compatible with static hosting)
- **Trailing slashes**: Enabled for better routing

## Troubleshooting

**PowerShell Execution Policy Error**:
- Use Command Prompt (CMD) instead
- Or run in Git Bash
- Or use Cloudflare Dashboard deployment (recommended)

**Build Errors**:
- Ensure all dependencies are installed: `npm install`
- Check that Spline URLs are accessible
- Verify no server-side features (API routes, SSR) are used
