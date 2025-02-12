import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";
import { FiEye, FiEyeOff, FiKey } from "react-icons/fi";

interface Credential {
  id: string;
  name: string;
  key: string;
  secret: string;
  createdAt: string;
  updatedAt: string;
}

function ApiTab() {
  const [loading, setLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [credential, setCredential] = useState<Credential | null>(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      secret: "",
    },
  });

  useEffect(() => {
    fetchCredential();
  });

  const fetchCredential = async () => {
    try {
      const response = await fetch("/api/settings/credentials");
      if (response.ok) {
        const data = await response.json();
        setCredential(data[0] || null); // Take first credential since we only support one per user
        if (data[0]) {
          setValue("secret", data[0].secret);
        }
      }
    } catch (error) {
      dispatch(
        showToast({
          type: "alert-error",
          message: "Failed to fetch API credentials",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: { secret: string }) => {
    try {
      const response = await fetch("/api/settings/credentials", {
        method: "POST", // Always POST as the API handles upsert
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "AssemblyAI",
          key: "default",
          secret: data.secret,
        }),
      });

      if (!response.ok) throw new Error();

      dispatch(
        showToast({
          type: "alert-success",
          message: `API key ${credential ? "updated" : "saved"} successfully`,
        })
      );

      await fetchCredential();
      setIsEditing(false);
    } catch (error) {
      dispatch(
        showToast({
          type: "alert-error",
          message: `Failed to ${credential ? "update" : "save"} API key`,
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiKey className="text-primary" />
            AssemblyAI API Key
          </h3>
          <p className="text-base-content/60 mt-1">
            Manage your API key for transcription services
          </p>
        </div>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          {!isEditing ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AssemblyAI</h4>
                {credential && (
                  <p className="text-sm text-base-content/60">
                    Last updated:{" "}
                    {new Date(credential.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="join">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={credential?.secret || ""}
                    readOnly
                    className="input input-sm input-bordered join-item w-64 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="btn btn-sm join-item"
                  >
                    {showSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm"
                >
                  {credential ? "Update" : "Add Key"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <div className="join w-full">
                  <input
                    type={showSecret ? "text" : "password"}
                    className={`input input-sm input-bordered join-item w-full font-mono ${
                      errors.secret ? "input-error" : ""
                    }`}
                    placeholder="Enter your AssemblyAI API key"
                    {...register("secret", { required: "API key is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="btn btn-sm join-item"
                  >
                    {showSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.secret && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.secret.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setValue("secret", credential?.secret || "");
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="alert alert-info">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-medium">Need an API key?</h4>
            <p className="text-sm">
              Get your API key from the{" "}
              <a
                href="https://www.assemblyai.com/dashboard/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                AssemblyAI dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiTab;
