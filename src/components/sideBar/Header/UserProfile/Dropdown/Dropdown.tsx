import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

import { IoIosHelpCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";

type ComProps = {
  isOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
};

const Dropdown: FC<ComProps> = ({ isOpen, setIsDropdownOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      // Redirect to login or home page after successful sign out
      router.push("/login");

    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const handleOpenModal = () => {
    setIsDropdownOpen(!isOpen);
    dispatch(
      openModal({
        modalType: "settings",
        modalProps: {},
      })
    );
  };

  return (
    <>
      {isOpen && (
        <div className="relative flex flex-col bg-white shadow-lg rounded-md w-52 h-28 mt-2 left-5 right-0 z-10">
          <ul className="menu menu-xs ">
            <li className="w-48 h-8" onClick={handleOpenModal}>
              <a className="text-xs">
                <IoSettingsOutline size={16} />
                Personal settings
              </a>
            </li>
            <li
              className="w-48 h-8"
              onClick={() =>
                window.open("https://halfwayml.com/support", "_blank")
              }
            >
              <a className="text-xs">
                <IoIosHelpCircleOutline size={16} />
                Help
              </a>
            </li>
            <li className="w-48 h-8" onClick={handleLogout}>
              <a className="text-xs">
                <SlLogout size={16} />
                Log out
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Dropdown;
