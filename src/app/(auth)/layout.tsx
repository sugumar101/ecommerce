import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-900 text-light-100 flex-col justify-between p-12">
        <div>
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-light-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.103-1.447 1.906-2.21C3.93 7.54 5.01 6.82 6.21 6.34c1.2-.48 2.43-.72 3.668-.72 1.456 0 2.886.336 4.29 1.008L24 7.8z"/>
              </svg>
            </div>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Just Do It
          </h1>
          <p className="text-lg text-light-300 max-w-md">
            Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
          </p>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-light-100"></div>
            <div className="w-3 h-3 rounded-full bg-light-400"></div>
            <div className="w-3 h-3 rounded-full bg-light-400"></div>
          </div>
        </div>

        <div className="text-sm text-light-400">
          © 2024 Nike. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center bg-light-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
