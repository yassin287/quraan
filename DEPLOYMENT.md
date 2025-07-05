# GitHub Deployment Commands

## Step 1: Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Complete Quran Platform with advanced features"
```

## Step 2: Connect to GitHub Repository
```bash
git remote add origin https://github.com/yassin287/quraan.git
git branch -M main
git push -u origin main
```

## Step 3: Setup GitHub Pages (Static Version)
For GitHub Pages, you'll need to create a static version since GitHub Pages doesn't support Node.js directly.

### Option A: Create a Static Build (Recommended)
Create a new file `build-static.js` in your project root:

```javascript
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const request = require('request');

// Create build directory
if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
}

// Copy static assets
fs.copyFileSync('public/style.css', 'docs/style.css');
fs.copyFileSync('public/bootstrap.min.css', 'docs/bootstrap.min.css');
fs.copyFileSync('public/bootstrap.min.js', 'docs/bootstrap.min.js');
// Copy other assets...

// Build static HTML files
// This would require building static versions of your pages
```

### Option B: Use a Static Site Generator
Convert your EJS templates to static HTML files.

### Option C: Deploy to Netlify/Vercel (Easier)
These platforms support Node.js applications better than GitHub Pages.

## Step 4: Alternative - Deploy to Heroku
```bash
# Install Heroku CLI first
heroku create your-app-name
git push heroku main
heroku open
```

## Step 5: GitHub Pages Setup (if using static version)
1. Go to your repository settings
2. Scroll to "Pages" section
3. Choose "Deploy from a branch"
4. Select "main" branch and "docs" folder
5. Save

Your site will be available at: https://yassin287.github.io/quraan
```
