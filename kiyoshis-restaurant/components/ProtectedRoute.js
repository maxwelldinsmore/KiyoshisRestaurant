import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/admin/login");
      return;
    }

    if (requireAdmin && !isAdmin()) {
      router.push("/");
      return;
    }
  }, [user, isLoading, requireAdmin, router, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin())) {
    return null;
  }

  return children;
}
