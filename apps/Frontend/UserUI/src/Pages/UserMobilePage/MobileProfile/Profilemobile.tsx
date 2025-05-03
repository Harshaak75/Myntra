import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import FloatingInput from "@/Components/Floatinginputs";

export const Profilemobile = () => {
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Details</h2>

  <div className="space-y-6">
    {/* Email Display */}
    <div>
      <Label htmlFor="email" className="text-sm font-medium">
        Email Address*
      </Label>
      <div className="flex items-center justify-between border rounded-md px-3 py-2 mt-1">
        <span className="text-sm text-gray-700">example@gmail.com</span>
        <CheckCircle className="text-green-600 w-4 h-4" />
      </div>
      <Button variant="outline" className="w-full mt-2">
        Change
      </Button>
    </div>

    {/* Full Name */}
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Full Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
    </div>

    {/* Mobile Number */}
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Mobile Number
      </label>
      <input
        id="mobile"
        name="mobile"
        type="tel"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
    </div>

    {/* Gender Selection */}
    <div className="flex gap-2">
      <Button
        variant={gender === "male" ? "default" : "outline"}
        className="w-full"
        onClick={() => setGender("male")}
      >
        Male
      </Button>
      <Button
        variant={gender === "female" ? "default" : "outline"}
        className="w-full"
        onClick={() => setGender("female")}
      >
        Female
      </Button>
    </div>

    {/* Birthday */}
    <div className="relative">
      <Input
        id="birthday"
        placeholder=" "
        className="peer"
      />
      <Label
        htmlFor="birthday"
        className="absolute left-3 top-1 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-muted-foreground"
      >
        Birthday (dd/mm/yyyy)
      </Label>
    </div>

    {/* Alternate Email */}
    <div className="relative">
      <Input
        id="altEmail"
        type="email"
        placeholder=" "
        className="peer"
      />
      <Label
        htmlFor="altEmail"
        className="absolute left-3 top-1 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-muted-foreground"
      >
        Alternate Email
      </Label>
    </div>

    {/* Hint Name */}
    <div className="relative">
      <Input
        id="hint"
        placeholder=" "
        className="peer"
      />
      <Label
        htmlFor="hint"
        className="absolute left-3 top-1 text-muted-foreground text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-muted-foreground"
      >
        Hint Name
      </Label>
    </div>

    {/* Delete Button */}
    <Button variant="destructive" className="w-full mt-4">
      DELETE ACCOUNT
    </Button>
  </div>
</div>

  );
};
