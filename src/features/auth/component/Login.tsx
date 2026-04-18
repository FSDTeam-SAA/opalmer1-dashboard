"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const ROLE_FORBIDDEN_MESSAGE =
  "This dashboard is for admins and administrators only. Your account doesn't have access.";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // The proxy redirects forbidden roles here with ?error=role-forbidden after
  // clearing their session cookie. Surface that as a readable message.
  useEffect(() => {
    if (searchParams.get("error") === "role-forbidden") {
      setError(ROLE_FORBIDDEN_MESSAGE);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        Id: adminId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid credentials");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "administrator") {
        router.push("/administrator/dashboard");
      } else {
        // Teachers/students/parents authenticate successfully but have no
        // dashboard. Sign them out so we don't leave a stranded session that
        // would trip the proxy's role guard on every request.
        await signOut({ redirect: false });
        setError(ROLE_FORBIDDEN_MESSAGE);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Background image with purple overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/auth.png"
          alt="background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#871dad]/50" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-[20px] sm:rounded-[30px] w-full max-w-[440px] sm:max-w-[540px] lg:max-w-[658px] overflow-hidden shadow-2xl">
        {/* Card Header — purple wave section */}
        <div className="relative h-[220px] sm:h-[260px] lg:h-[295px] overflow-hidden">
          {/* Background image shape */}
          <Image
            src="/images/login-header.png"
            alt=""
            fill
            sizes="(max-width: 440px) 440px, (max-width: 540px) 540px, 658px"
            className="object-cover object-left-bottom"
            priority
          />

          {/* Text content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-[72px] pt-8 sm:pt-12 lg:pt-[70px]">
            <h1 className="text-white text-[40px] sm:text-[50px] lg:text-[60px] font-bold leading-none">
              Log In
            </h1>
            <p className="text-[#f5f5f5] text-[14px] sm:text-[18px] lg:text-[20px] leading-[1.4] mt-2 sm:mt-3 max-w-[260px] sm:max-w-[320px]">
              Login to your admin panel to proceed
            </p>
          </div>
        </div>

        {/* Card Body — form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-10 lg:px-[72px] pt-6 sm:pt-8 pb-8 sm:pb-10"
        >
          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 border border-red-200 rounded-[8px] px-4 py-2">
              {error}
            </div>
          )}

          {/* Admin Id field */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-[#333] text-[15px] sm:text-[17px] lg:text-[18px] font-semibold capitalize mb-2">
              Admin Id
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your admin Id"
                required
                className="w-full h-[48px] sm:h-[52px] lg:h-[56px] bg-[#f9f9f9] border border-[#08374d] rounded-[8px] px-4 pr-11 text-[14px] sm:text-[15px] lg:text-[16px] text-[#333] placeholder:text-[#999] outline-none focus:border-[#871dad] transition-colors"
              />
              {adminId && (
                <CheckCircle2
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#871dad]"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Password field */}
          <div className="mb-7 sm:mb-8">
            <label className="block text-[#333] text-[15px] sm:text-[17px] lg:text-[18px] font-semibold capitalize mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-[48px] sm:h-[52px] lg:h-[56px] bg-[#f9f9f9] border border-[#c7c7c7] rounded-[8px] px-4 pr-11 text-[14px] sm:text-[15px] lg:text-[16px] text-[#333] placeholder:text-[#333] placeholder:tracking-[4px] outline-none focus:border-[#871dad] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] sm:h-[52px] lg:h-[56px] bg-[#871dad] hover:bg-[#6e17a0] active:bg-[#5c1387] text-white text-[16px] sm:text-[18px] lg:text-[20px] font-bold uppercase tracking-[2px] rounded-[10px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
