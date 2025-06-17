// pages/dashboard.tsx
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  reviews: Review[];
};

type Review = {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

type Category = {
  id: number;
  name: string;
};

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Sample data - in a real app, this would come from an API
  const categories: Category[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Home & Garden' },
    { id: 3, name: 'Fashion' },
    { id: 4, name: 'Sports' },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation.',
      category: 'Electronics',
      thumbnail: '/headphones-thumb.jpg',
      images: ['/headphones-1.jpg', '/headphones-2.jpg', '/headphones-3.jpg'],
      rating: 4.5,
      reviews: [
        {
          id: 1,
          user: 'Alex Johnson',
          rating: 5,
          comment: 'Great sound quality!',
          date: '2025-05-15',
        },
        {
          id: 2,
          user: 'Sarah Miller',
          rating: 4,
          comment: 'Comfortable but battery could last longer.',
          date: '2025-04-22',
        },
      ],
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      description: 'Feature-rich smartwatch with health monitoring.',
      category: 'Electronics',
      thumbnail: '/watch-thumb.jpg',
      images: ['/watch-1.jpg', '/watch-2.jpg'],
      rating: 4.2,
      reviews: [
        {
          id: 3,
          user: 'Michael Chen',
          rating: 4,
          comment: 'Good value for money.',
          date: '2025-06-01',
        },
      ],
    },
    // Add more products as needed
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleBackToDashboard = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleRFQ = () => {
    alert('RFQ request has been sent for ' + selectedProduct?.name);
    // In a real app, this would trigger an API call
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {!showProductDetail ? (
          <>
            {/* Products */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="w-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-600 text-sm ml-1">
                          ({product.reviews.length})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Product Detail View */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-blue-600 hover:text-blue-800 p-4"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to products
            </button>

            <div className="p-6 md:flex">
              {/* Product Images */}
              <div className="md:w-1/2">
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct?.images[0] || selectedProduct?.thumbnail || ''}
                    alt={selectedProduct?.name || ''}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct?.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative h-20 rounded overflow-hidden">
                      <Image
                        src={image}
                        alt={`${selectedProduct?.name} ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                <h1 className="text-3xl font-bold mb-2">{selectedProduct?.name}</h1>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedProduct?.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({selectedProduct?.reviews.length} reviews)
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-800 mb-4">
                  ${selectedProduct?.price.toFixed(2)}
                </p>
                <p className="text-gray-700 mb-6">{selectedProduct?.description}</p>

                <Button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors' asChild size="lg" variant="secondary">
                    <Link href={`/buyer/request-quote/${1234}`}>Request RFQ</Link>
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
              {selectedProduct?.reviews.length ? (
                <div className="space-y-6">
                  {selectedProduct.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="font-medium">{review.user}</div>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">{review.comment}</p>
                      <p className="text-gray-400 text-sm">{review.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;