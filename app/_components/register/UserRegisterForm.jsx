"use client";
import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, MapPin, Hash } from "lucide-react";
import toast from "react-hot-toast";

// Static imports
import PhoneInput from "react-phone-input-2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "react-phone-input-2/lib/style.css";

import { GoogleLoginButton } from "@/components/OAuthLogin";


const UserRegisterForm = ({ loading, setLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNo, setMobileNo] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function RegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const Address = formData.get("Address");
    const Pincode = formData.get("Pincode");

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/UserRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            MobileNo: mobileNo,
            Email,
            Password,
            Address,
            Pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
        setMobileNo("");
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please try again");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Create User Account
          </CardTitle>
          <CardDescription className="text-slate-600">
            Fill in your details to create your user account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={RegisterUser} className="space-y-6">
            <div className="space-y-1 w-full">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="Name"
                  type="text"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-700">
                Mobile Number
              </Label>
              <PhoneInput
                country={"in"}
                value={mobileNo}
                onChange={(value) => setMobileNo(value)}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  paddingLeft: "48px",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px 0 0 6px",
                  backgroundColor: "#f8fafc",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="Email"
                  type="email"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-slate-700"
              >
                Full Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="address"
                  name="Address"
                  type="text"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="pincode"
                className="text-sm font-medium text-slate-700"
              >
                Area Pincode
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="pincode"
                  name="Pincode"
                  type="number"
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your area pincode"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <hr className="border-1" />
            
            <p className="text-center text-gray-600 font-bold">OR</p>
            
            <GoogleLoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegisterForm;
