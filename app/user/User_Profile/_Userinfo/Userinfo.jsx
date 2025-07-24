"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  AlertTriangle,
  Loader2,
  Home,
  CheckCircle,
  Upload,
} from "lucide-react";
import { GetUserInfo } from "./fetchfunction/GetUserInfo";
import { UpdateUserInfo } from "./fetchfunction/UpdateUserInfo";
import { useAuth } from "../../../_context/UserAuthContent";

const Userinfo = () => {
  const [auth, setAuth] = useAuth();
  const [openmodal, SetOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });
  const [GeneratedOtp, SetGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [Loading, SetLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [emailVerified, SetEmailVerified] = useState(false);
  const [imgurl, SetImgUrl] = useState(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/GetUserImage/${auth?.user?._id}`
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  async function getuserdata() {
    try {
      const response = await GetUserInfo(auth?.user?._id);
      if (response.data.success) {
        SetEmailVerified(response.data.user.email_verified);
        setFormData({
          name: response.data.user.Name || "",
          mobile: response.data.user.MobileNo || "",
          email: response.data.user.Email || "",
          address: response.data.user.Address || "",
          pincode: response.data.user.Pincode || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateuserdata() {
    if (auth?.user?._id) {
      try {
        setOpenBackdrop(true);
        const data = new FormData();
        data.append("Name", formData.name);
        data.append("MobileNo", formData.mobile);
        data.append("Email", formData.email);
        data.append("Address", formData.address);
        data.append("Pincode", formData.pincode);

        if (imageFile) data.append("image", imageFile);

        if (!/^\d{6}$/.test(formData.pincode)) {
          toast.error("Pincode must be exactly 6 digits");
          return;
        }

        const response = await UpdateUserInfo(auth?.user?._id, data);

        if (response.success) {
          setAuth({
            ...auth,
            user: response.updateduser,
          });

          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...auth,
              user: response.updateduser,
            })
          );
          toast.success(response.message);
          SetImgUrl(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/GetUserImage/${auth?.user?._id}`
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while updating user info");
      } finally {
        setOpenBackdrop(false);
      }
    }
  }

  function generateOTP(length = 6) {
    SetGeneratedOtp(Math.floor(100000 + Math.random() * 900000).toString());
  }

  async function SendOtp(email) {
    try {
      SetOpenModal(false);
      setOpenBackdrop(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/SendEmailVerificationOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GeneratedOtp, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        SetOpenModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOpenBackdrop(false);
    }
  }

  const verifyOtp = async (email) => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
      SetLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/VerifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            foremail: true,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("verification successfull");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      SetLoading(false);
      SetOpenModal(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) getuserdata();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 ">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center ">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Personal Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account details and preferences
                </p>
              </div>
            </div>

            {!emailVerified && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Your email is unverified. Please{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-amber-700 underline font-medium"
                    onClick={() => {
                      generateOTP();
                      if (GeneratedOtp) {
                        SendOtp(auth?.user?.Email);
                      }
                    }}
                  >
                    verify your email
                  </Button>{" "}
                  to secure your account.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={imgurl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Label
                  htmlFor="profile-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                </Label>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mobile"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                  {emailVerified && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="h-11 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pincode"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter 6-digit pincode"
                  className="h-11"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="address"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  className="h-11"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={updateuserdata}
                disabled={openBackdrop}
                className="h-11 px-8  text-white font-medium"
              >
                {openBackdrop ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Link href="/">
                <Button variant="outline" className="h-11 w-full font-medium">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Verification Modal */}
      <Dialog open={openmodal} onOpenChange={SetOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Verify Your Email
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">
                {auth?.user?.Email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Enter verification code
              </Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="w-full justify-center gap-2">
                  <InputOTPSlot index={0} className="w-12"/>
                  <InputOTPSlot index={1} className="w-12"/>
                  <InputOTPSlot index={2} className="w-12"/>
                  <InputOTPSlot index={3} className="w-12"/>
                  <InputOTPSlot index={4} className="w-12"/>
                  <InputOTPSlot index={5} className="w-12"/>
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-11 "
              onClick={() => verifyOtp(auth?.user?.Email)}
              disabled={Loading || otp.length !== 6}
            >
              {Loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <Button
              variant="link"
              className="text-sm"
              onClick={() => {
                generateOTP();
                if (GeneratedOtp) {
                  SendOtp(auth?.user?.Email);
                }
              }}
            >
              Didn't receive the code? Resend
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => SetOpenModal(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Backdrop */}
      {openBackdrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userinfo;
