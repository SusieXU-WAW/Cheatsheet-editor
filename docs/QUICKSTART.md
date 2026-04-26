# Quick Start - Deploy to GitHub Pages

Follow these steps to deploy your cheatsheet editor to GitHub Pages.

## Step 1: Update Vite Config

Edit `vite.config.js` and uncomment the base path:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/cheatsheet/', // Change 'cheatsheet' to your repo name
})
```

## Step 2: Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Cheatsheet Editor"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository (e.g., `cheatsheet`)
3. Click "Create repository"
4. **DO NOT** add README, .gitignore, or license

## Step 4: Push to GitHub

```bash
# Replace YOUR_USERNAME and REPO_NAME with your values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Wait 2-5 minutes for deployment

## Step 6: Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

## Update Your Site

To deploy changes:

```bash
git add .
git commit -m "Your changes"
git push
```

GitHub Actions will automatically rebuild and deploy!

---

For detailed instructions and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)
