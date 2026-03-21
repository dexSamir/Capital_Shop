import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  type CategoryDto,
} from "../../../../api/categories";

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    void loadCategories();
  }, []);

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

  return (
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
            {loading ? (
              <div className="admin-dashboard__loading">
                <div className="admin-dashboard__loading-spinner"></div>
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

export default CategoriesManagement;
