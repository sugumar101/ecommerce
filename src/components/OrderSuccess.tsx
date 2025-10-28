import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

interface OrderSuccessProps {
  order: {
    id: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    items: Array<{
      id: string;
      quantity: number;
      priceAtPurchase: string;
      productVariant: {
        id: string;
        sku: string;
        product: {
          id: string;
          name: string;
        };
        color: {
          id: string;
          name: string;
          hexCode: string;
        };
        size: {
          id: string;
          name: string;
        };
        images: Array<{
          url: string;
        }>;
      };
    }>;
    shippingAddress: {
      id: string;
      fullName: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phoneNumber: string | null;
    };
    payment: {
      id: string;
      method: string;
      status: string;
      transactionId: string | null;
      paidAt: Date | null;
    } | null;
  };
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-dark-700 mb-4">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div className="bg-light-200 rounded-lg p-4 inline-block">
          <p className="text-sm text-dark-600">Order Number</p>
          <p className="text-lg font-semibold text-dark-900">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-dark-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            
            <div className="space-y-6">
              {order.items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                const image = variant.images[0]?.url || '';
                const itemTotal = (parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2);

                return (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-light-200 last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-light-100 rounded-lg overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-light-200 flex items-center justify-center">
                          <Package className="w-8 h-8 text-dark-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-dark-600 mb-2">
                        {variant.color.name} / {variant.size.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-dark-700">Qty: {item.quantity}</span>
                        <span className="font-semibold text-dark-900">${itemTotal}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-dark-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-base">
                <span className="text-dark-700">Subtotal</span>
                <span className="font-semibold text-dark-900">
                  ${(parseFloat(order.totalAmount) - 2.00).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-dark-700">Shipping</span>
                <span className="font-semibold text-dark-900">$2.00</span>
              </div>
            </div>

            <div className="border-t border-light-200 pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-dark-900">Total</span>
                <span className="font-bold text-dark-900">${order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-dark-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-dark-600 mb-2">Estimated Delivery</p>
              <p className="font-semibold text-dark-900">
                {estimatedDelivery.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="border-t border-light-200 pt-4">
              <p className="text-sm text-dark-600 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </p>
              <div className="text-sm text-dark-900">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phoneNumber && (
                  <p className="mt-1">{order.shippingAddress.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <p className="text-dark-700">
          A confirmation email has been sent to your email address with order details and tracking information.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-dark-900 text-light-100 rounded-md hover:bg-dark-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          
          <Link
            href="/profile"
            className="px-6 py-3 border border-dark-300 text-dark-900 rounded-md hover:border-dark-900 transition-colors text-center"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
