import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { authLogin } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await authLogin(formData);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111113] flex items-center justify-center px-5 py-10 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative w-full max-w-107.5 animate-[fadeIn_.5s_ease-out]">
        {/* Brand */}
        <div className="mb-10 text-center">
          <a
            href="/"
            className="group inline-flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.04em]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#18181b] text-sm font-bold text-white transition-transform duration-300 group-hover:rotate-[-6deg]">
              C
            </span>

            <span>cartora</span>
          </a>

          <h1 className="mt-8 text-[30px] font-semibold tracking-[-0.04em]">
            Welcome back
          </h1>

          <p className="mt-2 text-[14px] leading-6 text-zinc-500">
            Sign in to continue to Cartora.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-zinc-700">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              // value={}
              name="email"
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[13px] font-medium text-zinc-700">
                Password
              </label>

              <a
                href="/forgot-password"
                className="text-[12px] text-zinc-400 transition-colors hover:text-violet-600"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                name="password"
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-16 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              />

              <button
                type="submit"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`group relative mt-2 h-12 w-full overflow-hidden rounded-xl  text-[14px] font-medium text-white transition-all duration-300 hover:-translate-y-[1px]   active:translate-y-0 ${isloading ? "cursor-not-allowed bg-gray-400" : "bg-[#18181b] hover:shadow-xl hover:shadow-violet-500/20 hover:bg-violet-600"}`}
          >
            <span className="relative z-10">
              {isloading ? "Loading..." : "SignIn"}
            </span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>

        {/* Register */}
        <p className="mt-7 text-center text-[13px] text-zinc-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-violet-600"
          >
            Create one
          </a>
        </p>

        <p className="mt-8 text-center text-[11px] text-zinc-400">
          Secure authentication powered by Cartora.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
