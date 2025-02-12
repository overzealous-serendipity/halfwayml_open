// @ts-nocheck because of we might use it later
// import React, { FC } from "react";
// import Select from "react-select";
// import ISO6391 from "iso-639-1";
// import { HiOutlineSpeakerWave } from "react-icons/hi2";

// type ComProps = {};

// const LanguageDropdownAll: FC<ComProps> = () => {
//   // Common language codes
//   const commonLanguageCodes = [
//     "en",
//     "es",
//     "zh",
//     "ar",
//     "fr",
//     "de",
//     "ja",
//     "ru",
//     "pt",
//     "it",
//   ];

//   // Map to create common language options
//   const commonLanguageOptions = commonLanguageCodes.map((code) => {
//     return { value: code, label: ISO6391.getName(code) };
//   });

//   // All language options
//   const allLanguageOptions = ISO6391.getAllNames().map((name, index) => {
//     return { value: ISO6391.getAllCodes()[index], label: name };
//   });

//   // Grouped options for the select
//   const groupedOptions = [
//     { label: "Common Languages", options: commonLanguageOptions },
//     { label: "All Languages", options: allLanguageOptions },
//   ];

//   const customStyles = {
//     groupHeading: (provided) => ({
//       ...provided,
//       fontWeight: "bold",
//       font: "bold sans-serif",
//     }),
//     menu: (provided) => ({
//       ...provided,
//       // Customize the scrollbar
//       "::-webkit-scrollbar": {
//         width: "10px",
//       },
//       "::-webkit-scrollbar-track": {
//         background: "#f1f1f1",
//       },
//       "::-webkit-scrollbar-thumb": {
//         background: "#888",
//       },
//       "::-webkit-scrollbar-thumb:hover": {
//         background: "#444",
//       },
//     }),
//     // Additional style customizations can be added here
//   };
//   const defaultValue = { value: "en", label: ISO6391.getName("en") };
//   const formatOptionLabel = ({ value, label }, { context }) => {
//     if (context === "value") {
//       return (
//         <div className="flex flex-row gap-2 items-center">
//           <HiOutlineSpeakerWave /> {/* Insert your icon component */}
//           <p>Voice is </p>
//           <p className="text-primary">{label}</p>
//         </div>
//       );
//     } else {
//       return label;
//     }
//   };

//   return (
//     <>
//       <label htmlFor="">Select the language</label>
//       <Select
//         defaultValue={defaultValue}
//         options={groupedOptions}
//         styles={customStyles}
//         formatOptionLabel={formatOptionLabel}
//       />
//     </>
//   );
// };

// export default LanguageDropdownAll;
