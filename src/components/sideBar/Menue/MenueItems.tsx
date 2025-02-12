import React, { FC } from "react";
import MenueItem from "./MenueItem";
import { MenueItemType } from "./MenueItem";
type ComProps = {
  items: MenueItemType[];
  selectedTab?: string;
};
const Menue: FC<ComProps> = ({ items, selectedTab }) => {
  return (
    <div>
      <p className="text-xs ml-4 text-gray-400 opacity-80">Workspace</p>
      <ul className="menu menu-xs ">
        {items?.map((item, index) => (
          <MenueItem
            key={index}
            icon={item.icon}
            title={item.title}
            onClick={item.onClick}
            parent={item.parent}
            selected={selectedTab === `${item.title.toLowerCase()}`}
          />
        ))}
      </ul>
    </div>
  );
};

export default Menue;
