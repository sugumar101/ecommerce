import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/actions';
import ProfilePageClient from '@/components/ProfilePageClient';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth?redirect=/profile');
  }

  return (
    <div className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">My Profile</h1>
        <ProfilePageClient user={session.user} />
      </div>
    </div>
  );
}
