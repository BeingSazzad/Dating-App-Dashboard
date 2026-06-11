import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/pages/auth/AuthShell";
import { useLoginMutation } from "@/redux/apiSlices/authSlice";
import { toast } from "sonner";



export function LoginPage() {
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = React.useState("superadmin@gmail.com");
  const [password, setPassword] = React.useState("password@");


  // const handleSubmit = async () => {
  //   setError(null);
  //   try {
  //     const result = await login({ email, password }).unwrap();
  //     dispatch(setCredentials(result));
  //     const to = (location.state as LocationState)?.from?.pathname ?? "/";
  //     navigate(to, { replace: true });
  //   } catch {
  //     setError("Unable to sign in. Please check your credentials.");
  //   }
  // };
  const handleSubmit = async () => {
    try {
      toast.promise(login({ email, password }).unwrap(), {
        loading: 'Logging in...',
        success: (res) => {
          // console.log(res)
          // if (
          //     res?.success === false &&
          //     res?.message === "Please verify your account, then try to login again"
          // ) {
          //     try {
          //         resendOtp({ email: values.email }).unwrap();
          //         navigate('/verify-otp');
          //         return 'OTP sent. Please verify your account.';
          //     } catch (otpErr) {
          //         return 'Failed to resend OTP';
          //     }
          // }
          // console.log(res);
          localStorage.setItem('token', res?.data?.createToken);
          navigate(`/`);
          return res.message || 'Login successful';
        },
        error: async (err) => {
          const message =
            err?.data?.message ||
            err?.data?.errorMessages?.[0]?.message ||
            'Login failed';

          // if (
          //     message === "Please verify your account, then try to login again"
          // ) {
          //     try {
          //         await resendOtp({ email: values.email }).unwrap();
          //         navigate('/verify-otp');
          //         return 'OTP sent. Please verify your account.';
          //     } catch (otpErr) {
          //         return 'Failed to resend OTP';
          //     }
          // }

          return message;
        },
      });
    } catch (error) {
      const err = error as any;
      console.log(err.data.errorMessages[0].message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to the RATED admin console."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ratedapp.io"
            autoComplete="email"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          Sign in
        </Button>



        <p className="rounded-lg bg-muted/60 px-3 py-2 text-center text-xs text-muted-foreground">
          Demo mode — any email & password works.
        </p>
      </div>
    </AuthShell>
  );
}
