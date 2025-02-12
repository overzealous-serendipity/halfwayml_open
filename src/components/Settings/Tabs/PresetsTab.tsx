// import SettingsComponent from "./SubtitleParameters/SubtitleParameters";
// import LineStyleButtons from "./SubtitleParameters/LineStyleButtons";
// import { updateWorkspace } from "@/config/firebase/services/firestoreServices";
// import { useSelector } from "react-redux";
// import {
//   SubtitlePreferences,
//   SubtitleStyleParameters,
//   Workspace,
// } from "@/config/firebase/models/workspace";
// import { Timestamp } from "firebase/firestore";
// import { useDispatch } from "react-redux";
// import { showToast } from "@/config/redux/store/toastSlice";
// import {
//   useGetUserRecord,
//   useGetWorkspace,
// } from "@/config/util/hooks/global/useGlobal";
// type ComProps = {};

// const PresetsTab: FC<ComProps> = (props) => {
//   const { userData } = useGetUserRecord();
//   const workspaceId = userData?.workspaces[0];
//   const { workspaceData } = useGetWorkspace(workspaceId);
//   const [selectedStyle, setSelectedStyle] = React.useState<number>(
//     workspaceData?.metaData?.subtitlePreferences?.subtitleStyle || 2
//   );
//   const dispatch = useDispatch();

//   const [selectedParameters, setSelectedParameters] =
//     React.useState<SubtitleStyleParameters>(
//       workspaceData?.metaData?.subtitlePreferences?.parameters || {
//         cpl: 25,
//         gap: 25,
//         cps: 20,
//         minDuration: 0.1,
//         maxDuration: 10,
//       }
//     );
//   const [isDirty, setIsDirty] = React.useState(false);
//   useEffect(() => {
//     const initialStyle =
//       workspaceData?.metaData?.subtitlePreferences?.subtitleStyle || 2;
//     const initialParameters = workspaceData?.metaData?.subtitlePreferences
//       ?.parameters || {
//       cpl: 25,
//       gap: 25,
//       cps: 20,
//       minDuration: 0.1,
//       maxDuration: 10,
//     };

//     const styleIsDirty = selectedStyle !== initialStyle;
//     const parametersAreDirty =
//       JSON.stringify(selectedParameters) !== JSON.stringify(initialParameters);

//     setIsDirty(styleIsDirty || parametersAreDirty);
//   }, [selectedStyle, selectedParameters, workspaceData]);

//   const handleSubmit = async () => {
//     try {
//       const submission: SubtitlePreferences = {
//         subtitleStyle: selectedStyle,
//         parameters: selectedParameters,
//       };
//       if (workspaceData?.uid) {
//         await updateWorkspace({
//           workspaceId: workspaceData.uid,
//           workspaceData: {
//             ...workspaceData,
//             metaData: {
//               ...workspaceData.metaData,
//               subtitlePreferences: submission,
//               updatedAt: Timestamp.now(),
//             },
//           },
//           eventDetails: "Subtitle preferences updated",
//         });
//         dispatch(
//           showToast({
//             type: "alert-success",
//             message: "Settings updated successfully",
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Failed to update workspace settings", error);
//       dispatch(
//         showToast({ type: "alert-error", message: "Failed to update settings" })
//       );
//     }
//   };
//   return (
//     <>
//       <div className="flex flex-col gap-2 p-4">
//         {/* Header */}
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">Presets</h1>
//           <p className="text-gray-400 opacity-80 text-sm">
//             Presets are a way to save your current settings for later use. You
//             can save and load presets here.
//           </p>
//         </div>

//         {/* Body */}
//         <div className="flex flex-col gap-5">
//           <div className="grid grid-cols-2">
//             <SettingsComponent
//               onSelectedParameters={setSelectedParameters}
//               workspace={workspaceData}
//             />
//             <LineStyleButtons
//               onSelectedStyle={setSelectedStyle}
//               workspace={workspaceData}
//             />
//           </div>
//         </div>
//         {/* Footer */}
//         <div>
//           <button
//             onClick={handleSubmit}
//             className={`btn ${isDirty ? "btn-primary" : "btn-disabled"}`}
//           >
//             {" "}
//             Save
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PresetsTab;

// import SettingsComponent from "./SubtitleParameters/SubtitleParameters";
// import LineStyleButtons from "./SubtitleParameters/LineStyleButtons";
// import { updateWorkspace } from "@/config/util/services/firestore/firestoreServices";
// import {
//   SubtitlePreferences,
//   SubtitleStyleParameters,
//   Workspace,
// } from "@/types/workspace";

// import { Timestamp } from "firebase/firestore";
// import { useDispatch } from "react-redux";
// import { showToast } from "@/config/redux/store/toastSlice";
// import {
//   useGetUserRecord,
//   useGetWorkspace,
// } from "@/config/util/hooks/global/useGlobal";
// import React, { FC, useEffect, useState } from "react";

// const PresetsTab: FC<{}> = () => {
//   const dispatch = useDispatch();
//   const { userData } = useGetUserRecord();
//   const workspaceId = userData?.workspaces[0];
//   const { workspaceData, workspaceLoading } = useGetWorkspace(
//     workspaceId as string
//   );

//   const [selectedStyle, setSelectedStyle] = useState<number>(2); // Default value
//   const [selectedParameters, setSelectedParameters] =
//     useState<SubtitleStyleParameters>({
//       cpl: 25,
//       gap: 25,
//       cps: 20,
//       minDuration: 0.1,
//       maxDuration: 10,
//     });

//   useEffect(() => {
//     // Ensure data is loaded before setting state
//     if (!workspaceLoading && workspaceData?.metaData?.subtitlePreferences) {
//       setSelectedStyle(
//         workspaceData.metaData.subtitlePreferences.subtitleStyle || 2
//       );
//       setSelectedParameters(
//         workspaceData.metaData.subtitlePreferences.parameters || {
//           cpl: 25,
//           gap: 25,
//           cps: 20,
//           minDuration: 0.1,
//           maxDuration: 10,
//         }
//       );
//     }
//   }, [workspaceData, workspaceLoading]);

//   const [isDirty, setIsDirty] = useState(false);
//   useEffect(() => {
//     if (!workspaceLoading) {
//       const styleIsDirty =
//         selectedStyle !==
//         workspaceData?.metaData?.subtitlePreferences?.subtitleStyle;
//       const parametersAreDirty =
//         JSON.stringify(selectedParameters) !==
//         JSON.stringify(
//           workspaceData?.metaData?.subtitlePreferences?.parameters
//         );
//       setIsDirty(styleIsDirty || parametersAreDirty);
//     }
//   }, [selectedStyle, selectedParameters, workspaceData, workspaceLoading]);

//   const handleSubmit = async () => {
//     try {
//       const submission: SubtitlePreferences = {
//         subtitleStyle: selectedStyle,
//         parameters: selectedParameters,
//       };
//       if (workspaceData?.uid) {
//         await updateWorkspace({
//           workspaceId: workspaceData.uid,
//           workspaceData: {
//             ...workspaceData,
//             metaData: {
//               ...workspaceData.metaData,
//               subtitlePreferences: submission,
//               updatedAt: Timestamp.now(),
//             },
//           },
//           eventDetails: "Subtitle preferences updated",
//         });
//         dispatch(
//           showToast({
//             type: "alert-success",
//             message: "Settings updated successfully",
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Failed to update workspace settings", error);
//       dispatch(
//         showToast({ type: "alert-error", message: "Failed to update settings" })
//       );
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-2 p-4">
//         <div className="ml-4">
//           <h1 className="text-3xl font-bold">Presets</h1>
//           <p className="text-gray-400 opacity-80 text-sm">
//             Presets are a way to save your current settings for later use.
//           </p>
//         </div>
//         <div className="flex flex-col gap-5">
//           <div className="grid grid-cols-2">
//             {workspaceData && (
//               <>
//                 <SettingsComponent
//                   onSelectedParameters={setSelectedParameters}
//                   workspace={workspaceData}
//                 />
//                 <LineStyleButtons
//                   onSelectedStyle={setSelectedStyle}
//                   workspace={workspaceData as Workspace}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//         <button
//           onClick={handleSubmit}
//           disabled={!isDirty}
//           className="btn btn-primary w-24 mt-4"
//         >
//           Save
//         </button>
//       </div>
//     </>
//   );
// };

// export default PresetsTab;
