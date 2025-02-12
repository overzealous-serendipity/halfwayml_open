import React, { FC, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
import ProfileMenueDropdown from "@/components/UI/FloatingElement/Menue/ProfileMenuDropdown";

const Profile: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-row gap-2 h-[40px]">
      <details className="relative">
        <summary
          // onClick={handleToggle}
          className="flex items-center  gap-2 ml-3"
        >
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full p-2">
              <span className="text-sm">
                {user?.email?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-primary font-semibold text-sm">My workspace</p>
            <p className="text-primary text-xs">{user?.email}</p>
          </div>

          {/* {!isMenuOpen ? (
            <IoIosArrowDown
              size={16}
              className="text-primary text-xl font-bold"
            />
          ) : (
            <IoIosArrowUp
              size={16}
              className="text-primary text-xl font-bold"
            />
          )} */}

          {/* <ProfileMenueDropdown
            isMenuOpen={isMenuOpen}
            onToggle={handleToggle}
          /> */}
        </summary>
      </details>
    </div>
  );
};

export default Profile;
