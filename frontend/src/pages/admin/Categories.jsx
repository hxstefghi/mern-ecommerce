import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import api from "../../lib/api";

export default function AdminCategories() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/admin/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
      } else {
        await api.post("/admin/categories", formData);
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-white">Category Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 sm:px-6 py-2 bg-black dark:bg-gray-900 text-white font-light hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base">
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div key={category._id} className="border border-gray-200 p-4 sm:p-6 bg-white">
              <h3 className="text-xl font-light mb-2">{category.name}</h3>
              <p className="text-sm font-light text-gray-500 mb-4">{category.description}</p>
              <p className="text-xs font-light text-gray-400 mb-4">Slug: {category.slug}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-light"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-900 text-sm font-light"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 font-light">No categories found</p>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 dark:text-white focus:border-black dark:focus:border-gray-500 outline-none font-light"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 dark:text-white focus:border-black dark:focus:border-gray-500 outline-none font-light"
                    rows="3"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-black dark:bg-gray-900 text-white font-light hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-700 dark:text-gray-300 font-light hover:border-black dark:hover:border-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
