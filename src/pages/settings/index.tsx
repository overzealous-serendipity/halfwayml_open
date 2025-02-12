// pages/settings/index.tsx
import ApiTab from "@/components/Settings/Tabs/ApiTab";
import ProfileTab from "@/components/Settings/Tabs/ProfileTab";
import SecurityTab from "@/components/Settings/Tabs/SecuritySettings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiUser, FiLock, FiKey } from "react-icons/fi";
import Layout from "@/components/Layout/Layout";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { tab = "profile" } = router.query;

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "security", label: "Security", icon: <FiLock /> },
    { id: "api", label: "API Keys", icon: <FiKey /> },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-base-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>

          <div className="tabs tabs-boxed">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  router.push(`/settings?tab=${t.id}`, undefined, {
                    shallow: true,
                  })
                }
                className={`tab gap-2 ${tab === t.id ? "tab-active" : ""}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {tab === "profile" && <ProfileTab user={session?.user} />}
              {tab === "security" && <SecurityTab />}
              {tab === "api" && <ApiTab />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
