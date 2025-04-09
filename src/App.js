import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { BrowserRouter, Router } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </BrowserRouter>

    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Homepage />} />
    //     <Route
    //       path="/best-seller/:categoryName/:productName"
    //       element={<ProductDetailPage />}
    //     />{" "}
    //   </Routes>
    // </Router>
  );
}

export default App;
