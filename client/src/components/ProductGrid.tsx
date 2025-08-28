// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// interface Product {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
// }

// const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
//   <div className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer">
//     <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md mb-3" />
//     <h3 className="font-semibold text-lg">{product.title}</h3>
//     <p className="text-red-500 font-bold">{product.price.toLocaleString('ru-RU')} сум</p>
//   </div>
// );

// const ProductGrid: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/products');
//         if (!response.ok) {
//           throw new Error(`Ошибка загрузки: ${response.statusText}`);
//         }
//         const data = await response.json();
//         setProducts(data.data || []);
//       } catch (e: any) {
//         setError(e.message || 'Неизвестная ошибка');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <p className="text-center p-8">Загрузка товаров...</p>;
//   }

//   if (error) {
//     return <p className="text-center p-8 text-red-500">Ошибка: {error}</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto p-4">
//       {products.map((product, i) => (
//         <motion.div
//           key={product.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: i * 0.05, duration: 0.3 }}
//         >
//           <ProductCard product={product} />
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default ProductGrid;
