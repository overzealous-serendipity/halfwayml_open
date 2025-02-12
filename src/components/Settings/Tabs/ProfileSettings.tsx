import { showToast } from "@/config/redux/store/toastSlice";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
interface ProfileFormData {
  name: string;
  email: string;
}

const ProfileSettings = ({ user }: { user: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch("/api/settings/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      dispatch(
        showToast({
          message: "Profile updated successfully",
          type: "alert-success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: "Failed to update profile",
          type: "alert-error",
        })
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
