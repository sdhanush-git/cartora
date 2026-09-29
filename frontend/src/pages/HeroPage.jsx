import React, { useEffect } from "react";
import Card from "../components/Card.jsx";
import { useProduct } from "../context/ProductContext.jsx";

const HeroPage = () => {
  const { products, getProducts } = useProduct();

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default HeroPage;
