import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { FaCheck } from "react-icons/fa";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("readData")) || []
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const handleLocalStore = (data) => {
    const newData = [...cartItems];
    const existId = newData.some((item) => item._id === data._id);

    if (!existId) {
      newData.push(data);
      localStorage.setItem("readData", JSON.stringify(newData));
      setCartItems(newData);
    }
  };

  useEffect(() => {
    fetch("http://localhost:7000/read/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "all" || item.categ.toLowerCase() === category.toLowerCase();
    const matchesStatus =
      status === "all" || item.status.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["all", ...new Set(products.map((item) => item.categ))];

  return (
    <>
      <Header />

      <div className="flex flex-col w-full px-4 sm:px-10 md:px-20 items-center justify-center">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center my-6 w-full justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Products */}
        <div className="flex gap-6 flex-wrap justify-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((items) => {
              const isInCart = cartItems.some((p) => p._id === items._id);
              return (
                <div
                  key={items._id}
                  className="mt-6 border p-4 rounded-lg shadow-md w-full sm:w-60 bg-white hover:shadow-xl transition flex flex-col"
                >
                  <img
                    className="rounded-xl h-40 w-full object-cover"
                    src={`https://som-store-bacend.onrender.com/AlImages/${items.prImg}`}
                    alt={items.name}
                  />
                  <h1 className="mt-3 font-semibold text-gray-800">
                    {items.name}
                  </h1>
                  <h1 className="text-sm text-gray-500">
                    <span>{items.status}</span> | <span>{items.quantity} pcs</span>
                  </h1>
                  <div className="mt-2">
                    <h1 className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        {items.price}$
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        344$
                      </span>
                    </h1>
                    <button
                      onClick={() => handleLocalStore(items)}
                      className={`mt-3 w-full px-4 py-2 rounded-lg font-semibold transition ${
                        isInCart
                          ? "bg-blue-600 text-white flex items-center justify-center gap-2"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <FaCheck /> Added
                        </>
                      ) : (
                        "Add To Cart"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-lg mt-10">No products found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
