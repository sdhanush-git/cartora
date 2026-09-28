import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

export default function RegisterPage() {
  const { authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authRegister(formData);
      console.log("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111113] flex items-center justify-center px-5 py-10 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative w-full max-w-[430px] animate-[fadeIn_.5s_ease-out]">
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
            Create your account
          </h1>

          <p className="mt-2 text-[14px] leading-6 text-zinc-500">
            Start your Cartora journey.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-zinc-700">
              Name
            </label>

            <input
              name="username"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-zinc-700">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-zinc-700">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-16 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-zinc-700">
              Confirm password
            </label>

            <input
              name="confiromPassword"
              type="password"
              placeholder="Repeat your password"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-[14px] outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`group relative mt-2 h-12 w-full overflow-hidden rounded-xl  text-[14px] font-medium text-white transition-all duration-300 hover:-translate-y-[1px]  hover:shadow-xl hover:shadow-violet-500/20 active:translate-y-0 ${isloading ? "cursor-not-allowed bg-gray-400" : "bg-[#18181b] hover:bg-violet-600"}`}
          >
            <span className="relative z-10">
              {isloading ? "Almost there..." : "Create account"}
            </span>

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>

        {/* Login */}
        <p className="mt-7 text-center text-[13px] text-zinc-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-violet-600"
          >
            Sign in
          </a>
        </p>

        <p className="mt-8 text-center text-[11px] leading-5 text-zinc-400">
          By creating an account, you agree to Cartora's terms and privacy
          policy.
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
