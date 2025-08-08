"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phoneNumber);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [emailPassword, setEmailPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.emailAddress);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhoneEdit = () => {
    setIsEditingPhone(true);
  };

  //   const handlePhoneSave = () => {
  //     setUser({ ...user, phone: editPhone });
  //     setIsEditingPhone(false);
  //   };

  const handlePhoneCancel = () => {
    setEditPhone(user?.phoneNumber);
    setIsEditingPhone(false);
  };

  const handleEmailEdit = () => {
    setNewEmail(user?.emailAddress);
    setEmailPassword("");
    setEmailModalOpen(true);
  };

  //   const handleEmailSave = async () => {
  //     setIsLoading(true);
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     if (emailPassword === "password123") {
  //       setUser({ ...user, email: newEmail });
  //       setEmailModalOpen(false);
  //       setEmailPassword("");
  //     } else {
  //       alert("Incorrect password!");
  //     }
  //     setIsLoading(false);
  //   };

  const handlePasswordVerification = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (currentPassword === "password123") {
      setPasswordVerified(true);
    } else {
      alert("Incorrect current password!");
    }
    setIsLoading(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordVerified(false);
    setPasswordModalOpen(false);
    alert("Password changed successfully!");
    setIsLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "Admin":
        return "bg-gradient-to-r from-[#F87D7D] to-[#F87D7D]/80 text-white border-[#F87D7D]";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {/* Left side: back button + title */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.push("/dashboard/admin")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
              <span className="text-gray-700 font-medium">Back</span>
            </button>

            {/* Icon + Title */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>
        </div>

        <p className="text-gray-600">
          Manage your account information and security settings
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Personal Information Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-[#F87D7D]/5 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#F87D7D]" />
                  Full Name
                </Label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{user?.fullName}</p>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#F87D7D]" />
                  Username
                </Label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{user?.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#F87D7D]" />
                  Email Address
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900">
                      {user?.emailAddress}
                    </p>
                  </div>
                  <Button
                    onClick={handleEmailEdit}
                    size="icon"
                    className="bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white rounded-lg shadow-md"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#F87D7D]" />
                  Phone Number
                </Label>
                <div className="flex items-center gap-2">
                  {isEditingPhone ? (
                    <>
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="flex-1 border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30"
                      />
                      <Button
                        // onClick={handlePhoneSave}
                        size="icon"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handlePhoneCancel}
                        size="icon"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900">
                          {user?.phoneNumber}
                        </p>
                      </div>
                      <Button
                        onClick={handlePhoneEdit}
                        size="icon"
                        className="bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white rounded-lg shadow-md"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#F87D7D]" />
                  Role
                </Label>
                <div>
                  <Badge
                    className={`${getRoleBadgeColor(
                      user?.roles[0].name
                    )} px-4 py-2 text-sm font-semibold shadow-md`}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {user?.roles[0].name}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-[#F87D7D]/5 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-lg flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-600">
                    Change your account password
                  </p>
                </div>
                <Button
                  onClick={() => setPasswordModalOpen(true)}
                  className="bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white px-6 py-2 rounded-lg shadow-md"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Change Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="bg-gradient-to-br from-white to-[#F87D7D]/5 border-[#F87D7D]/20 max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Change Email Address
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                New Email Address
              </Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30"
                placeholder="Enter new email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30"
                placeholder="Enter your current password"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setEmailModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              //   onClick={handleEmailSave}
              disabled={isLoading || !newEmail || !emailPassword}
              className="bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                "Update Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="bg-gradient-to-br from-white to-[#F87D7D]/5 border-[#F87D7D]/20 max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-[#F87D7D] to-[#F87D7D]/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30 pr-10"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {!passwordVerified ? (
              <Button
                onClick={handlePasswordVerification}
                disabled={isLoading || !currentPassword}
                className="w-full bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Password"
                )}
              </Button>
            ) : (
              <>
                {/* New Password */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30 pr-10"
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-[#F87D7D]/50 focus:border-[#F87D7D] focus:ring-[#F87D7D]/30 pr-10"
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordVerified(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            {passwordVerified && (
              <Button
                onClick={handlePasswordChange}
                disabled={isLoading || !newPassword || !confirmPassword}
                className="bg-[#F87D7D] hover:bg-[#F87D7D]/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Changing...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
