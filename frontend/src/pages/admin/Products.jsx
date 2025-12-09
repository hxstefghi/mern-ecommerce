import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function AdminProducts() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
    countInStock: ""
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/admin/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formData);
      } else {
        await api.post("/admin/products", formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category?._id || "",
      stock: product.stock,
      countInStock: product.countInStock
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
      stock: "",
      countInStock: ""
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-light">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light">Product Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-black text-white font-light hover:bg-gray-800 transition-colors"
          >
            Add Product
          </button>
        </div>

        <div className="border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-light">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-light">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-light">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-light">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-green-500 hover:text-gray-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-light mb-6">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black outline-none font-light"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Count In Stock"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:border-black outline-none font-light"
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-black text-white font-light hover:bg-gray-800 transition-colors"
                  >
                    {editingProduct ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-2 border border-gray-300 font-light hover:border-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
