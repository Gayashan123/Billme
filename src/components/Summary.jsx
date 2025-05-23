import { useEffect, useState } from "react";

const Summary = () => {
  const [investment, setInvestment] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [items, setItems] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];

  // Load data from localStorage on mount
  useEffect(() => {
    const invData = localStorage.getItem("dailyData");
    if (invData) {
      const parsed = JSON.parse(invData);
      if (parsed.date === todayDate) {
        setInvestment(parsed.investment.toString());
      } else {
        setInvestment("");
      }
    }

    const savedItems = localStorage.getItem("shopItems");
    if (savedItems) {
      const allItems = JSON.parse(savedItems);
      // Filter today's items only
      const todaysItems = allItems.filter((item) => item.date === todayDate);
      setItems(todaysItems);
    }
  }, [todayDate]);

  // Save investment immediately on change
  useEffect(() => {
    if (investment === "") return; // Don't save empty investment
    const data = { investment: parseFloat(investment), date: todayDate };
    localStorage.setItem("dailyData", JSON.stringify(data));
  }, [investment, todayDate]);

  const handleAddItem = () => {
    // Validate inputs
    if (
      !itemName.trim() ||
      !quantity ||
      isNaN(quantity) ||
      !costPrice ||
      isNaN(costPrice) ||
      !sellPrice ||
      isNaN(sellPrice)
    ) {
      alert("Please fill all fields correctly.");
      return;
    }

    const newItem = {
      itemName: itemName.trim(),
      quantity: parseInt(quantity),
      costPrice: parseFloat(costPrice),
      sellPrice: parseFloat(sellPrice),
      date: todayDate,
    };

    // Add new item to current items
    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Save all items to localStorage, including previous days' items
    const allSavedItems = JSON.parse(localStorage.getItem("shopItems")) || [];

    // Filter out today's items, replace with updated
    const filteredOthers = allSavedItems.filter((item) => item.date !== todayDate);

    localStorage.setItem("shopItems", JSON.stringify([...filteredOthers, ...updatedItems]));

    // Reset input fields
    setItemName("");
    setQuantity("");
    setCostPrice("");
    setSellPrice("");
  };

  // Totals calculated on every render
  const totalCost = items.reduce((acc, item) => acc + item.costPrice * item.quantity, 0);
  const totalSales = items.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);
  const totalProfit = totalSales - totalCost;
  const totalSoldItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const finalBalance = parseFloat(investment || 0) + totalProfit;

  const handleDownloadSummary = () => {
    const content = `
📅 Daily Summary Report - ${todayDate}

🛒 Items Sold: ${totalSoldItems} item(s)
💰 Investment: Rs. ${parseFloat(investment || 0).toFixed(2)}
🧾 Total Cost: Rs. ${totalCost.toFixed(2)}
💵 Total Sales: Rs. ${totalSales.toFixed(2)}
📈 Total Profit: Rs. ${totalProfit.toFixed(2)}

🏦 Final Balance: Rs. ${finalBalance.toFixed(2)}

🗜️ Item List:
${items
  .map(
    (item) =>
      `- ${item.itemName}: Rs.${item.sellPrice.toFixed(2)} × ${item.quantity} = Rs.${(
        item.sellPrice * item.quantity
      ).toFixed(2)} (Profit: Rs.${((item.sellPrice - item.costPrice) * item.quantity).toFixed(2)})`
  )
  .join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Summary-${todayDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      localStorage.removeItem("dailyData");
      localStorage.removeItem("shopItems");
      setInvestment("");
      setItems([]);
      setItemName("");
      setQuantity("");
      setCostPrice("");
      setSellPrice("");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded mt-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Daily Business Tracker</h2>

      {/* Investment Input */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">💰 Enter Today's Investment</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Enter amount in Rs."
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

     

      <hr className="my-6" />

      {/* Summary */}
      <h3 className="text-xl font-semibold mb-4">📋 Daily Summary</h3>
      {items.length === 0 ? (
        <p className="italic text-gray-500">No items added yet for today.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Item</th>
                <th className="border border-gray-300 px-2 py-1">Qty</th>
                <th className="border border-gray-300 px-2 py-1">Cost Price (Rs.)</th>
                <th className="border border-gray-300 px-2 py-1">Sell Price (Rs.)</th>
                <th className="border border-gray-300 px-2 py-1">Total Cost</th>
                <th className="border border-gray-300 px-2 py-1">Total Sales</th>
                <th className="border border-gray-300 px-2 py-1">Profit</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const totalCostItem = item.costPrice * item.quantity;
                const totalSellItem = item.sellPrice * item.quantity;
                const profitItem = totalSellItem - totalCostItem;
                return (
                  <tr key={idx} className="text-center">
                    <td className="border border-gray-300 px-2 py-1">{item.itemName}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.costPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.sellPrice.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">{totalCostItem.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">{totalSellItem.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">{profitItem.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <p>
          <strong>📦 Items Sold:</strong> {totalSoldItems}
        </p>
        <p>
          <strong>💰 Investment:</strong> Rs. {parseFloat(investment || 0).toFixed(2)}
        </p>
        <p>
          <strong>🧾 Total Cost:</strong> Rs. {totalCost.toFixed(2)}
        </p>
        <p>
          <strong>💵 Total Sales:</strong> Rs. {totalSales.toFixed(2)}
        </p>
        <p>
          <strong>📈 Total Profit:</strong> Rs. {totalProfit.toFixed(2)}
        </p>
        <p className="text-lg font-semibold mt-3">
          🏦 Final Balance: Rs. {finalBalance.toFixed(2)}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row sm:gap-4">
        <button
          onClick={handleDownloadSummary}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-3 sm:mb-0"
        >
          📥 Download Summary Report
        </button>

        <button
          onClick={handleResetAll}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🗑️ Reset All Data
        </button>

        <button
    onClick={() => window.location.reload()}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    🔄 Refresh
  </button>
      </div>
    </div>
  );
};

export default Summary;
