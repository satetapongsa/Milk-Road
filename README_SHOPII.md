# Shopii Enterprise - React Migration

This project is a React migration of the Shopii web application, featuring a modern, responsive design and full e-commerce functionality.

## Features

- **Product Listing**: Browse products with search filtering.
- **Cart Management**: Add, remove, and update quantities in a dynamic sidebar cart.
- **Checkout Process**: Complete checkout with form validation and payment method selection.
- **Persistent Data**: Cart and receipt data are saved to local storage.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack

- **React**: UI library for building component-based interfaces.
- **Vite**: Next-generation frontend tooling for fast development.
- **Lucide React**: Beautiful & consistent icon pack.
- **React Router**: Client-side routing.
- **Vanilla CSS**: Custom styling with variables and modern layout techniques.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: UI components (Header, Footer, CartSidebar, Layout).
- `src/pages`: Page components (Home, Checkout, Receipt).
- `src/context`: Global state management (CartContext).
- `src/data`: Mock data and configuration.
- `src/index.css`: Global styles.

## Legacy Code

The original vanilla JS implementation can be found in the `legacy_shopii` directory.
