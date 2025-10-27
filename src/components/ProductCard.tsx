import Image from 'next/image';
import { Product } from '@/lib/store/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-blue-600">
            ${product.price}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {product.brand} • {product.category}
          </span>
          <span className="text-sm text-green-600">
            {product.stock} in stock
          </span>
        </div>
        <button className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
