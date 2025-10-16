import { useState } from "react";
import { X } from "lucide-react";
import api from "../api";

export default function AddProductModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    model: "",
    serial_number: "",
    footnote: "",
    category: "electronics",
    quantity: 0,
    unit_price: "",
    supplier_name: "",
    supplier_contact: "",
    supplier_phone: "",
    supplier_email: "",
    supplier_address: "",
    date_supplied: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/inventory/products/", form);
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white rounded-lg p-8 w-full max-w-2xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-emerald-400">
          Add New Product
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            ["name", "Product Name"],
            ["model", "Model"],
            ["serial_number", "Serial Number"],
            ["footnote", "Footnote"],
            ["quantity", "Quantity"],
            ["unit_price", "Unit Price (₦)"],
            ["supplier_name", "Supplier Name"],
            ["supplier_contact", "Contact Person"],
            ["supplier_phone", "Supplier Phone"],
            ["supplier_email", "Supplier Email"],
          ].map(([field, label]) => (
            <div key={field} className="col-span-1">
              <label className="block text-slate-300 text-sm mb-1">{label}</label>
              <input
                name={field}
                type={field === "quantity" ? "number" : "text"}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          ))}

          {/* CATEGORY */}
          <div className="col-span-1">
            <label className="block text-slate-300 text-sm mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="health">Health / Pharmacy</option>
              <option value="agriculture">Agriculture</option>
              <option value="food">Food & Beverage</option>
              <option value="services">Technical / Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DATE SUPPLIED */}
          <div className="col-span-1">
            <label className="block text-slate-300 text-sm mb-1">Date Supplied</label>
            <input
              type="date"
              name="date_supplied"
              value={form.date_supplied}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* SUPPLIER ADDRESS */}
          <div className="col-span-2">
            <label className="block text-slate-300 text-sm mb-1">Supplier Address</label>
            <textarea
              name="supplier_address"
              value={form.supplier_address}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* SUBMIT */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
