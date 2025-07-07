'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/buyer`;

type ResetPasswordFormInputs = {
  email: string;
  otp: string;
  newPassword: string;
};

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormInputs>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/updatePassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Password reset successful!");
        router.push('/buyer/dashboard');
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-xl p-6">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                {...register("otp", { required: "OTP is required" })}
              />
              {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="New Password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
