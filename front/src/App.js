import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItemDetailPage from "./pages/ItemDetails";
import AuthorizationPage from "./pages/Authorization";
import ProceedToBuy from "./pages/ProcessedToBuy";
import "./index.css"; // Ensure your custom CSS is imported
import CreateProduct from "./pages/createProduct";
import { Provider } from "react-redux";
import store from "./store/store";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./extras/protectedRoutes";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import CartPage from "./pages/Cart"; // Import the CartPage component

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          <Route path="/cart" element={<CartPage></CartPage>}></Route>
          <Route path="/success" element={<Success />} />{" "}
          <Route path="/failed" element={<Failed />} />{" "}
          {/* Main page with item cards */}
          <Route path="/signup" element={<AuthorizationPage />} />
          <Route
            path="/Dashboard"
            element={<AdminRoute component={AdminDashboard} />}
          />
          <Route
            path="/create-product"
            element={<AdminRoute component={CreateProduct} />}
          />{" "}
          {/* Add this route */}
          <Route path="/item/:id" element={<ItemDetailPage />} />{" "}
          <Route path="/proceed-to-buy" element={<ProceedToBuy />} />
          {/* Detailed item page */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
