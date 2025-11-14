import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { loginUser, registerUser } from "@/api/auth";

export const useAuth = () => useContext(AuthContext);

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.access_token);
      toast.success("Successfull login!");
      navigate("/dashboard/home");
    },
    onError: () => {
      toast.error("Login failed: invalid username or password.");
    },
  });

  return {
    loginMutation: mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
};

export function useRegister() {
  const {
    mutate: signUp,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account has successfully been created!");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail || "Failed to register. Try again!"
      );
    },
  });

  return { signUp, isPending, isError, error };
}
