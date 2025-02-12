import { useRouter } from "next/router";
import React, { FC } from "react";
export interface MenueItemType {
  itemKey?: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  parent?: "home" | "settings";
}

const MenueItem: FC<MenueItemType> = ({
  icon,
  title,
  itemKey,
  onClick,
  selected,
  parent,
}) => {
  const router = useRouter();
  const currentTab = router.query.tab;
  return (
    <>
      <li
        className={`max-w-52 h-6 ${
          selected && "bg-gray-400 bg-opacity-40 rounded-md"
        } `}
        onClick={onClick}
      >
        <a className="text-xs">
          {icon}
          {title}
        </a>
      </li>
    </>
  );
};

export default MenueItem;
