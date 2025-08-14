import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md mx-auto">
        <SignupForm />
      </div>
    </div>
  )
}
