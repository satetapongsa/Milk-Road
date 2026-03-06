# Deploy Shopii to Vercel and GitHub

This guide will help you push your code to GitHub and deploy the site live with Vercel.

## 1. Deploy to Vercel (Live Website)

Vercel is the easiest way to deploy React apps. We have installed the Vercel CLI for you.

1.  **Open a terminal** in this project folder (`c:\Users\acer\Desktop\shopii`).
2.  Run the following command:
    ```bash
    npm run deploy
    ```
3.  Follow the interactive prompts:
    -   **Log in to Vercel**: Choose "Continue with GitHub" or "Email". It will open your browser to log in.
    -   **Set up and deploy**: Press `Enter` (Yes).
    -   **Scope**: Select your personal account (Press `Enter`).
    -   **Link to existing project**: Press `N` (No).
    -   **Project Name**: Press `Enter` (Use 'shopii').
    -   **Directory**: Press `Enter` (Current directory `./`).
    -   **Build Settings**: Press `Enter` (Override? No, use defaults).

Once finished, it will give you a **Production URL** (e.g., `https://shopii-yourname.vercel.app`).

---

## 2. Push to GitHub (Source Code)

To save your code history online:

1.  **Create a new repository** on GitHub: [https://github.ne/new](https://github.com/new).
    -   Name it `shopii`.
    -   Do **not** initialize with README/gitignore (we already have them).
2.  **Link your local project**:
    -   Copy the commands under "…or push an existing repository from the command line". It looks like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/shopii.git
    git branch -M main
    git push -u origin main
    ```
3.  **Run those commands** in your terminal.

## Updates

When you make changes later:

1.  **Save changes**:
    ```bash
    git add .
    git commit -m "Describe your changes"
    ```
2.  **Update GitHub**:
    ```bash
    git push
    ```
3.  **Update Vercel**:
    ```bash
    npm run deploy -- --prod
    ```
