import { signInAction, googleAuthAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default async function Login(props: {
  searchParams: Promise<Message>;
  params: Promise<{ locale: string }>;
}) {
  const searchParams = await props.searchParams;
  const paramDetails = await props.params;   // Await the resolution of the params promise
  const locale = paramDetails.locale;  
  return (
    <form className="flex flex-col min-w-64 max-w-64 mt-10 mx-auto allign-center">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don&apos;t have an account?{" "}
        <Link className="text-foreground font-medium underline" href={`/${locale}/sign-up`}>
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href={`/${locale}/forgot-password`}
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <button onClick={googleAuthAction} className="btn btn-primary">
          Sign in with Google
        </button>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
