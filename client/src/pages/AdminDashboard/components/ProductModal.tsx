import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { type Product } from "../../../../store/slices/productSlice";
import { type CategoryDto } from "../../../../api/categories";
import { type BrandDto } from "../../../../api/brands";
import { createProduct, updateProduct, type AdminProductPayload } from "../../../../api/products";
import { 
  getImagesByProductId, 
  addImages, 
  deleteImages, 
  setPrimaryImage, 
  setSecondaryImage,
  type ProductImageDto 
} from "../../../../api/productImages";
import { 
  getSpecificationsByProductId, 
  createSpecification, 
  deleteSpecification,
  type ProductSpecificationDto
} from "../../../../api/productSpecifications";
import {
  getProductAttributes,
  assignAttributeValueToProduct,
  removeAttributeValueFromProduct,
  type ProductAttributeValueDto
} from "../../../../api/productAttributes";
import { FaTrash, FaStar, FaRegStar, FaImage, FaPlus } from "react-icons/fa";

interface ProductModalProps {
  product: Product | null;
  categories: CategoryDto[];
  brands: BrandDto[];
  onClose: () => void;
}

type TabType = "basic" | "images" | "specs" | "attributes";

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  brands,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  
  // Basic Info State
  const [savingProduct, setSavingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(product?.id || null);

  // Images State
  const [images, setImages] = useState<ProductImageDto[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Specs State
  const [specs, setSpecs] = useState<ProductSpecificationDto[]>([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Attributes State
  const [attributes, setAttributes] = useState<ProductAttributeValueDto[]>([]);
  const [newAttributeValId, setNewAttributeValId] = useState(""); // Simplified: just entering an ID or selecting from a generic list if we had one.

  useEffect(() => {
    if (currentProductId) {
      loadImages();
      loadSpecs();
      loadAttributes();
    }
  }, [currentProductId]);

  const loadImages = async () => {
    if (!currentProductId) return;
    try {
      const data = await getImagesByProductId(currentProductId);
      setImages(data);
    } catch { /* ignore */ }
  };

  const loadSpecs = async () => {
    if (!currentProductId) return;
    try {
      const data = await getSpecificationsByProductId(currentProductId);
      setSpecs(data);
    } catch { /* ignore */ }
  };

  const loadAttributes = async () => {
    if (!currentProductId) return;
    try {
      const data = await getProductAttributes(currentProductId);
      setAttributes(data);
    } catch { /* ignore */ }
  };

  const handleSaveBasic = async (event: React.FormEvent<HTMLFormElement>) => {
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
      if (currentProductId) {
        await updateProduct(currentProductId, payload);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Product updated!", showConfirmButton: false, timer: 1500, background: "#1a1a2e", color: "#fff" });
        onClose();
      } else {
        const result = await createProduct(payload);
        // Assuming result contains the new product ID. If not, we just close.
        if (result && result.id) {
            setCurrentProductId(result.id);
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Product created! You can now add images & specs.", showConfirmButton: false, timer: 3000, background: "#1a1a2e", color: "#fff" });
            setActiveTab("images");
        } else {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Product created!", showConfirmButton: false, timer: 1500, background: "#1a1a2e", color: "#fff" });
            onClose();
        }
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save product", background: "#1a1a2e", color: "#fff" });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !currentProductId) return;
    const formData = new FormData();
    // Assuming the DTOs expect files we'll append them.
    // The endpoint expects IList<ProductImageCreateDto>, which usually binds from FormData fields.
    // Let's adapt base API approach:
    Array.from(e.target.files).forEach((file, ind) => {
        formData.append(`dtos[${ind}].File`, file);
        formData.append(`dtos[${ind}].AltText`, product?.name || "Product Image");
    });
    
    setUploadLoading(true);
    try {
        await addImages(currentProductId, formData);
        await loadImages();
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Images uploaded!", showConfirmButton: false, timer: 1500, background: "#1a1a2e", color: "#fff" });
    } catch {
        Swal.fire({ icon: "error", title: "Error", text: "Upload failed", background: "#1a1a2e", color: "#fff" });
    } finally {
        setUploadLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
      try {
          // Hard delete
          await deleteImages([imageId], 1); 
          await loadImages();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Delete failed", background: "#1a1a2e", color: "#fff" });
      }
  };

  const handleSetPrimary = async (imageId: number) => {
      if(!currentProductId) return;
      try {
          await setPrimaryImage(currentProductId, imageId);
          await loadImages();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Update failed", background: "#1a1a2e", color: "#fff" });
      }
  };

  const handleAddSpec = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!currentProductId || !newSpecKey || !newSpecValue) return;
      try {
          await createSpecification(currentProductId, newSpecKey, newSpecValue);
          setNewSpecKey("");
          setNewSpecValue("");
          await loadSpecs();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to add spec", background: "#1a1a2e", color: "#fff" });
      }
  };

  const handleDeleteSpec = async (id: number) => {
      try {
          await deleteSpecification(id);
          await loadSpecs();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to delete spec", background: "#1a1a2e", color: "#fff" });
      }
  };

  const handleAssignAttribute = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!currentProductId || !newAttributeValId) return;
      try {
          await assignAttributeValueToProduct(currentProductId, Number(newAttributeValId));
          setNewAttributeValId("");
          await loadAttributes();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to assign", background: "#1a1a2e", color: "#fff" });
      }
  }

  const handleRemoveAttribute = async (valId: number) => {
      if(!currentProductId) return;
      try {
          await removeAttributeValueFromProduct(currentProductId, valId);
          await loadAttributes();
      } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to remove", background: "#1a1a2e", color: "#fff" });
      }
  }

  return (
    <div className="admin-dashboard__modal">
      <div className="admin-dashboard__modal-header">
        <h2>{product ? `Edit: ${product.name}` : "Add New Product"}</h2>
        <button className="admin-dashboard__close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="admin-dashboard__modal-tabs">
          <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>Basic Info</button>
          <button 
            className={activeTab === 'images' ? 'active' : ''} 
            onClick={() => setActiveTab('images')}
            disabled={!currentProductId}
          >Images</button>
          <button 
            className={activeTab === 'specs' ? 'active' : ''} 
            onClick={() => setActiveTab('specs')}
            disabled={!currentProductId}
          >Specifications</button>
          <button 
            className={activeTab === 'attributes' ? 'active' : ''} 
            onClick={() => setActiveTab('attributes')}
            disabled={!currentProductId}
          >Attributes</button>
      </div>

      <div className="admin-dashboard__modal-body">
          {(!currentProductId && activeTab !== 'basic') && (
              <div className="admin-dashboard__warn-banner">
                  Please save the basic product information first.
              </div>
          )}

          {activeTab === 'basic' && (
            <form className="admin-dashboard__form" onSubmit={handleSaveBasic}>
            <div className="admin-dashboard__form-row">
              <div className="admin-dashboard__form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  defaultValue={product?.name ?? ""}
                  required
                />
              </div>
              <div className="admin-dashboard__form-group">
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" defaultValue={product?.sku ?? ""} required />
              </div>
            </div>

            <div className="admin-dashboard__form-row">
              <div className="admin-dashboard__form-group">
                <label htmlFor="sellPrice">Sell Price</label>
                <input
                  type="number"
                  step="0.01"
                  id="sellPrice"
                  name="sellPrice"
                  defaultValue={product?.price ?? 0}
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
                  defaultValue={product?.price ?? 0} /* Assuming same for mockup */
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
            </div>

            <div className="admin-dashboard__form-row">
              <div className="admin-dashboard__form-group">
                <label htmlFor="categoryId">Category</label>
                <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""}>
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
                <select id="brandId" name="brandId" defaultValue={product?.brandId ?? ""}>
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
                defaultValue={product?.description ?? ""}
              />
            </div>

            <hr className="admin-dashboard__divider" />
            <p className="admin-dashboard__note">For main layout images (Fallback endpoints)</p>
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

            <div className="admin-dashboard__form-actions align-right">
                <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary" disabled={savingProduct}>
                {savingProduct ? "Saving..." : "Save Product Data"}
                </button>
            </div>
          </form>
          )}

          {activeTab === 'images' && currentProductId && (
              <div className="admin-dashboard__tab-pane">
                  <div className="admin-dashboard__upload-area">
                      <label className="admin-dashboard__upload-label">
                          <FaImage /> {uploadLoading ? "Uploading..." : "Upload Extra Images"}
                          <input type="file" multiple accept="image/*" onChange={handleAddImages} disabled={uploadLoading} hidden />
                      </label>
                  </div>
                  
                  <div className="admin-dashboard__image-grid">
                      {images.map(img => (
                          <div key={img.id} className={`admin-dashboard__image-card ${img.isPrimary ? 'primary' : ''}`}>
                              <img src={img.imageUrl} alt={img.altText} />
                              <div className="admin-dashboard__image-actions">
                                  <button onClick={() => handleSetPrimary(img.id)} title="Set Primary" className={img.isPrimary ? 'active-star' : ''}>
                                      {img.isPrimary ? <FaStar /> : <FaRegStar />}
                                  </button>
                                  <button onClick={() => handleDeleteImage(img.id)} className="danger">
                                      <FaTrash />
                                  </button>
                              </div>
                          </div>
                      ))}
                      {images.length === 0 && <p>No extra images found.</p>}
                  </div>
              </div>
          )}

          {activeTab === 'specs' && currentProductId && (
              <div className="admin-dashboard__tab-pane">
                  <form onSubmit={handleAddSpec} className="admin-dashboard__inline-form">
                      <input type="text" placeholder="Key (e.g. Color)" value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} required />
                      <input type="text" placeholder="Value (e.g. Red)" value={newSpecValue} onChange={(e) => setNewSpecValue(e.target.value)} required />
                      <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary"><FaPlus /> Add Spec</button>
                  </form>
                  <table className="admin-dashboard__sub-table">
                      <thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>
                      <tbody>
                          {specs.map(spec => (
                              <tr key={spec.id}>
                                  <td>{spec.key}</td>
                                  <td>{spec.value}</td>
                                  <td><button onClick={() => handleDeleteSpec(spec.id)} className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"><FaTrash /></button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {activeTab === 'attributes' && currentProductId && (
              <div className="admin-dashboard__tab-pane">
                  <form onSubmit={handleAssignAttribute} className="admin-dashboard__inline-form">
                      <input type="number" placeholder="Attribute Value ID (e.g. 1)" value={newAttributeValId} onChange={(e) => setNewAttributeValId(e.target.value)} required />
                      <button type="submit" className="admin-dashboard__button admin-dashboard__button--primary"><FaPlus /> Assign</button>
                  </form>
                  <table className="admin-dashboard__sub-table">
                      <thead><tr><th>Attribute</th><th>Value</th><th></th></tr></thead>
                      <tbody>
                          {attributes.map(attr => (
                              <tr key={attr.id}>
                                  <td>{attr.attributeName}</td>
                                  <td>{attr.value}</td>
                                  <td><button onClick={() => handleRemoveAttribute(attr.id)} className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"><FaTrash /></button></td>
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
