import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit, FaPlus, FaTimes, FaTag } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryDto,
} from "../../../api/categories";
import { getImageUrl } from "../../../api/client";

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCategories(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setImageFile(null);
    setPreviewUrl(null);
    setFormError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (cat: CategoryDto) => {
    setEditingId(cat.id);
    setTitle(cat.title);
    setImageFile(null);
    setPreviewUrl(cat.imageUrl ? getImageUrl(cat.imageUrl) : null);
    setFormError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
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
    if (!editingId && !imageFile) { setFormError("Image is required for new categories"); return; }

    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, title, imageFile || undefined);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Category updated!", showConfirmButton: false, timer: 1500, background: "#0d1117", color: "#e6edf3" });
      } else {
        await createCategory(title, imageFile!);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Category created!", showConfirmButton: false, timer: 1500, background: "#0d1117", color: "#e6edf3" });
      }
      resetForm();
      await loadCategories();
    } catch {
      setFormError(editingId ? "Failed to update category" : "Failed to create category");
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
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
      Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1200, background: "#0d1117", color: "#e6edf3" });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete category", background: "#0d1117", color: "#e6edf3" });
    }
  };

  return (
    <div className="admin-dashboard__section">
      <div className="admin-dashboard__header">
        <h1><FaTag style={{ marginRight: 10, color: "var(--admin-primary)", fontSize: 22 }} />Categories</h1>
      </div>

      <div className="admin-dashboard__crud-layout">
        <div className="admin-dashboard__crud-form-card">
          <h3>
            {editingId ? <><FaEdit /> Edit Category</> : <><FaPlus /> New Category</>}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-dashboard__form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            <div className="admin-dashboard__form-group">
              <label>Image {editingId && "(leave empty to keep current)"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileRef}
              />
              {previewUrl && (
                <img src={previewUrl} alt="preview" className="admin-dashboard__preview-thumb" />
              )}
            </div>
            {formError && <div className="admin-dashboard__form-error">{formError}</div>}
            <div className="admin-dashboard__form-actions">
              <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
              </button>
              {editingId && (
                <button type="button" className="admin-dashboard__button admin-dashboard__button--ghost" onClick={resetForm}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-dashboard__crud-list">
          <div className="admin-dashboard__table-container">
            {loading ? (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner" />
                <p>Loading categories...</p>
              </div>
            ) : (
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
                    <tr><td colSpan={4} className="admin-dashboard__empty-cell">No categories found</td></tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>#{cat.id}</td>
                      <td>
                        {cat.imageUrl ? (
                          <img src={getImageUrl(cat.imageUrl)} alt={cat.title} className="admin-dashboard__table-img" />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text-muted)" }}>
                            <FaTag />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{cat.title}</td>
                      <td>
                        <button
                          className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                          onClick={() => handleEdit(cat)}
                          title="Edit"
                          style={{ marginRight: 6 }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                          onClick={() => handleDelete(cat.id, cat.title)}
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

export default CategoriesManagement;
