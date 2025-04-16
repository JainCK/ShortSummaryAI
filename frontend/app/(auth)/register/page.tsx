import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">ShortSummaryAI</h1>
          <p className="text-gray-600 mt-2">
            Create your account to get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
