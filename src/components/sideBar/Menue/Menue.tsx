import React, { FC } from "react";
import MenueItems from "./MenueItems";
import Header from "../Header/Header";
import HalfwayLogo from "../HalfwayLogo";
import { MenueItemType } from "./MenueItem";


type ComProps = {
  menueItems: MenueItemType[];
  showHeader?: boolean;
  selectedTab?: string;
};

const Menue: FC<ComProps> = ({
  menueItems,
  showHeader = true,
  selectedTab,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6 h-[480px] justify-start mt-5">
      {showHeader && <Header />}
      <MenueItems items={menueItems} selectedTab={selectedTab} />
      </div>
      <div className="py-8">
      <HalfwayLogo />
      </div>
    </div>
  );
};

export default Menue;
