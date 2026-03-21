import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchBrands,
  createBrand,
  deleteBrand,
  type BrandDto,
} from "../../../../api/brands";

const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [newBrandTitle, setNewBrandTitle] = useState("");
  const [newBrandWebsite, setNewBrandWebsite] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const data = await fetchBrands();
        setBrands(data);
      } catch {
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    void loadBrands();
  }, []);

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

  return (
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
                onChange={(e) => setNewBrandLogo(e.target.files?.[0] || null)}
              />
            </div>
            {brandError && (
              <div className="admin-dashboard__form-error">{brandError}</div>
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
            {loading ? (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner"></div>
              </div>
            ) : (
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
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsManagement;
