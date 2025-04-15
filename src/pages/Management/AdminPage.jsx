// src/pages/AdminPage.jsx
import React from "react";
import { UserManagement } from "../components/admin/UserManagement";
import { SellerManagement } from "../components/admin/SellerManagement";
import { ProductManagement } from "../components/admin/ProductManagement";
import { ForumManagement } from "../components/admin/ForumManagement";

export function AdminPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UserManagement />
      <SellerManagement />
      <ProductManagement />
      <ForumManagement />
    </div>
  );
}
