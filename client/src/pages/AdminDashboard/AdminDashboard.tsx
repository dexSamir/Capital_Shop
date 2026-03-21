"use client";

import { useState, useEffect } from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaBoxOpen,
  FaChartLine,
  FaTags,
  FaIndustry,
  FaUsers,
} from "react-icons/fa";
import DashboardOverview from "./components/DashboardOverview";
import CategoriesManagement from "./components/CategoriesManagement";
import BrandsManagement from "./components/BrandsManagement";
import OrdersManagement from "./components/OrdersManagement";
import UsersManagement from "./components/UsersManagement";

// We will build this in the next steps
import ProductsManagement from "./components/ProductsManagement";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchCategories, type CategoryDto } from "../../api/categories";
import { fetchBrands, type BrandDto } from "../../api/brands";
import { fetchAllOrders, type AdminOrder } from "../../api/orders";

import "./AdminDashboard.scss";

// Dummy data for analytics
const monthlyRevenue = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15800 },
  { month: "Apr", revenue: 21000 },
  { month: "May", revenue: 19500 },
  { month: "Jun", revenue: 24800 },
  { month: "Jul", revenue: 27300 },
  { month: "Aug", revenue: 29100 },
  { month: "Sep", revenue: 31500 },
  { month: "Oct", revenue: 34200 },
  { month: "Nov", revenue: 38700 },
  { month: "Dec", revenue: 42500 },
];

const categoryData = [
  { name: "Clothing", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Footwear", value: 20 },
  { name: "Electronics", value: 10 },
];

function Dashboard() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.products);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("This Month");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch {
        setBrands([]);
      }
    };
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch {
        // Handle gracefully
      }
    };
    void loadCategories();
    void loadBrands();
    void loadOrders();
  }, []);

  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalOrders = orders.length || 0;
  const totalProducts = items.length;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__sidebar">
        <div className="admin-dashboard__sidebar-header">
          <div className="admin-dashboard__logo">
            <span className="admin-dashboard__logo-icon">⚡</span>
            <h2>Capital Shop</h2>
          </div>
        </div>
        <nav className="admin-dashboard__nav">
          <button
            className={`admin-dashboard__nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartBar className="admin-dashboard__nav-icon" />
            <span>Dashboard</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FaBoxOpen className="admin-dashboard__nav-icon" />
            <span>Products</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FaTags className="admin-dashboard__nav-icon" />
            <span>Categories</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => setActiveTab("brands")}
          >
            <FaIndustry className="admin-dashboard__nav-icon" />
            <span>Brands</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingCart className="admin-dashboard__nav-icon" />
            <span>Orders</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartLine className="admin-dashboard__nav-icon" />
            <span>Analytics</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="admin-dashboard__nav-icon" />
            <span>Users</span>
          </button>
        </nav>
      </div>

      <div className="admin-dashboard__main">
        {activeTab === "dashboard" && (
          <DashboardOverview
            dateRange={dateRange}
            setDateRange={setDateRange}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            categories={categories}
            totalProducts={totalProducts}
            brands={brands}
            monthlyRevenue={monthlyRevenue}
            categoryData={categoryData}
          />
        )}

        {activeTab === "products" && <ProductsManagement />}
        {activeTab === "categories" && <CategoriesManagement />}
        {activeTab === "brands" && <BrandsManagement />}
        {activeTab === "orders" && <OrdersManagement />}
        {activeTab === "users" && <UsersManagement />}

        {/* Reusing DashboardOverview for Analytics for now, per original design */}
        {activeTab === "analytics" && (
          <DashboardOverview
            dateRange={dateRange}
            setDateRange={setDateRange}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            categories={categories}
            totalProducts={totalProducts}
            brands={brands}
            monthlyRevenue={monthlyRevenue}
            categoryData={categoryData}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
