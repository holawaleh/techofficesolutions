import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import api from "../api";
import AddProductModal from "../components/AddProductModal";

interface Product {
  id: number;
  name: string;
  model: string;
  serial_number: string;
  quantity: number;
  unit_price: string;
  total_value: string;
  supplier_name: string;
  date_supplied: string;
}

export default function InventoryListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/inventory/products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">Inventory</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg text-white font-semibold transition"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-slate-400 text-center">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-slate-400 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-700 rounded-lg">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Serial No</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total Value</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-center">Date Supplied</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-700 hover:bg-slate-800 transition"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.model || "-"}</td>
                  <td className="p-3">{p.serial_number}</td>
                  <td className="p-3 text-center">{p.quantity}</td>
                  <td className="p-3 text-right">₦{Number(p.unit_price).toLocaleString()}</td>
                  <td className="p-3 text-right text-emerald-400">
                    ₦{Number(p.total_value).toLocaleString()}
                  </td>
                  <td className="p-3">{p.supplier_name || "-"}</td>
                  <td className="p-3 text-center">{p.date_supplied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdded={fetchProducts}
        />
      )}
    </div>
  );
}
