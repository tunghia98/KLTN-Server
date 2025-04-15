// src/pages/SellerPage.jsx
import React from "react";
import { SellerProductList } from "../components/seller/SellerProductList";
import { SellerOrderList } from "../components/seller/SellerOrderList";

export function SellerPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <SellerProductList />
      <SellerOrderList />
    </div>
  );
}
