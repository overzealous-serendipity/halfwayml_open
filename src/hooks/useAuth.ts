import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  return {
    session,
    isLoading,
    isAuthenticated,
    status,
  };
}
