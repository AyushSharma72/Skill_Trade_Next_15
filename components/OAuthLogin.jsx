"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push("http://localhost:8000/api/google");
  };

  return (
    <div className="flex justify-center items-center">
      <Button
        onClick={handleGoogleLogin}
        className="bg-gray-900 hover:bg-gray-800 hover:scale-105 shadow-lg text-white px-4 py-2 rounded-full min-w-[40%]"
      >
        <Image src={"/assets/google.png"} alt="Google" width={25} height={25}/>
      </Button>
      
    </div>
  );
};
