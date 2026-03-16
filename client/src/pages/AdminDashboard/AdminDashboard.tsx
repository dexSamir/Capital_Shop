"use client";

import { useState, useEffect } from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaMoneyBillWave,
  FaBoxOpen,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaEllipsisV,
  FaTags,
  FaIndustry,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";
import AdminSearchbar from "../../components/AdminSearchbar";
import AdminTable from "../../components/AdminTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchProducts,
  deleteProduct,
  setFilter,
  type Product,
} from "../../store/slices/productSlice";
import {
  fetchCategories,
  type CategoryDto,
  createCategory,
  deleteCategory,
} from "../../api/categories";
import {
  createProduct,
  updateProduct,
  type AdminProductPayload,
} from "../../api/products";
import {
  type AdminOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../../api/orders";
import {
  fetchBrands,
  createBrand,
  deleteBrand,
  type BrandDto,
} from "../../api/brands";
import "./AdminDashboard.scss";

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
  const { items, filteredItems, loading, error } = useAppSelector(
    (state) => state.products,
  );
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateRange, setDateRange] = useState("This Month");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newBrandTitle, setNewBrandTitle] = useState("");
  const [newBrandWebsite, setNewBrandWebsite] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "orders") {
      const loadOrders = async () => {
        try {
          setOrdersLoading(true);
          setOrdersError(null);
          const data = await fetchAllOrders();
          setOrders(data);
        } catch {
          setOrdersError("Failed to load orders");
        } finally {
          setOrdersLoading(false);
        }
      };
      void loadOrders();
    }
  }, [activeTab]);

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
    void loadCategories();
    void loadBrands();
  }, []);

  const handleSearch = (search: string) => {
    setSearch(search);
    dispatch(setFilter({ key: "search", value: search }));
  };

  const handleSortByDiscount = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }));
      dispatch(setFilter({ key: "sortOrder", value: "asc" }));
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }));
      dispatch(setFilter({ key: "sortOrder", value: "desc" }));
    }
  };

  const handleSortByName = (order: string) => {
    if (order === "AtoZ") {
      dispatch(setFilter({ key: "sortBy", value: "name" }));
      dispatch(setFilter({ key: "sortOrder", value: "asc" }));
    } else if (order === "ZtoA") {
      dispatch(setFilter({ key: "sortBy", value: "name" }));
      dispatch(setFilter({ key: "sortOrder", value: "desc" }));
    }
  };

  const handleSortByPrice = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "price" }));
      dispatch(setFilter({ key: "sortOrder", value: "asc" }));
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "price" }));
      dispatch(setFilter({ key: "sortOrder", value: "desc" }));
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Yes, delete it!",
      background: "#1a1a2e",
      color: "#fff",
    });
    if (result.isConfirmed) {
      dispatch(deleteProduct(id));
      Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleChangeOrderStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Order status updated",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryTitle || !newCategoryImage) {
      setCategoryError("Title and image are required");
      return;
    }
    setSavingCategory(true);
    setCategoryError(null);
    try {
      await createCategory(newCategoryTitle, newCategoryImage);
      const data = await fetchCategories();
      setCategories(data);
      setNewCategoryTitle("");
      setNewCategoryImage(null);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category created!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      setCategoryError("Failed to create category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Delete",
      background: "#1a1a2e",
      color: "#fff",
    });
    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete category",
          background: "#1a1a2e",
          color: "#fff",
        });
      }
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandTitle || !newBrandLogo) {
      setBrandError("Title and logo are required");
      return;
    }
    setSavingBrand(true);
    setBrandError(null);
    try {
      await createBrand(newBrandTitle, newBrandWebsite, newBrandLogo);
      const data = await fetchBrands();
      setBrands(data);
      setNewBrandTitle("");
      setNewBrandWebsite("");
      setNewBrandLogo(null);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Brand created!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      setBrandError("Failed to create brand");
    } finally {
      setSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Brand?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Delete",
      background: "#1a1a2e",
      color: "#fff",
    });
    if (result.isConfirmed) {
      try {
        await deleteBrand(id);
        setBrands((prev) => prev.filter((b) => b.id !== id));
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete brand",
          background: "#1a1a2e",
          color: "#fff",
        });
      }
    }
  };

  const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: AdminProductPayload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      sellPrice: Number(formData.get("sellPrice") || 0),
      costPrice: Number(formData.get("costPrice") || 0),
      discount: Number(formData.get("discount") || 0),
      quantity: Number(formData.get("quantity") || 0),
      sku: String(formData.get("sku") || ""),
      brandId: Number(formData.get("brandId") || 1),
      categoryId: Number(formData.get("categoryId") || 1),
      coverImage: (formData.get("coverImage") as File) || null,
      secondImage: (formData.get("secondImage") as File) || null,
    };

    setSavingProduct(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      dispatch(fetchProducts());
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: editingProduct ? "Product updated!" : "Product created!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save product",
        background: "#1a1a2e",
        color: "#fff",
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalOrders = orders.length || 0;
  const totalProducts = items.length;

  const renderRevenueChart = () => {
    const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue));

    return (
      <div className="admin-dashboard__chart">
        <div className="admin-dashboard__chart-header">
          <h3>Revenue Overview</h3>
          <div className="admin-dashboard__chart-actions">
            <select className="admin-dashboard__select">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
            <button className="admin-dashboard__icon-button">
              <FaDownload />
            </button>
          </div>
        </div>
        <div className="admin-dashboard__chart-content">
          <div className="admin-dashboard__bar-chart">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="admin-dashboard__bar-container">
                <div
                  className="admin-dashboard__bar"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  data-value={`$${item.revenue.toLocaleString()}`}
                ></div>
                <div className="admin-dashboard__bar-label">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryChart = () => {
    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    const colors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#e17055"];

    return (
      <div className="admin-dashboard__chart">
        <div className="admin-dashboard__chart-header">
          <h3>Sales by Category</h3>
          <button className="admin-dashboard__icon-button">
            <FaEllipsisV />
          </button>
        </div>
        <div className="admin-dashboard__chart-content">
          <div className="admin-dashboard__donut-container">
            <div className="admin-dashboard__donut-chart">
              {categoryData.map((item, index) => {
                const percentage = (item.value / total) * 100;
                return (
                  <div
                    key={index}
                    className="admin-dashboard__donut-item"
                    title={`${item.name}: ${percentage.toFixed(0)}%`}
                  >
                    <div
                      className="admin-dashboard__donut-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index],
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="admin-dashboard__pie-legend">
              {categoryData.map((item, index) => (
                <div key={index} className="admin-dashboard__legend-item">
                  <div
                    className="admin-dashboard__legend-color"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <div className="admin-dashboard__legend-label">
                    {item.name}
                  </div>
                  <div className="admin-dashboard__legend-value">
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        </nav>
      </div>

      <div className="admin-dashboard__main">
        {activeTab === "dashboard" && (
          <>
            <div className="admin-dashboard__header">
              <h1>Dashboard Overview</h1>
              <div className="admin-dashboard__date-filter">
                <FaCalendarAlt className="admin-dashboard__date-icon" />
                <select
                  className="admin-dashboard__date-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            <div className="admin-dashboard__summary">
              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--revenue">
                  <FaMoneyBillWave />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Total Revenue</h3>
                  <div className="admin-dashboard__summary-value">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <div className="admin-dashboard__summary-change admin-dashboard__summary-change--up">
                    +12.5% from last month
                  </div>
                </div>
              </div>

              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--orders">
                  <FaShoppingCart />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Total Orders</h3>
                  <div className="admin-dashboard__summary-value">
                    {totalOrders.toLocaleString()}
                  </div>
                  <div className="admin-dashboard__summary-change admin-dashboard__summary-change--up">
                    +8.2% from last month
                  </div>
                </div>
              </div>

              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--categories">
                  <FaTags />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Categories</h3>
                  <div className="admin-dashboard__summary-value">
                    {categories.length}
                  </div>
                  <div className="admin-dashboard__summary-change">
                    Active categories
                  </div>
                </div>
              </div>

              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--products">
                  <FaBoxOpen />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Total Products</h3>
                  <div className="admin-dashboard__summary-value">
                    {totalProducts.toLocaleString()}
                  </div>
                  <div className="admin-dashboard__summary-change">
                    {brands.length} brands
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-dashboard__charts">
              {renderRevenueChart()}
              {renderCategoryChart()}
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="admin-dashboard__header">
              <h1>Products Management</h1>
              <button
                className="admin-dashboard__add-button"
                onClick={handleAddNewProduct}
              >
                <FaPlus /> Add New Product
              </button>
            </div>

            <AdminSearchbar
              search={search}
              onSearch={handleSearch}
              onhandleSortByPrice={handleSortByPrice}
              onhandleSortByName={handleSortByName}
              onhandleSortByDiscount={handleSortByDiscount}
            />

            {loading ? (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="admin-dashboard__error">Error: {error}</div>
            ) : (
              <AdminTable
                onDelete={handleDelete}
                onEdit={handleEditProduct}
                datas={filteredItems}
              />
            )}

            {isProductModalOpen && (
              <div className="admin-dashboard__modal-backdrop">
                <div className="admin-dashboard__modal">
                  <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                  <form
                    className="admin-dashboard__form"
                    onSubmit={handleSaveProduct}
                  >
                    <div className="admin-dashboard__form-row">
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="title">Title</label>
                        <input
                          id="title"
                          name="title"
                          defaultValue={editingProduct?.name ?? ""}
                          required
                        />
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="sku">SKU</label>
                        <input id="sku" name="sku" defaultValue="" required />
                      </div>
                    </div>

                    <div className="admin-dashboard__form-row">
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="sellPrice">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          id="sellPrice"
                          name="sellPrice"
                          defaultValue={editingProduct?.price ?? 0}
                          required
                        />
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="costPrice">Cost Price</label>
                        <input
                          type="number"
                          step="0.01"
                          id="costPrice"
                          name="costPrice"
                          defaultValue={editingProduct?.price ?? 0}
                          required
                        />
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="discount">Discount (%)</label>
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          defaultValue={0}
                        />
                      </div>
                    </div>

                    <div className="admin-dashboard__form-row">
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          defaultValue={1}
                          required
                        />
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="categoryId">Category</label>
                        <select
                          id="categoryId"
                          name="categoryId"
                          defaultValue=""
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="brandId">Brand</label>
                        <select
                          id="brandId"
                          name="brandId"
                          defaultValue=""
                        >
                          <option value="">Select brand</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="admin-dashboard__form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue=""
                      />
                    </div>

                    <div className="admin-dashboard__form-row">
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="coverImage">Cover Image</label>
                        <input
                          id="coverImage"
                          name="coverImage"
                          type="file"
                          accept="image/*"
                        />
                      </div>
                      <div className="admin-dashboard__form-group">
                        <label htmlFor="secondImage">Second Image</label>
                        <input
                          id="secondImage"
                          name="secondImage"
                          type="file"
                          accept="image/*"
                        />
                      </div>
                    </div>

                    <div className="admin-dashboard__form-actions">
                      <button
                        type="button"
                        className="admin-dashboard__button admin-dashboard__button--secondary"
                        onClick={() => {
                          setIsProductModalOpen(false);
                          setEditingProduct(null);
                        }}
                        disabled={savingProduct}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-dashboard__button admin-dashboard__button--primary"
                        disabled={savingProduct}
                      >
                        {savingProduct ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── Categories Management ─────────────────────── */}
        {activeTab === "categories" && (
          <div className="admin-dashboard__section">
            <div className="admin-dashboard__header">
              <h1>Categories Management</h1>
            </div>

            <div className="admin-dashboard__crud-layout">
              <div className="admin-dashboard__crud-form-card">
                <h3>Add New Category</h3>
                <form onSubmit={handleCreateCategory}>
                  <div className="admin-dashboard__form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newCategoryTitle}
                      onChange={(e) => setNewCategoryTitle(e.target.value)}
                      placeholder="Category name"
                      required
                    />
                  </div>
                  <div className="admin-dashboard__form-group">
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewCategoryImage(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  {categoryError && (
                    <div className="admin-dashboard__form-error">
                      {categoryError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="admin-dashboard__button admin-dashboard__button--primary"
                    disabled={savingCategory}
                  >
                    {savingCategory ? "Creating..." : "Create Category"}
                  </button>
                </form>
              </div>

              <div className="admin-dashboard__crud-list">
                <div className="admin-dashboard__table-container">
                  <table className="admin-dashboard__table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="admin-dashboard__empty-cell">
                            No categories found
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat.id}>
                            <td>#{cat.id}</td>
                            <td>
                              {cat.imageUrl && (
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.title}
                                  className="admin-dashboard__table-img"
                                />
                              )}
                            </td>
                            <td>{cat.title}</td>
                            <td>
                              <button
                                className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                                onClick={() => handleDeleteCategory(cat.id)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Brands Management ──────────────────────────── */}
        {activeTab === "brands" && (
          <div className="admin-dashboard__section">
            <div className="admin-dashboard__header">
              <h1>Brands Management</h1>
            </div>

            <div className="admin-dashboard__crud-layout">
              <div className="admin-dashboard__crud-form-card">
                <h3>Add New Brand</h3>
                <form onSubmit={handleCreateBrand}>
                  <div className="admin-dashboard__form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newBrandTitle}
                      onChange={(e) => setNewBrandTitle(e.target.value)}
                      placeholder="Brand name"
                      required
                    />
                  </div>
                  <div className="admin-dashboard__form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={newBrandWebsite}
                      onChange={(e) => setNewBrandWebsite(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="admin-dashboard__form-group">
                    <label>Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewBrandLogo(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  {brandError && (
                    <div className="admin-dashboard__form-error">
                      {brandError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="admin-dashboard__button admin-dashboard__button--primary"
                    disabled={savingBrand}
                  >
                    {savingBrand ? "Creating..." : "Create Brand"}
                  </button>
                </form>
              </div>

              <div className="admin-dashboard__crud-list">
                <div className="admin-dashboard__table-container">
                  <table className="admin-dashboard__table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Logo</th>
                        <th>Title</th>
                        <th>Website</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="admin-dashboard__empty-cell">
                            No brands found
                          </td>
                        </tr>
                      ) : (
                        brands.map((brand) => (
                          <tr key={brand.id}>
                            <td>#{brand.id}</td>
                            <td>
                              {brand.logoUrl && (
                                <img
                                  src={brand.logoUrl}
                                  alt={brand.title}
                                  className="admin-dashboard__table-img"
                                />
                              )}
                            </td>
                            <td>{brand.title}</td>
                            <td>
                              {brand.website ? (
                                <a
                                  href={brand.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="admin-dashboard__link"
                                >
                                  {brand.website}
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              <button
                                className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                                onClick={() => handleDeleteBrand(brand.id)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="admin-dashboard__orders">
            <div className="admin-dashboard__header">
              <h1>Orders Management</h1>
              <select
                className="admin-dashboard__date-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {ordersLoading && (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner"></div>
                <p>Loading orders...</p>
              </div>
            )}

            {ordersError && (
              <div className="admin-dashboard__error">{ordersError}</div>
            )}

            {!ordersLoading && !ordersError && (
              <div className="admin-dashboard__table-container">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) =>
                        orderStatusFilter === "All"
                          ? true
                          : o.status === orderStatusFilter,
                      )
                      .map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`admin-dashboard__status admin-dashboard__status--${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>
                            <select
                              value={order.status}
                              className="admin-dashboard__status-select"
                              onChange={(e) =>
                                handleChangeOrderStatus(
                                  order.id,
                                  e.target.value,
                                )
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="admin-dashboard__section">
            <div className="admin-dashboard__header">
              <h1>Analytics Dashboard</h1>
            </div>
            <div className="admin-dashboard__charts">
              {renderRevenueChart()}
              {renderCategoryChart()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
