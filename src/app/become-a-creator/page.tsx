import { SignUpForm } from "@/components/signup-form";
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#6A57E3] p-12 text-white relative">
        <div className="absolute top-20 left-12 max-w-sm">
            <div className="bg-white text-black p-4 rounded-lg rounded-bl-none shadow-lg">
                <p className="text-lg">What better way to teach or learn than in a community of your allies 🥰</p>
            </div>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1887&auto=format&fit=crop"
          alt="Community of creators"
          width={600}
          height={800}
          className="rounded-lg object-cover"
          data-ai-hint="people working together"
        />
      </div>
      <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
