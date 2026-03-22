import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit, FaPlus, FaTimes, FaIndustry } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandDto,
} from "../../../api/brands";
import { getImageUrl } from "../../../api/client";

const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => { void loadBrands(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setWebsite("");
    setLogoFile(null);
    setPreviewUrl(null);
    setFormError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (brand: BrandDto) => {
    setEditingId(brand.id);
    setTitle(brand.title);
    setWebsite(brand.website || "");
    setLogoFile(null);
    setPreviewUrl(brand.logoUrl ? getImageUrl(brand.logoUrl) : null);
    setFormError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) { setFormError("Title is required"); return; }
    if (!editingId && !logoFile) { setFormError("Logo is required for new brands"); return; }

    setSaving(true);
    try {
      if (editingId) {
        await updateBrand(editingId, title, website, logoFile || undefined);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Brand updated!", showConfirmButton: false, timer: 1500, background: "#0d1117", color: "#e6edf3" });
      } else {
        await createBrand(title, website, logoFile!);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Brand created!", showConfirmButton: false, timer: 1500, background: "#0d1117", color: "#e6edf3" });
      }
      resetForm();
      await loadBrands();
    } catch {
      setFormError(editingId ? "Failed to update brand" : "Failed to create brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone.",
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
      await deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      if (editingId === id) resetForm();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1200, background: "#0d1117", color: "#e6edf3" });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete brand", background: "#0d1117", color: "#e6edf3" });
    }
  };

  return (
    <div className="admin-dashboard__section">
      <div className="admin-dashboard__header">
        <h1><FaIndustry style={{ marginRight: 10, color: "var(--admin-primary)", fontSize: 22 }} />Brands</h1>
      </div>

      <div className="admin-dashboard__crud-layout">
        {/* Form */}
        <div className="admin-dashboard__crud-form-card">
          <h3>
            {editingId ? <><FaEdit /> Edit Brand</> : <><FaPlus /> New Brand</>}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-dashboard__form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brand name"
                required
              />
            </div>
            <div className="admin-dashboard__form-group">
              <label>Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="admin-dashboard__form-group">
              <label>Logo {editingId && "(leave empty to keep current)"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileRef}
              />
              {previewUrl && (
                <img src={previewUrl} alt="logo preview" className="admin-dashboard__preview-thumb" />
              )}
            </div>
            {formError && <div className="admin-dashboard__form-error">{formError}</div>}
            <div className="admin-dashboard__form-actions">
              <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Brand" : "Create Brand"}
              </button>
              {editingId && (
                <button type="button" className="admin-dashboard__button admin-dashboard__button--ghost" onClick={resetForm}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="admin-dashboard__crud-list">
          <div className="admin-dashboard__table-container">
            {loading ? (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner" />
                <p>Loading brands...</p>
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
                    <tr><td colSpan={5} className="admin-dashboard__empty-cell">No brands found</td></tr>
                  ) : brands.map((brand) => (
                    <tr key={brand.id}>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>#{brand.id}</td>
                      <td>
                        {brand.logoUrl ? (
                          <img
                            src={getImageUrl(brand.logoUrl)}
                            alt={brand.title}
                            className="admin-dashboard__table-img admin-dashboard__table-img--brand"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text-muted)" }}>
                            <FaIndustry />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{brand.title}</td>
                      <td>
                        {brand.website ? (
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="admin-dashboard__link">
                            {brand.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </a>
                        ) : (
                          <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                          onClick={() => handleEdit(brand)}
                          title="Edit"
                          style={{ marginRight: 6 }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                          onClick={() => handleDelete(brand.id, brand.title)}
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
        </div>
      </div>
    </div>
  );
};

export default BrandsManagement;
