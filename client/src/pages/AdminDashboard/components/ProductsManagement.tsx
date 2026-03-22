import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../../store/hooks";
import { fetchProducts as fetchProductsRedux, deleteProduct } from "../../../store/slices/productSlice";
import { fetchProducts, type ProductApiItem } from "../../../api/products";
import { fetchCategories, type CategoryDto } from "../../../api/categories";
import { fetchBrands, type BrandDto } from "../../../api/brands";
import ProductModal from "./ProductModal";
import { getImageUrl } from "../../../api/client";

const ProductsManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<ProductApiItem[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [selectedBrandId, setSelectedBrandId] = useState<number | "all">("all");

  const [editingProduct, setEditingProduct] = useState<ProductApiItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [prods, cats, brns] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brns);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAll(); }, []);

  const handleOpenAdd = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEdit = (p: ProductApiItem) => { setEditingProduct(p); setIsModalOpen(true); };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    void loadAll();
    dispatch(fetchProductsRedux());
  };

  const handleDelete = async (id: number, title: string) => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f85149",
      cancelButtonColor: "#30363d",
      confirmButtonText: "Delete",
      background: "#0d1117",
      color: "#e6edf3",
    });
    if (!result.isConfirmed) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1200, background: "#0d1117", color: "#e6edf3" });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete product", background: "#0d1117", color: "#e6edf3" });
    }
  };

  const categoryMap = new Map(categories.map((c) => [c.id, c.title]));
  const brandMap = new Map(brands.map((b) => [b.id, b.title]));

  const filtered = products.filter((p) => {
    const searchMatch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase());
    const categoryMatch =
      selectedCategoryId === "all" || p.categoryId === selectedCategoryId;
    const brandMatch =
      selectedBrandId === "all" || p.brandId === selectedBrandId;

    return searchMatch && categoryMatch && brandMatch;
  });

  return (
    <div className="admin-dashboard__section">
      <div className="admin-dashboard__header">
        <h1><FaBoxOpen style={{ marginRight: 10, color: "var(--admin-primary)", fontSize: 22 }} />Products</h1>
        <div className="admin-dashboard__products-toolbar">
          <div className="admin-dashboard__products-toolbar-filters">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-dashboard__products-search"
          />
            <select
              value={selectedCategoryId}
              onChange={(e) =>
                setSelectedCategoryId(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="admin-dashboard__products-select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <select
              value={selectedBrandId}
              onChange={(e) =>
                setSelectedBrandId(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="admin-dashboard__products-select"
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.title}
                </option>
              ))}
            </select>
          </div>
          <button className="admin-dashboard__add-button" onClick={handleOpenAdd}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="admin-dashboard__table-container">
        {loading ? (
          <div className="admin-dashboard__loading">
            <div className="admin-dashboard__loading-spinner" />
            <p>Loading products...</p>
          </div>
        ) : (
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="admin-dashboard__empty-cell">No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>#{p.id}</td>
                  <td>
                    <img
                      src={getImageUrl(p.coverImage)}
                      alt={p.title}
                      className="admin-dashboard__table-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </td>
                  <td style={{ fontWeight: 500, maxWidth: 200 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                  </td>
                  <td>
                    {p.sku ? (
                      <span className="admin-dashboard__tag-badge">{p.sku}</span>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>${p.sellPrice?.toFixed(2)}</td>
                  <td>
                    {p.discount > 0 ? (
                      <span className="admin-dashboard__status admin-dashboard__status--processing">-{p.discount}%</span>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: (p.quantity ?? 0) === 0 ? "var(--admin-danger)" : (p.quantity ?? 0) < 5 ? "var(--admin-warning)" : "var(--admin-success)", fontWeight: 600 }}>
                      {p.quantity ?? 0}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                    {categoryMap.get(p.categoryId) || `#${p.categoryId}`}
                  </td>
                  <td style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                    {p.brandId ? (brandMap.get(p.brandId) || `#${p.brandId}`) : "—"}
                  </td>
                  <td>
                    <button
                      className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                      onClick={() => handleOpenEdit(p)}
                      title="Edit"
                      style={{ marginRight: 6 }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                      onClick={() => handleDelete(p.id, p.title)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-dashboard__modal-backdrop">
          <ProductModal
            product={editingProduct}
            categories={categories}
            brands={brands}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
