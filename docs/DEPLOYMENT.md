# Deployment Guide - GitHub Pages

This guide will help you deploy your Cheatsheet Editor to GitHub Pages.

## Prerequisites

- Git installed on your computer
- A GitHub account
- Your project code ready

## Step 1: Prepare Your Project for Deployment

### 1.1 Update vite.config.js

First, update your `vite.config.js` to set the correct base path for GitHub Pages.

Replace the current content with:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cheatsheet/', // Replace 'cheatsheet' with your repository name
})
```

**Important**: Replace `cheatsheet` with your actual GitHub repository name.

## Step 2: Create a GitHub Repository

### Option A: Using GitHub Website

1. Go to https://github.com
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `cheatsheet` (or your preferred name)
   - **Description**: "A markdown-based cheatsheet editor with multi-column layouts"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
5. Click **Create repository**

### Option B: Using GitHub CLI

```bash
gh repo create cheatsheet --public --source=. --remote=origin
```

## Step 3: Initialize Git and Push to GitHub

### 3.1 Initialize Git (if not already done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### 3.2 Create .gitignore

Create a `.gitignore` file if it doesn't exist:

```bash
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
EOF
```

### 3.3 Add Remote and Push

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Cheatsheet Editor"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

### Method 1: GitHub Actions (Recommended)

This method automatically deploys your site whenever you push changes.

#### 4.1 Create GitHub Actions Workflow

Create the directory and file:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 4.2 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

#### 4.3 Push the Workflow

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push
```

The deployment will start automatically! Check the **Actions** tab to see progress.

---

### Method 2: Using gh-pages Package (Alternative)

#### 4.1 Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### 4.2 Add Deploy Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4.3 Deploy

```bash
npm run deploy
```

#### 4.4 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Click **Save**

---

## Step 5: Access Your Deployed Site

After deployment completes (2-5 minutes):

**Your site will be live at:**
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

For example:
```
https://johndoe.github.io/cheatsheet/
```

## Step 6: Update Your Site

Whenever you make changes:

### Using GitHub Actions (Method 1)
```bash
git add .
git commit -m "Description of changes"
git push
```
The site will automatically rebuild and redeploy!

### Using gh-pages (Method 2)
```bash
git add .
git commit -m "Description of changes"
git push
npm run deploy
```

## Troubleshooting

### Issue: Blank page or 404 errors

**Solution**: Check that the `base` in `vite.config.js` matches your repository name:
```javascript
base: '/your-repo-name/'
```

### Issue: Assets not loading (CSS, JS)

**Solution**: Make sure `base` is set correctly and rebuild:
```bash
npm run build
npm run deploy  # or push if using GitHub Actions
```

### Issue: GitHub Actions deployment failing

**Solution**:
1. Check the Actions tab for error messages
2. Ensure GitHub Pages is set to "GitHub Actions" in Settings > Pages
3. Verify your workflow file syntax

### Issue: Changes not showing up

**Solution**:
1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the deployment succeeded in the Actions tab
3. Wait a few minutes for GitHub Pages to update

## Custom Domain (Optional)

To use a custom domain like `cheatsheet.yourdomain.com`:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS with your domain provider
3. Enable HTTPS in GitHub Pages settings

## Summary

- ✅ Code pushed to GitHub
- ✅ GitHub Actions configured (or gh-pages installed)
- ✅ Site deployed to GitHub Pages
- ✅ Accessible at `https://username.github.io/repo-name/`

Your cheatsheet editor is now live and accessible to anyone on the internet!

## Additional Tips

1. **Branch Protection**: Consider protecting your main branch in Settings > Branches
2. **README**: Update your README.md with a link to the live site
3. **Description**: Add topics/tags to your repo for discoverability
4. **License**: Consider adding a license file (MIT is common for open source)
