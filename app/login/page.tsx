"use client";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./action";

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [state, action] = useFormState(login, undefined);
  const { pending } = useFormStatus();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <form
          action={action}
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
          {state?.error && (
            <p className="text-red-500 capitalize">{state.error}</p>
          )}
          <div>
            <Label
              htmlFor="username"
              className="block text-xs text-gray-600 uppercase"
            >
              Email Address
            </Label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="user@acme.com"
              autoComplete="username"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="enter password"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <input
            type="hidden"
            name="nextUrl"
            value={searchParams.redirect as string}
          />
          <button
            type={pending ? "button" : "submit"}
            aria-disabled={pending}
            className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
          >
            Login
            {pending && (
              <svg
                className="animate-spin ml-2 h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            <span aria-live="polite" className="sr-only" role="status">
              {pending ? "Loading" : "Submit form"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
