'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AllProductsContent = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = (products || []).filter(product => 
    product.name.toLowerCase().includes(searchQuery) ||
    product.description?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
      <div className="flex flex-col items-end pt-12">
        <p className="text-2xl font-medium">All products</p>
        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found matching your search.</p>
        )}
      </div>
    </div>
  );
};

const AllProducts = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <AllProductsContent />
      </Suspense>
      <Footer />
    </>
  );
};

export default AllProducts;
