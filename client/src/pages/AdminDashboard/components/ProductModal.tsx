import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { type CategoryDto } from "../../../api/categories";
import { type BrandDto } from "../../../api/brands";
import { createProduct, updateProduct, type AdminProductPayload, type ProductApiItem } from "../../../api/products";
import {
  getImagesByProductId,
  addImages,
  deleteImages,
  setPrimaryImage,
  setSecondaryImage,
  updateAltText,
  type ProductImageDto,
} from "../../../api/productImages";
import {
  getSpecificationsByProductId,
  createSpecification,
  updateSpecification,
  deleteSpecification,
  type ProductSpecificationDto,
} from "../../../api/productSpecifications";
import {
  getProductAttributes,
  assignAttributeValueToProduct,
  removeAttributeValueFromProduct,
  type ProductAttributeValueDto,
} from "../../../api/productAttributes";
import { getImageUrl } from "../../../api/client";
import {
  FaTrash, FaStar, FaRegStar, FaImage, FaPlus, FaEdit,
  FaCheck, FaTimes, FaLayerGroup, FaTags, FaCube,
} from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";

interface ProductModalProps {
  product: ProductApiItem | null;
  categories: CategoryDto[];
  brands: BrandDto[];
  onClose: () => void;
}

type TabType = "basic" | "images" | "specs" | "attributes";

const toast = (icon: "success" | "error", title: string) =>
  Swal.fire({ toast: true, position: "top-end", icon, title, showConfirmButton: false, timer: 1800, background: "#0d1117", color: "#e6edf3" });

const ProductModal: React.FC<ProductModalProps> = ({ product, categories, brands, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [saving, setSaving] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(product?.id || null);

  // ── Images ──────────────────────────────────────────────────────
  const [images, setImages] = useState<ProductImageDto[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  // ── Specs ────────────────────────────────────────────────────────
  const [specs, setSpecs] = useState<ProductSpecificationDto[]>([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [editingSpec, setEditingSpec] = useState<{ id: number; key: string; value: string } | null>(null);

  // ── Attributes ───────────────────────────────────────────────────
  const [attributes, setAttributes] = useState<ProductAttributeValueDto[]>([]);
  const [newAttributeValId, setNewAttributeValId] = useState("");

  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentProductId) {
      void loadImages();
      void loadSpecs();
      void loadAttributes();
    }
  }, [currentProductId]);

  const loadImages = async () => {
    if (!currentProductId) return;
    try { setImages(await getImagesByProductId(currentProductId)); } catch { /* ignore */ }
  };
  const loadSpecs = async () => {
    if (!currentProductId) return;
    try { setSpecs(await getSpecificationsByProductId(currentProductId)); } catch { /* ignore */ }
  };
  const loadAttributes = async () => {
    if (!currentProductId) return;
    try { setAttributes(await getProductAttributes(currentProductId)); } catch { /* ignore */ }
  };

  // ── Basic Save ───────────────────────────────────────────────────
  const handleSaveBasic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: AdminProductPayload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || ""),
      sellPrice: Number(fd.get("sellPrice") || 0),
      costPrice: Number(fd.get("costPrice") || 0),
      discount: Number(fd.get("discount") || 0),
      quantity: Number(fd.get("quantity") || 0),
      sku: String(fd.get("sku") || ""),
      brandId: Number(fd.get("brandId") || 1),
      categoryId: Number(fd.get("categoryId") || 1),
      coverImage: (fd.get("coverImage") as File)?.size ? (fd.get("coverImage") as File) : null,
      secondImage: (fd.get("secondImage") as File)?.size ? (fd.get("secondImage") as File) : null,
    };
    setSaving(true);
    try {
      if (currentProductId) {
        await updateProduct(currentProductId, payload);
        toast("success", "Product updated!");
        onClose();
      } else {
        const result = await createProduct(payload);
        if (result?.id) {
          setCurrentProductId(result.id);
          toast("success", "Product created! Now add images & specs.");
          setActiveTab("images");
        } else {
          toast("success", "Product created!");
          onClose();
        }
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save product", background: "#0d1117", color: "#e6edf3" });
    } finally {
      setSaving(false);
    }
  };

  // ── Images ───────────────────────────────────────────────────────
  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !currentProductId) return;
    const fd = new FormData();
    Array.from(e.target.files).forEach((file, i) => {
      fd.append(`dtos[${i}].File`, file);
      fd.append(`dtos[${i}].AltText`, product?.title || "Product Image");
    });
    setUploadLoading(true);
    try {
      await addImages(currentProductId, fd);
      await loadImages();
      toast("success", "Images uploaded!");
    } catch {
      toast("error", "Upload failed");
    } finally {
      setUploadLoading(false);
    }
    e.target.value = "";
  };

  const handleDeleteImage = async (imageId: number) => {
    try { await deleteImages([imageId], 1); await loadImages(); }
    catch { toast("error", "Delete failed"); }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!currentProductId) return;
    try { await setPrimaryImage(currentProductId, imageId); await loadImages(); toast("success", "Primary image set!"); }
    catch { toast("error", "Update failed"); }
  };

  const handleSetSecondary = async (imageId: number) => {
    if (!currentProductId) return;
    try { await setSecondaryImage(currentProductId, imageId); await loadImages(); toast("success", "Secondary image set!"); }
    catch { toast("error", "Update failed"); }
  };

  // ── Specs ────────────────────────────────────────────────────────
  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProductId || !newSpecKey.trim() || !newSpecValue.trim()) return;
    try {
      await createSpecification(currentProductId, newSpecKey.trim(), newSpecValue.trim());
      setNewSpecKey(""); setNewSpecValue("");
      await loadSpecs(); toast("success", "Spec added!");
    } catch { toast("error", "Failed to add spec"); }
  };

  const handleSaveEditSpec = async () => {
    if (!editingSpec) return;
    try {
      await updateSpecification(editingSpec.id, editingSpec.key, editingSpec.value);
      setEditingSpec(null);
      await loadSpecs(); toast("success", "Spec updated!");
    } catch { toast("error", "Failed to update spec"); }
  };

  const handleDeleteSpec = async (id: number) => {
    try { await deleteSpecification(id); await loadSpecs(); }
    catch { toast("error", "Failed to delete spec"); }
  };

  // ── Attributes ────────────────────────────────────────────────────
  const handleAssignAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProductId || !newAttributeValId) return;
    try {
      await assignAttributeValueToProduct(currentProductId, Number(newAttributeValId));
      setNewAttributeValId(""); await loadAttributes(); toast("success", "Attribute assigned!");
    } catch { toast("error", "Failed to assign attribute"); }
  };

  const handleRemoveAttribute = async (valId: number) => {
    if (!currentProductId) return;
    try { await removeAttributeValueFromProduct(currentProductId, valId); await loadAttributes(); }
    catch { toast("error", "Failed to remove attribute"); }
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard__modal">
      {/* Header */}
      <div className="admin-dashboard__modal-header">
        <h2>{product ? `Edit: ${product.title}` : "Add New Product"}</h2>
        <button className="admin-dashboard__close-btn" onClick={onClose}>&times;</button>
      </div>

      {/* Tabs */}
      <div className="admin-dashboard__modal-tabs">
        {(["basic", "images", "specs", "attributes"] as TabType[]).map((tab) => {
          const labels: Record<TabType, React.ReactNode> = {
            basic: <><FaCube style={{ marginRight: 6 }} />Basic Info</>,
            images: <><MdPhotoLibrary style={{ marginRight: 6 }} />Images {images.length > 0 && `(${images.length})`}</>,
            specs: <><FaLayerGroup style={{ marginRight: 6 }} />Specs {specs.length > 0 && `(${specs.length})`}</>,
            attributes: <><FaTags style={{ marginRight: 6 }} />Attributes {attributes.length > 0 && `(${attributes.length})`}</>,
          };
          return (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              disabled={tab !== "basic" && !currentProductId}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="admin-dashboard__modal-body">
        {!currentProductId && activeTab !== "basic" && (
          <div className="admin-dashboard__warn-banner">
            ⚠ Save the basic product info first before adding images, specs, or attributes.
          </div>
        )}

        {/* ───── BASIC TAB ───── */}
        {activeTab === "basic" && (
          <div className="admin-dashboard__tab-pane">
            <form onSubmit={handleSaveBasic}>
              <div className="admin-dashboard__form-row">
                <div className="admin-dashboard__form-group">
                  <label>Title *</label>
                  <input name="title" defaultValue={product?.title ?? ""} placeholder="Product title" required />
                </div>
                <div className="admin-dashboard__form-group">
                  <label>SKU *</label>
                  <input name="sku" defaultValue={product?.sku ?? ""} placeholder="SKU-001" required />
                </div>
              </div>

              <div className="admin-dashboard__form-row" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                <div className="admin-dashboard__form-group">
                  <label>Sell Price *</label>
                  <input type="number" step="0.01" min="0" name="sellPrice" defaultValue={product?.sellPrice ?? 0} required />
                </div>
                <div className="admin-dashboard__form-group">
                  <label>Cost Price *</label>
                  <input type="number" step="0.01" min="0" name="costPrice" defaultValue={product?.costPrice ?? 0} required />
                </div>
                <div className="admin-dashboard__form-group">
                  <label>Discount (%)</label>
                  <input type="number" min="0" max="100" name="discount" defaultValue={product?.discount ?? 0} />
                </div>
                <div className="admin-dashboard__form-group">
                  <label>Quantity *</label>
                  <input type="number" min="0" name="quantity" defaultValue={product?.quantity ?? 1} required />
                </div>
              </div>

              <div className="admin-dashboard__form-row">
                <div className="admin-dashboard__form-group">
                  <label>Category</label>
                  <select name="categoryId" defaultValue={product?.categoryId ?? ""}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="admin-dashboard__form-group">
                  <label>Brand</label>
                  <select name="brandId" defaultValue={product?.brandId ?? ""}>
                    <option value="">Select brand</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-dashboard__form-group">
                <label>Description</label>
                <textarea name="description" rows={3} defaultValue={product?.description ?? ""} placeholder="Product description..." />
              </div>

              <hr className="admin-dashboard__divider" />
              <p className="admin-dashboard__note">
                <FaImage /> Main layout images (cover &amp; second) — also manageable in the Images tab for more control
              </p>

              <div className="admin-dashboard__form-row">
                <div className="admin-dashboard__form-group">
                  <label>Cover Image {currentProductId && "(leave empty to keep)"}</label>
                  <input name="coverImage" type="file" accept="image/*" />
                  {product?.coverImage && (
                    <img src={getImageUrl(product.coverImage)} alt="cover" className="admin-dashboard__preview-thumb" />
                  )}
                </div>
                <div className="admin-dashboard__form-group">
                  <label>Second Image {currentProductId && "(leave empty to keep)"}</label>
                  <input name="secondImage" type="file" accept="image/*" />
                  {product?.secondImage && (
                    <img src={getImageUrl(product.secondImage)} alt="second" className="admin-dashboard__preview-thumb" />
                  )}
                </div>
              </div>

              <div className="admin-dashboard__form-actions align-right">
                <button type="button" className="admin-dashboard__button admin-dashboard__button--ghost" onClick={onClose}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary" disabled={saving}>
                  {saving ? "Saving..." : currentProductId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ───── IMAGES TAB ───── */}
        {activeTab === "images" && currentProductId && (
          <div className="admin-dashboard__tab-pane">
            <div className="admin-dashboard__upload-area">
              <label className="admin-dashboard__upload-label">
                <FaImage />
                {uploadLoading ? "Uploading..." : "Click to upload images"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImages}
                  disabled={uploadLoading}
                  hidden
                />
                <small>PNG, JPG, WEBP · Multiple files supported</small>
              </label>
            </div>

            <div className="admin-dashboard__image-grid">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`admin-dashboard__image-card ${img.isPrimary ? "primary" : ""} ${img.isSecondary ? "secondary" : ""}`}
                >
                  <img src={getImageUrl(img.imageUrl)} alt={img.altText} onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  {img.isPrimary && <span className="admin-dashboard__image-label admin-dashboard__image-label--primary">Primary</span>}
                  {img.isSecondary && !img.isPrimary && <span className="admin-dashboard__image-label admin-dashboard__image-label--secondary">Secondary</span>}
                  <div className="admin-dashboard__image-actions">
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      title="Set as Primary"
                      className={img.isPrimary ? "active-star" : ""}
                    >
                      {img.isPrimary ? <FaStar /> : <FaRegStar />}
                    </button>
                    <button
                      onClick={() => handleSetSecondary(img.id)}
                      title="Set as Secondary"
                      className={img.isSecondary ? "active-secondary" : ""}
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      2nd
                    </button>
                    <button onClick={() => handleDeleteImage(img.id)} className="danger" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <p style={{ gridColumn: "1/-1", color: "var(--admin-text-muted)", textAlign: "center", marginTop: 20 }}>
                  No extra images yet. Upload some above.
                </p>
              )}
            </div>

            <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(88,166,255,0.05)", borderRadius: 10, border: "1px solid rgba(88,166,255,0.15)", fontSize: 13, color: "var(--admin-text-muted)" }}>
              <strong style={{ color: "var(--admin-text-secondary)" }}>⭐ Primary</strong> — main display image &nbsp;·&nbsp;
              <strong style={{ color: "#d2a8ff" }}>2nd Secondary</strong> — hover/secondary display image
            </div>
          </div>
        )}

        {/* ───── SPECS TAB ───── */}
        {activeTab === "specs" && currentProductId && (
          <div className="admin-dashboard__tab-pane">
            <form onSubmit={handleAddSpec} className="admin-dashboard__inline-form">
              <input
                type="text"
                placeholder="Key (e.g. Color)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Value (e.g. Midnight Black)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                required
              />
              <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary">
                <FaPlus /> Add
              </button>
            </form>

            <table className="admin-dashboard__sub-table">
              <thead>
                <tr><th>Key</th><th>Value</th><th style={{ width: 100 }}>Actions</th></tr>
              </thead>
              <tbody>
                {specs.length === 0 && (
                  <tr><td colSpan={3} className="admin-dashboard__empty-cell">No specifications yet</td></tr>
                )}
                {specs.map((spec) => (
                  <tr key={spec.id}>
                    <td>
                      {editingSpec?.id === spec.id ? (
                        <input
                          className="edit-input"
                          value={editingSpec.key}
                          onChange={(e) => setEditingSpec({ ...editingSpec, key: e.target.value })}
                        />
                      ) : spec.key}
                    </td>
                    <td>
                      {editingSpec?.id === spec.id ? (
                        <input
                          className="edit-input"
                          value={editingSpec.value}
                          onChange={(e) => setEditingSpec({ ...editingSpec, value: e.target.value })}
                        />
                      ) : spec.value}
                    </td>
                    <td>
                      {editingSpec?.id === spec.id ? (
                        <>
                          <button className="admin-dashboard__action-btn admin-dashboard__action-btn--edit" onClick={handleSaveEditSpec} title="Save" style={{ marginRight: 4 }}><FaCheck /></button>
                          <button className="admin-dashboard__action-btn" onClick={() => setEditingSpec(null)} title="Cancel"><FaTimes /></button>
                        </>
                      ) : (
                        <>
                          <button
                            className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                            onClick={() => setEditingSpec({ id: spec.id, key: spec.key, value: spec.value })}
                            title="Edit"
                            style={{ marginRight: 4 }}
                          ><FaEdit /></button>
                          <button
                            className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                            onClick={() => handleDeleteSpec(spec.id)}
                            title="Delete"
                          ><FaTrash /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ───── ATTRIBUTES TAB ───── */}
        {activeTab === "attributes" && currentProductId && (
          <div className="admin-dashboard__tab-pane">
            <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(227,179,65,0.08)", border: "1px solid rgba(227,179,65,0.2)", borderRadius: 10, fontSize: 13, color: "var(--admin-warning)" }}>
              Enter the Attribute Value ID from your backend to assign an attribute to this product.
            </div>

            <form onSubmit={handleAssignAttribute} className="admin-dashboard__inline-form">
              <input
                type="number"
                placeholder="Attribute Value ID (e.g. 5)"
                value={newAttributeValId}
                onChange={(e) => setNewAttributeValId(e.target.value)}
                required
                min="1"
              />
              <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary">
                <FaPlus /> Assign
              </button>
            </form>

            <table className="admin-dashboard__sub-table">
              <thead>
                <tr><th>Attribute</th><th>Value</th><th style={{ width: 80 }}>Actions</th></tr>
              </thead>
              <tbody>
                {attributes.length === 0 && (
                  <tr><td colSpan={3} className="admin-dashboard__empty-cell">No attributes assigned</td></tr>
                )}
                {attributes.map((attr) => (
                  <tr key={attr.id}>
                    <td>
                      <span className="admin-dashboard__tag-badge">{attr.attributeName}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{attr.value}</td>
                    <td>
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                        onClick={() => handleRemoveAttribute(attr.id)}
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
