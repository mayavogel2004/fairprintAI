import { SignIn } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Brand header above the form */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="bg-orange-600 rounded-lg p-2">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Fair<span className="text-orange-400">Print</span>
        </span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back</h1>
        <p className="text-zinc-400">
          Sign in to access your document analysis and dispute tracker.
        </p>
      </div>

      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/upload"
      />

      <p className="mt-6 text-zinc-500 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-orange-400 hover:text-orange-300">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
