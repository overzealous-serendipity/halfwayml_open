import React from "react";
import Layout from "@/components/Layout/Layout";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default SettingsLayout;
