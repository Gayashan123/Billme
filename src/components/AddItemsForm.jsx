"use client";

import { useEffect, useRef, useState } from "react";

const AddItemForm = () => {
  const [itemName, setItemName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("shopItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");
  const [editSellPrice, setEditSellPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];

  const tableRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("shopItems", JSON.stringify(items));
  }, [items]);

  const clearForm = () => {
    setItemName("");
    setCostPrice("");
    setSellPrice("");
    setQuantity("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemName || !costPrice || !sellPrice || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    const newItem = {
      id: Date.now(),
      itemName,
      costPrice: parseFloat(costPrice),
      sellPrice: parseFloat(sellPrice),
      quantity: parseInt(quantity),
      date: todayDate,
    };

    setItems((prev) => [...prev, newItem]);
    clearForm();

    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = (id) => {
    const filtered = items.filter((item) => item.id !== id);
    setItems(filtered);
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditItemName(item.itemName);
    setEditCostPrice(item.costPrice);
    setEditSellPrice(item.sellPrice);
    setEditQuantity(item.quantity);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    if (!editItemName || !editCostPrice || !editSellPrice || !editQuantity) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            itemName: editItemName,
            costPrice: parseFloat(editCostPrice),
            sellPrice: parseFloat(editSellPrice),
            quantity: parseInt(editQuantity),
          }
        : item
    );

    setItems(updatedItems);
    setEditingId(null);
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setItems([]);
      clearForm();
      setEditingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-white shadow-2xl rounded-lg max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">🧾 Add Shop Item</h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item Name"
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-blue-500"
          />
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="Cost Price (Rs)"
            min="0"
            step="0.01"
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-blue-500"
          />
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="Sell Price (Rs)"
            min="0"
            step="0.01"
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-blue-500"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            min="1"
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            ➕ Add Item
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            ♻️ Reset All
          </button>
        </div>
      </form>

      {items.length > 0 && (
        <div ref={tableRef}>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            📋 Items for Today ({todayDate})
          </h3>

          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300 shadow-md rounded-md overflow-hidden">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="px-4 py-2 border">Item Name</th>
                  <th className="px-4 py-2 border">Cost Price</th>
                  <th className="px-4 py-2 border">Sell Price</th>
                  <th className="px-4 py-2 border">Qty</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) =>
                  editingId === item.id ? (
                    <tr key={item.id} className="bg-yellow-50">
                      <td className="border p-2">
                        <input
                          type="text"
                          value={editItemName}
                          onChange={(e) => setEditItemName(e.target.value)}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editCostPrice}
                          onChange={(e) => setEditCostPrice(e.target.value)}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editSellPrice}
                          onChange={(e) => setEditSellPrice(e.target.value)}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>
                      <td className="border p-2 flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          ❌ Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.itemName}</td>
                      <td className="border px-4 py-2">Rs.{item.costPrice.toFixed(2)}</td>
                      <td className="border px-4 py-2">Rs.{item.sellPrice.toFixed(2)}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2 flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => startEditing(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItemForm;
