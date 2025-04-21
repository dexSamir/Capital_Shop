"use client"

import { useState, useEffect } from "react"
import {
  FaChartBar,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaBoxOpen,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaEllipsisV,
} from "react-icons/fa"
import AdminSearchbar from "../../components/AdminSearchbar"
import AdminTable from "../../components/AdminTable"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProducts, deleteProduct, setFilter } from "../../store/slices/productSlice"
import "./AdminDashboard.scss"

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
]

const categoryData = [
  { name: "Clothing", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Footwear", value: 20 },
  { name: "Electronics", value: 10 },
]

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", date: "2023-11-15", status: "Delivered", total: "$125.99" },
  { id: "#ORD-002", customer: "Jane Smith", date: "2023-11-14", status: "Processing", total: "$89.50" },
  { id: "#ORD-003", customer: "Robert Johnson", date: "2023-11-14", status: "Shipped", total: "$210.75" },
  { id: "#ORD-004", customer: "Emily Davis", date: "2023-11-13", status: "Delivered", total: "$45.25" },
  { id: "#ORD-005", customer: "Michael Brown", date: "2023-11-12", status: "Cancelled", total: "$178.30" },
]

const topProducts = [
  { name: "Premium T-Shirt", sales: 245, revenue: "$12,250" },
  { name: "Designer Jeans", sales: 187, revenue: "$9,350" },
  { name: "Leather Jacket", sales: 156, revenue: "$23,400" },
  { name: "Running Shoes", sales: 134, revenue: "$8,710" },
  { name: "Smartwatch", sales: 98, revenue: "$19,600" },
]

function Dashboard() {
  const dispatch = useAppDispatch()
  const { items, filteredItems, loading, error } = useAppSelector((state) => state.products)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dateRange, setDateRange] = useState("This Month")

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSearch = (search: string) => {
    setSearch(search)
    dispatch(setFilter({ key: "search", value: search }))
  }

  const handleSortByDiscount = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleSortByName = (order: string) => {
    if (order === "AtoZ") {
      dispatch(setFilter({ key: "sortBy", value: "name" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "ZtoA") {
      dispatch(setFilter({ key: "sortBy", value: "name" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleSortByPrice = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "price" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "price" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id))
  }

  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = 1254
  const totalCustomers = 856
  const totalProducts = items.length

  const renderRevenueChart = () => {
    const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue))

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
    )
  }

  const renderCategoryChart = () => {
    const total = categoryData.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="admin-dashboard__chart">
        <div className="admin-dashboard__chart-header">
          <h3>Sales by Category</h3>
          <button className="admin-dashboard__icon-button">
            <FaEllipsisV />
          </button>
        </div>
        <div className="admin-dashboard__chart-content">
          <div className="admin-dashboard__pie-chart-container">
            <div className="admin-dashboard__pie-chart">
              {categoryData.map((item, index) => {
                const percentage = (item.value / total) * 100
                const previousPercentage = cumulativePercentage
                cumulativePercentage += percentage

                return (
                  <div
                    key={index}
                    className="admin-dashboard__pie-segment"
                    style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((previousPercentage / 100) * 2 * Math.PI)}% ${50 - 50 * Math.sin((previousPercentage / 100) * 2 * Math.PI)}%, ${50 + 50 * Math.cos((cumulativePercentage / 100) * 2 * Math.PI)}% ${50 - 50 * Math.sin((cumulativePercentage / 100) * 2 * Math.PI)}%)`,
                    }}
                  ></div>
                )
              })}
            </div>
            <div className="admin-dashboard__pie-legend">
              {categoryData.map((item, index) => (
                <div key={index} className="admin-dashboard__legend-item">
                  <div
                    className="admin-dashboard__legend-color"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  ></div>
                  <div className="admin-dashboard__legend-label">{item.name}</div>
                  <div className="admin-dashboard__legend-value">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__sidebar">
        <div className="admin-dashboard__sidebar-header">
          <h2>Admin Panel</h2>
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
            className={`admin-dashboard__nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingCart className="admin-dashboard__nav-icon" />
            <span>Orders</span>
          </button>
          <button
            className={`admin-dashboard__nav-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <FaUsers className="admin-dashboard__nav-icon" />
            <span>Customers</span>
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
                  <div className="admin-dashboard__summary-value">${totalRevenue.toLocaleString()}</div>
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
                  <div className="admin-dashboard__summary-value">{totalOrders.toLocaleString()}</div>
                  <div className="admin-dashboard__summary-change admin-dashboard__summary-change--up">
                    +8.2% from last month
                  </div>
                </div>
              </div>

              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--customers">
                  <FaUsers />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Total Customers</h3>
                  <div className="admin-dashboard__summary-value">{totalCustomers.toLocaleString()}</div>
                  <div className="admin-dashboard__summary-change admin-dashboard__summary-change--up">
                    +5.7% from last month
                  </div>
                </div>
              </div>

              <div className="admin-dashboard__summary-card">
                <div className="admin-dashboard__summary-icon admin-dashboard__summary-icon--products">
                  <FaBoxOpen />
                </div>
                <div className="admin-dashboard__summary-content">
                  <h3>Total Products</h3>
                  <div className="admin-dashboard__summary-value">{totalProducts.toLocaleString()}</div>
                  <div className="admin-dashboard__summary-change admin-dashboard__summary-change--down">
                    -2.3% from last month
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-dashboard__charts">
              {renderRevenueChart()}
              {renderCategoryChart()}
            </div>

            <div className="admin-dashboard__tables">
              <div className="admin-dashboard__table-container">
                <div className="admin-dashboard__table-header">
                  <h3>Recent Orders</h3>
                  <button className="admin-dashboard__view-all">View All</button>
                </div>
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>
                          <span
                            className={`admin-dashboard__status admin-dashboard__status--${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-dashboard__table-container">
                <div className="admin-dashboard__table-header">
                  <h3>Top Selling Products</h3>
                  <button className="admin-dashboard__view-all">View All</button>
                </div>
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.sales}</td>
                        <td>{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="admin-dashboard__header">
              <h1>Products Management</h1>
              <button className="admin-dashboard__add-button">+ Add New Product</button>
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
              <AdminTable onDelete={handleDelete} datas={filteredItems} />
            )}
          </>
        )}

        {activeTab === "orders" && (
          <div className="admin-dashboard__placeholder">
            <h2>Orders Management</h2>
            <p>This section is under development.</p>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="admin-dashboard__placeholder">
            <h2>Customers Management</h2>
            <p>This section is under development.</p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="admin-dashboard__placeholder">
            <h2>Analytics Dashboard</h2>
            <p>This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
