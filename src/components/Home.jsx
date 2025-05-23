import React, { useState } from 'react';
import AddItemForm from './AddItemsForm';
import Summary from './Summary';

function Home() {
  const [showSummary, setShowSummary] = useState(false);

  const toggleSummary = () => {
    setShowSummary(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header */}
      <header className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 drop-shadow-md">
          🏠 Gayashan Meta House
        </h1>
        <p className="text-sm sm:text-base md:text-lg mt-3 sm:mt-4 text-gray-700 max-w-xl sm:max-w-2xl mx-auto">
          Your trusted destination for high-quality products and excellent customer service.
        </p>
      </header>

      {/* About & Contact Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-full sm:max-w-xl md:max-w-4xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-700 mb-3 sm:mb-4">
          📌 About Us
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3">
          Gayashan Meta House helps you track your business with modern tools and intuitive interfaces.
          Use this app to manage daily investments, track sold items, calculate profits, and download summary reports.
        </p>
       
      </section>

      {/* Add Item Form Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-full sm:max-w-lg md:max-w-3xl mx-auto mb-8 sm:mb-10 w-full">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 mb-3 sm:mb-4">
          ➕ Add New Item
        </h2>
        <AddItemForm />
      </section>

      {/* Button to toggle summary */}
      <div className="max-w-full sm:max-w-lg md:max-w-3xl mx-auto mb-6 text-center">
        <button
          onClick={toggleSummary}
          className="bg-purple-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition text-sm sm:text-base md:text-lg"
        >
          {showSummary ? 'Hide Summary' : 'Show Summary'}
        </button>
      </div>

      {/* Summary Section (conditionally rendered) */}
      {showSummary && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-full sm:max-w-lg md:max-w-3xl mx-auto w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 mb-4">📊 Daily Summary</h2>
          <Summary />
        </section>
      )}
    </div>
  );
}

export default Home;
