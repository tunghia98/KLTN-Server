// layouts/UserLayout.jsx
import React from "react";
import Header from "../modules/user/components/Header/Header.jsx";
import Footer from "../modules/user/components/Footer/Footer.jsx";

const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default MainLayout;
