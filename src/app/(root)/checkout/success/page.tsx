import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getOrderByStripeSession } from '@/lib/actions/orders';
import OrderSuccess from '@/components/OrderSuccess';
import { Loader2 } from 'lucide-react';

interface CheckoutSuccessPageProps {
  searchParams: { session_id?: string };
}

function OrderSuccessLoader({ sessionId }: { sessionId: string }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-dark-900" />
          <p className="text-dark-700">Loading your order details...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent sessionId={sessionId} />
    </Suspense>
  );
}

async function OrderSuccessContent({ sessionId }: { sessionId: string }) {
  const result = await getOrderByStripeSession(sessionId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <OrderSuccess order={result.data.order} />;
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderSuccessLoader sessionId={sessionId} />
      </div>
    </div>
  );
}
