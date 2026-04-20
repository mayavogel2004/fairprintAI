import { SignUp } from "@clerk/nextjs";
import { Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="bg-orange-600 rounded-lg p-2">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Fair<span className="text-orange-400">Print</span>
        </span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Create your account</h1>
        <p className="text-zinc-400 mb-4">
          Free to use. No credit card required.
        </p>

        {/* Value props */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-zinc-400">
          {["Unlimited document analysis", "Save disputes to dashboard", "Track deadlines & wins"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/upload"
      />

      <p className="mt-6 text-zinc-500 text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-orange-400 hover:text-orange-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
