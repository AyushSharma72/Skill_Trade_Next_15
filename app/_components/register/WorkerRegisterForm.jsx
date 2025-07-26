"use client";
import { useState, useRef } from "react";
import { Eye, EyeOff, User, Mail, MapPin, Hash, Wrench } from "lucide-react";
import toast from "react-hot-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-phone-input-2/lib/style.css";

import { GoogleLoginButton } from "@/components/OAuthLogin";

const WorkerRegisterForm = ({ setLoading, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const debounceTimeout = useRef(null);
  const API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  const handleAddressChange = (query) => {
    console.log("working");
    setAddress(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (query.length < 2) return;

      const response = await fetch(
        `https://autosuggest.search.hereapi.com/v1/autosuggest?at=28.6139,77.2090&q=${query}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data.items || []);
    }, 1000); // 1s debounce delay
  };

  const selectAddress = (place) => {
    setAddress(place.title);
    setCoordinates({ lat: place.position.lat, lon: place.position.lng });
    setSuggestions([]);
  };

  async function RegisterWorker(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const pincode = formData.get("pincode");

    if (!serviceType) {
      toast.error("Please select a service type");
      return;
    }
    if (Password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    if (!address || !coordinates.lat || !coordinates.lon) {
      toast.error("Please select a valid address from the suggestions");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/WorkerRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            Email,
            MobileNo: mobileNo,
            Address: address,
            Latitude: coordinates.lat,
            Longitude: coordinates.lon,
            Password,
            ServiceType: serviceType,
            pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
        setAddress("");
        setCoordinates({ lat: "", lon: "" });
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
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Create Service Provider Account
          </CardTitle>
          <CardDescription className="text-slate-600">
            Join our platform as a service provider and start earning
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={RegisterWorker} className="space-y-6">
            <div className="space-y-1">
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
              <Label className="text-sm font-medium text-slate-700">
                Your Closest Working Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  required
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Start typing your address..."
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-48 overflow-auto">
                    {suggestions.map((place, index) => (
                      <div
                        key={index}
                        onClick={() => selectAddress(place)}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-slate-800">
                          {place.title}
                        </div>
                        {place.vicinity && (
                          <div className="text-xs text-slate-500 mt-1">
                            {place.vicinity}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                  name="pincode"
                  type="number"
                  required
                  inputProps={{ maxLength: 6 }}
                  className="pl-10 h-12 border-slate-200 focus:border-slate-400"
                  placeholder="Enter your area pincode"
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
              <Label className="text-sm font-medium text-slate-700">
                Service Type
              </Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Select required onValueChange={handleServiceTypeChange}>
                  <SelectTrigger className="h-12 pl-10 border-slate-200 focus:border-slate-400">
                    <SelectValue placeholder="Select your service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="carpenter">Carpenter</SelectItem>
                    <SelectItem value="plumber">Plumber</SelectItem>
                    <SelectItem value="painter">Painter</SelectItem>
                    <SelectItem value="gardener">Gardener</SelectItem>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="locksmith">Locksmith</SelectItem>
                    <SelectItem value="handyman">Handyman</SelectItem>
                    <SelectItem value="welder">Welder</SelectItem>
                    <SelectItem value="pest_control">Pest Control</SelectItem>
                    <SelectItem value="roofer">Roofer</SelectItem>
                    <SelectItem value="tiler">Tiler</SelectItem>
                    <SelectItem value="appliance_repair">
                      Appliance Repair
                    </SelectItem>
                    <SelectItem value="flooring_specialist">
                      Flooring Specialist
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-white font-medium"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Service Provider Account"}
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

export default WorkerRegisterForm;
