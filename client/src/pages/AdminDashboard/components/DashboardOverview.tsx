import React from "react";
import { FaMoneyBillWave, FaShoppingCart, FaTags, FaBoxOpen, FaDownload, FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
import { type CategoryDto } from "../../../../api/categories";
import { type BrandDto } from "../../../../api/brands";

interface DashboardOverviewProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  totalRevenue: number;
  totalOrders: number;
  categories: CategoryDto[];
  totalProducts: number;
  brands: BrandDto[];
  monthlyRevenue: { month: string; revenue: number }[];
  categoryData: { name: string; value: number }[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  dateRange,
  setDateRange,
  totalRevenue,
  totalOrders,
  categories,
  totalProducts,
  brands,
  monthlyRevenue,
  categoryData,
}) => {
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
  );
};

export default DashboardOverview;
