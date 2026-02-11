# Shopii Enterprise Architecture Diagrams

## 1. Application Structure (User Interaction Flow)
This diagram shows how the user interacts with the main components of the application and how data flows between them.

```mermaid
graph TD
    User((User))
    
    subgraph "UI Components (Frontend)"
        Nav[Navigation Bar]
        Hero[Hero Banner]
        ProductList[Product Grid]
        CartDrawer[Cart Sidebar]
        CheckoutModal[Checkout Alert]
    end

    subgraph "Logic & State (JavaScript)"
        ProductDB[(Mock Product Data)]
        CartState[(Cart Array)]
        Logic[Business Logic]
    end

    %% Initialization
    ProductDB -->|Load Data| ProductList
    
    %% Interactions
    User -->|1. Visit Website| Nav
    User -->|2. View Promotions| Hero
    User -->|3. Browse Items| ProductList
    
    %% Buying Flow
    User -->|4. Click 'Add to Cart'| ProductList
    ProductList -->|Trigger| Logic
    Logic -->|Update| CartState
    CartState -->|Sync| CartDrawer
    
    %% Cart Management
    User -->|5. View Cart| CartDrawer
    User -->|6. Adjust Quantity| CartDrawer
    CartDrawer -->|Update| CartState
    
    %% Checkout
    User -->|7. Proceed to Checkout| CartDrawer
    CartDrawer -->|Validate| Logic
    Logic -->|Success| CheckoutModal
```

## 2. Add to Cart Logic (Sequence Diagram)
This details the specific steps that happen when a user adds an item to their cart.

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant View as Interface (HTML)
    participant Controller as Script.js
    participant Data as Cart State

    User->>View: Click "Add to Cart" Button
    View->>Controller: Call addToCart(productId)
    
    Controller->>Data: Find Product in MockDB
    Controller->>Data: Check if Item exists in Cart
    
    alt Item Exists
        Data->>Data: Increment Quantity (+1)
    else New Item
        Data->>Data: Push new Object to Array
    end
    
    Controller->>Controller: Calculate Totals (Qty * Price)
    Controller->>View: Re-render Cart HTML
    Controller->>View: Update Badge Count
    Controller->>View: Slide Open Cart Drawer
    
    View-->>User: Display Updated Cart
```

## 3. Class/Data Structure
The shape of the data objects used in the application.

```mermaid
classDiagram
    class Product {
        +int id
        +string name
        +string category
        +float price
        +string image
        +string description
    }

    class CartItem {
        +int id
        +string name
        +float price
        +int quantity
        +float total()
    }

    class AppState {
        +Product[] products
        +CartItem[] cart
        +addToCart(id)
        +removeFromCart(id)
        +updateQuantity(id, amt)
        +checkout()
    }

    AppState *-- Product : contains
    AppState *-- CartItem : manages
```
