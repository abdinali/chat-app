import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

function Profile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // convert file image to a base64 encoded string
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  }

  return (
    <div className="h-screen pt-20">
      <div className="mx-auto max-w-2xl p-4 py-8">
        <div className="bg-base-300 space-y-8 rounded-xl p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* profile picture upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImage ||
                  authUser?.profilePicture ||
                  "/default-avatar.png"
                }
                alt="profile picture"
                className="size-32 rounded-full border-3 object-cover"
              />
              <label
                htmlFor="profile-pic-upload"
                className={`bg-base-content absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-105 ${isUpdatingProfile ? "pointer-events-none animate-pulse" : ""}`}
              >
                <Camera className="text-base-200 size-5" />
                <input
                  type="file"
                  id="profile-pic-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="size-4" /> Full Name
              </div>
              <p className="bg-base-200 rounded-lg border px-4 py-2.5">
                {authUser?.fullName}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="size-4" /> Email Address
              </div>
              <p className="bg-base-200 rounded-lg border px-4 py-2.5">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="bg-base-300 space-y-2 rounded-xl p-6">
            <h2 className="text-lg font-medium">Account Information</h2>
            <div className="text-sm">
              <div className="flex items-center justify-between border-b border-zinc-700 py-2">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
