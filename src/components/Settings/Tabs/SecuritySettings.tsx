import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function SecurityTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordFormData>();

  const dispatch = useDispatch();

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update password");
      }

      dispatch(
        showToast({
          type: "alert-success",
          message: "Password updated successfully",
        })
      );
      reset();
    } catch (error) {
      dispatch(
        showToast({
          type: "alert-error",
          message: error instanceof Error ? error.message : "Failed to update password",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {[
        {
          name: "currentPassword",
          label: "Current Password",
          validation: { required: "Current password is required" },
        },
        {
          name: "newPassword",
          label: "New Password",
          validation: {
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            },
          },
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          validation: {
            required: "Please confirm your password",
            validate: (value: string) =>
              value === watch("newPassword") || "Passwords do not match",
          },
        },
      ].map(({ name, label, validation }) => (
        <div key={name} className="form-control">
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords[name] ? "text" : "password"}
              className={`input input-bordered w-full ${
                errors[name as keyof typeof errors] ? "input-error" : ""
              }`}
              {...register(name as keyof PasswordFormData, validation)}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => togglePasswordVisibility(name)}
            >
              {showPasswords[name] ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors[name as keyof typeof errors] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors[name as keyof typeof errors]?.message as string}
              </span>
            </label>
          )}
        </div>
      ))}

      <button
        type="submit"
        className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            Updating...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}

export default SecurityTab;
