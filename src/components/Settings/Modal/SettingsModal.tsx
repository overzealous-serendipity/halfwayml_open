// import React, { FC, useMemo } from "react";
// import { useDispatch } from "react-redux";
// import { Transcription } from "@/config/firebase/models/transcription";
// import Menue from "@/components/sideBar/Menue/Menue";
// import { MenueItemType } from "@/components/sideBar/Menue/MenueItem";
// import { MdOutlineSubtitles } from "react-icons/md";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { FaPlug } from "react-icons/fa";

// import TabsManager from "../Tabs/TabsManager";
// import axios from "axios";

// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { closeModal } from "@/config/redux/store/modalSlice";

// type ComProps = {
//   onClose: () => void;
//   transcriptionRecord: Transcription;
// };

// const SettingsModal: FC<ComProps> = () => {
//   const [selectedTab, setSelectedTab] = React.useState("presets");
//   const dispatch = useDispatch();
//   const onCloseHandler = () => {
//     dispatch(closeModal());
//   };

//   const menueItems: MenueItemType[] = [
//     {
//       icon: <MdOutlineSubtitles size={16} />,
//       title: "Presets",
//       onClick: () => {
//         setSelectedTab("presets");
//       },
//       itemKey: "Presets",
//       parent: "settings",
//     },
//     {
//       icon: <FaRegCircleUser size={16} />,
//       title: "Profile",
//       itemKey: "profile",
//       parent: "settings",
//       onClick: () => {
//         setSelectedTab("profile");
//       },
//     },
//     {
//       icon: <FaPlug size={16} />,
//       title: "Integrations",
//       itemKey: "integrations",
//       parent: "settings",
//       onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         setSelectedTab("integrations");
//       },
//     },
//   ];

//   return (
//     <>
//       <div className="bg-base-200 flex flex-col max-w-[1150px] rounded-xl self-center min-w-[500px] sm:w-screen md:w-[750px] lg:w-[850px] xl:w-[950px]">
//         {/* Header */}
//         <div className="flex justify-end p-2" onClick={onCloseHandler}>
//           <IoIosCloseCircleOutline
//             size={30}
//             className="text-gray-600 cursor-pointer hover:text-gray-800"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex flex-row">
//           {/* Sidebar */}
//           <div id="sideBar" className="w-[15%] h-full p-2 rounded-2xl">
//             <Menue
//               menueItems={menueItems}
//               showHeader={false}
//               selectedTab={selectedTab}
//             />
//           </div>

//           {/* Body */}
//           <div
//             id="body"
//             className="bg-white border-white border-4 w-[85%] p-2 flex flex-col gap-8 mt-2 mb-2 mr-2 rounded-xl h-[640px] overflow-y-auto"
//           >
//             <TabsManager tabSelected={selectedTab as string} />
//             <div className="flex-row body header flex justify-end"></div>
//           </div>
//         </div>

//         {/* Footer */}
//       </div>
//     </>
//   );
// };

// export default SettingsModal;
