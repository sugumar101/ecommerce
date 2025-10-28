'use client';

import { User, Mail, Calendar } from 'lucide-react';
import Image from 'next/image';

interface ProfilePageClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
  };
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center">
                  <User className="w-16 h-16 text-light-100" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-dark-900 mb-2">{user.name}</h2>
            <p className="text-sm text-dark-600 mb-4">{user.email}</p>
            <div className="flex items-center gap-2 text-sm text-dark-700">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-dark-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-dark-700">Full Name</p>
                <p className="text-base text-dark-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-dark-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-dark-700">Email Address</p>
                <p className="text-base text-dark-900">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark-900 mb-4">Order History</h3>
          <div className="text-center py-8">
            <p className="text-dark-600">No orders yet</p>
            <p className="text-sm text-dark-500 mt-2">
              Start shopping to see your order history here
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark-900 mb-4">Saved Addresses</h3>
          <div className="text-center py-8">
            <p className="text-dark-600">No saved addresses</p>
            <p className="text-sm text-dark-500 mt-2">
              Add addresses during checkout for faster ordering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
