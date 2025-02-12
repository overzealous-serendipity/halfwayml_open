// import React, { FC, useEffect } from "react";
// import { updateWorkspace } from "@/config/firebase/services/firestoreServices";
// import { useSelector, useDispatch } from "react-redux";
// import { showToast } from "@/config/redux/store/toastSlice";
// import { Workspace } from "@/config/firebase/models/workspace";
// import { Timestamp } from "firebase/firestore";

// type ComProps = {};

// const GlossaryTab: FC<ComProps> = (props) => {
//   const dispatch = useDispatch();
//   const currentWorkspace: Workspace = useSelector(
//     (state: any) => state.workspace?.currentWorkspace
//   );
//   const [gloassary, setGloassary] = React.useState<string>("");
//   const handleSubmit = async () => {
//     try {
//       const submission = gloassary.split("\n");
//       // generate an array of unique terms
//       const submissionArray = Array.from(new Set(submission));
//       if (currentWorkspace?.uid) {
//         await updateWorkspace({
//           workspaceId: currentWorkspace.uid,
//           workspaceData: {
//             ...currentWorkspace,
//             metaData: {
//               ...currentWorkspace.metaData,

//               updatedAt: Timestamp.now(),
//             },
//           },
//           eventDetails: "Glossary updated",
//         });
//         dispatch(
//           showToast({
//             type: "alert-success",
//             message: "Settings updated successfully",
//           })
//         );
//       }

//       dispatch(
//         showToast({
//           type: "alert-success",
//           message: "Glossary updated successfully",
//         })
//       );
//     } catch (error) {
//       console.error("Failed to update workspace settings", error);
//       dispatch(
//         showToast({ type: "alert-error", message: "Failed to update settings" })
//       );
//     }
//   };
//   const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setGloassary(e.target.value);
//   };

//   return (
//     <div className="flex flex-col p-4">
//       <h2 className="text-lg font-semibold mb-2">Glossary</h2>
//       <p className="text-sm mb-4">Enhance Your Transcriptions</p>
//       <ul className="text-sm list-disc list-inside mb-4">
//         <li>
//           Add Unique Terms: Include names, acronyms, brands, and technical
//           jargon not found in standard dictionaries.
//         </li>
//         <li>
//           {`   Formatting: Use lowercase unless it's an acronym. One term per line.`}
//         </li>
//       </ul>
//       <p className="text-sm mb-2">
//         Your custom glossary helps improve transcription accuracy for terms
//         unique to your content.
//       </p>
//       <div>
//         <textarea
//           onChange={(e) => changeHandler(e)}
//           value={gloassary}
//           className="textarea textarea-bordered w-full h-64"
//           placeholder={`word A..\nword B... \nword C... \nand so on, one per line, as many as you need`}
//         ></textarea>
//       </div>
//       <button onClick={handleSubmit} className="btn btn-primary w-fit">
//         <span>Save</span>
//       </button>
//     </div>
//   );
// };

// export default GlossaryTab;
