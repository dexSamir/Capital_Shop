import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchProducts,
  deleteProduct,
  setFilter,
  type Product,
} from "../../../../store/slices/productSlice";
import { fetchCategories, type CategoryDto } from "../../../../api/categories";
import { fetchBrands, type BrandDto } from "../../../../api/brands";
import AdminSearchbar from "../../../components/AdminSearchbar";
import AdminTable from "../../../components/AdminTable";
import ProductModal from "./ProductModal";

const ProductsManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredItems, loading, error } = useAppSelector(
    (state) => state.products,
  );
  
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Products fetched via Dashboard overview or earlier
  }, []);

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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    dispatch(fetchProducts()); // refresh the list
  };

  return (
    <div className="admin-dashboard__section">
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
