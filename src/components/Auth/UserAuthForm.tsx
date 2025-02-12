import * as React from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type CodeError = {
  message: string;
  isError: boolean;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [codeError, setCodeError] = React.useState<CodeError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setCodeError({
          message: result.error,
          isError: true,
        });
      } else {
        router.push("/");
      }
    } catch (error: any) {
      setCodeError({
        message: error.message,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 ${className}`}
      {...props}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to Transcription App</h1>
          <p className="text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {codeError && codeError.isError && (
          <p className="mt-2 text-sm text-center text-red-600">
            {codeError.message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserAuthForm;
