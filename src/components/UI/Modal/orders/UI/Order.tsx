import { FC, ReactNode } from "react";
import { MdOutlineChevronRight } from "react-icons/md";

type MenuItemProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

const MenuItem: FC<MenuItemProps> = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="group border-[2px] h-16 w-48 p-2 flex justify-between items-center rounded-md transition-colors duration-200 ease-in-out hover:bg-primary hover:cursor-pointer hover:text-white"
  >
    <div className="rounded-full bg-blue-200 p-1 hover:bg-white">{icon}</div>
    <p className="text-primary group-hover:text-white">{label}</p>
    <MdOutlineChevronRight className="group-hover:text-white" size={20} />
  </div>
);

export default MenuItem;
