import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string | null;
  workspaces: Workspace[];
}

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
}

export const useCurrentWorkspace = (workspaceId: string) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await axios.get<Workspace>(
        `/api/workspaces/${workspaceId}`
      );
      return response.data;
    },
    enabled: !!session?.user?.id && !!workspaceId,
  });
};

export const useUserWorkspaces = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await axios.get<Workspace[]>("/api/workspaces");
      return response.data;
    },
    enabled: !!session?.user?.id,
  });
};

export const useUser = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get<User>("/api/user");
      return response.data;
    },
    enabled: !!session?.user?.id,
  });
};

export const useGetUserRecord = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get<User>("/api/user");
      return response.data; 
    },
    enabled: !!session?.user?.id,
  });
};
