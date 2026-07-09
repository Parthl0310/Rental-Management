import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { AuthProvider } from "./Context/Auth.context.jsx";
import { CartProvider } from "./Context/CartContext.jsx";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
)