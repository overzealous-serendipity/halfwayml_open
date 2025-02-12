import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

interface LoginFormData {
  email: string;
  password: string;
  name?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isSignup) {
        // Validate password on signup
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        if (!name) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        // Call signup API
        const response = await axios.post("/api/auth/signup", {
          email,
          password,
          name,
        });

        if (response.status === 201) {
          // Automatically sign in after successful signup
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (result?.error) {
            setError("Error signing in after signup");
          } else {
            router.push("/");
          }
        }
      } else {
        // Handle login
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`${isSignup ? "Sign Up" : "Login"} - Halfway`}</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/cover.png')",
            filter: "brightness(0.5)",
          }}
        ></div>

        {/* Login Form */}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm shadow-xl rounded-lg px-8 py-10 space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-xl text-gray-300">
                {isSignup ? "Sign up for a new account" : "Sign in to your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div className="form-control">
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="block w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
              )}

              <div className="form-control">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="block w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>

              <div className="form-control">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={`block w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    error && error.includes('Password') ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                  minLength={8}
                />
                {isSignup && (
                  <label className="label mt-2">
                    <span className="text-sm text-gray-400">
                      Password must be at least 8 characters and contain uppercase, lowercase, number, and special character
                    </span>
                  </label>
                )}
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : isSignup ? (
                  "Sign up"
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="text-center text-gray-300">
              <span>
                {isSignup ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
