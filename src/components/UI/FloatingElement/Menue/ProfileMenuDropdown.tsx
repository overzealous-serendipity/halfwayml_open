import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";
import { signOut } from "next-auth/react";

type ComProps = {
  onToggle: (isOpen: boolean) => void;
  isMenuOpen: boolean;
};

const ProfileMenuDropdown: React.FC<ComProps> = ({ onToggle, isMenuOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const personalSettingsHandler = () => {
    onToggle(false);
    dispatch(
      openModal({
        modalType: "settings",
        modalProps: {},
      })
    );
  };

  return (
    <div className="relative">
      {isMenuOpen && (
        <div className="absolute -right-5 top-5 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-56">
          <ul className="p-2 space-y-1">
            <li
              onClick={personalSettingsHandler}
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <IoSettingsOutline size={20} className="mr-2 text-gray-700" />
              <span className="text-sm text-gray-700">Personal settings</span>
            </li>
            <li
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() =>
                window.open("https://halfwayml.com/support", "_blank")
              }
            >
              <IoIosHelpCircleOutline
                size={20}
                className="mr-2 text-gray-700"
              />
              <span className="text-sm text-gray-700">Help</span>
            </li>
            <li
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={handleLogout}
            >
              <SlLogout size={20} className="mr-2 text-gray-700" />
              <span className="text-sm text-gray-700">Log out</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenuDropdown;
