import React, { FC } from "react";
import { useRouter } from "next/router";
type ComProps = {};

const Tabs: FC<ComProps> = (props) => {
  const router = useRouter();
  const handleTabClick = (tabName: string) => {
    router.push(`?tab=${tabName}`, undefined, { shallow: true });
  };
  const styles = `hover:pointer-cursor`;
  return (
    <>
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab ${styles}`}
          onClick={() => handleTabClick("Gloassary")}
        >
          Gloassary
        </a>
        <a
          role="tab"
          className={`tab ${styles} active`}
          onClick={() => handleTabClick("Presets")}
        >
          Presets
        </a>
        <a
          role="tab"
          className={`tab ${styles}`}
          onClick={() => handleTabClick("Billing")}
        >
          Billing
        </a>
      </div>
    </>
  );
};

export default Tabs;
