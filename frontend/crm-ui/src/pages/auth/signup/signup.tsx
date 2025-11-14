import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRegister } from "@/hooks/auth";

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, isPending } = useRegister();

  const { register, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      signUp(values);
      navigate("/login");
    } catch (error: any) {
      console.error(
        error?.response?.data?.detail || "Failed to register. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>First Name</Label>
                <Input placeholder="John" {...register("first_name")} />
                {formState.errors.first_name && (
                  <p className="text-xs text-red-500">
                    {formState.errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Last Name</Label>
                <Input placeholder="Doe" {...register("last_name")} />
                {formState.errors.last_name && (
                  <p className="text-xs text-red-500">
                    {formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input placeholder="johndoe" {...register("username")} />
              {formState.errors.username && (
                <p className="text-xs text-red-500">
                  {formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input placeholder="john@example.com" {...register("email")} />
              {formState.errors.email && (
                <p className="text-xs text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="********"
                {...register("password")}
              />
              {formState.errors.password && (
                <p className="text-xs text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-2.5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
