// Components/Settings/ProfileTab.tsx
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";

function ProfileTab({ user }: { user: any }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // API call here
      dispatch(
        showToast({
          type: "alert-success",
          message: "Profile updated successfully",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          type: "alert-error",
          message: error instanceof Error ? error.message : "Failed to update profile",
        })
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.name.message as string}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className="input input-bordered w-full"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.email.message as string}
            </span>
          </label>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={!isDirty}>
        Save Changes
      </button>
    </form>
  );
}

export default ProfileTab;
