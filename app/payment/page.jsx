import PrivateRoute from '@/components/PrivateRoute';
import PaymentClient from '@/components/PaymentClient';

export const metadata = {
  title: 'Upgrade to Premium | PromtNest',
  description: 'Unlock lifetime access to all premium private prompts.',
};

export default function PaymentPage() {
  return (
    <PrivateRoute>
      <PaymentClient />
    </PrivateRoute>
  );
}
