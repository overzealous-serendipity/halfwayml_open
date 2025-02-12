// import React, { FC } from "react";
// import Select from "react-select";
// import ISO6391 from "iso-639-1";
// import { HiOutlineSpeakerWave } from "react-icons/hi2";

// import { supportedLanguages } from "../util/util";
// type ComProps = {
//   setLanguageCode: (languageCode: string) => void;
// };

// const LanguageDropdown: FC<ComProps> = ({ setLanguageCode }) => {
//   // Supported languages

//   // Grouped options for the select
//   const groupedOptions = [
//     { label: "Supported Languages", options: supportedLanguages },
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

//   const valueChangedHandler = (selectedOption) => {
//     console.log("This is the selected option value", selectedOption.value);
//     setLanguageCode(selectedOption.value);
//   };
//   const defaultValue = {
//     value: null,
//     label: "Select a language",
//   }; // Defaults to the first supported language
//   const formatOptionLabel = ({ value, label, isDisabled }, { context }) => {
//     if (context === "value") {
//       return (
//         <div className="flex flex-row gap-2 items-center hover:cursor-pointer">
//           <HiOutlineSpeakerWave /> {/* Insert your icon component */}
//           <p>Voice is </p>
//           <p className={`text-primary ${isDisabled ? "text-gray-400" : ""}`}>
//             {label}
//           </p>
//         </div>
//       );
//     } else {
//       return <div className={isDisabled ? "text-gray-400" : ""}>{label}</div>;
//     }
//   };

//   return (
//     <>
//       <Select
//         defaultValue={defaultValue}
//         options={groupedOptions}
//         styles={customStyles}
//         formatOptionLabel={formatOptionLabel}
//         isOptionDisabled={(option) => option.isDisabled} // Disable selection of non-supported languages
//         onChange={valueChangedHandler}
//       />
//     </>
//   );
// };

// export default LanguageDropdown;

import React, { FC } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

import { supportedLanguages } from "../util/util";
type ComProps = {
  setLanguageCode: (languageCode: string) => void;
};

const LanguageDropdown: FC<ComProps> = ({ setLanguageCode }) => {
  // Supported languages

  // Grouped options for the select
  const groupedOptions = [
    { label: "Supported Languages", options: supportedLanguages },
  ];
  const customStyles = {
    groupHeading: (provided: any) => ({
      ...provided,
      fontWeight: "bold",
      font: "bold sans-serif",
    }),
    menu: (provided: any) => ({
      ...provided,
      // Customize the scrollbar
      "::-webkit-scrollbar": {
        width: "10px",
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#444",
      },
    }),
    // Additional style customizations can be added here
  };

  // const valueChangedHandler = (selectedOption: { value: string }) => {
  //   setLanguageCode(selectedOption.value);
  // };
  const valueChangedHandler = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
      isDisabled: boolean;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
      isDisabled: boolean;
    }>
  ) => {
    if (selectedOption) {
      setLanguageCode(selectedOption.value);
    }
  };
  const formatOptionLabel = (
    { label, isDisabled }: { label: string; isDisabled: boolean },
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return (
        <div className="flex flex-row gap-2 items-center hover:cursor-pointer">
          <HiOutlineSpeakerWave /> {/* Insert your icon component */}
          <p>Voice is </p>
          <p className={`text-primary ${isDisabled ? "text-gray-400" : ""}`}>
            {label}
          </p>
        </div>
      );
    } else {
      return <div className={isDisabled ? "text-gray-400" : ""}>{label}</div>;
    }
  };

  const defaultValue = {
    value: "en",
    label: "Select a language",
    isDisabled: false, // Add the isDisabled property
  };

  return (
    <>
      <Select
        defaultValue={defaultValue}
        options={groupedOptions}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        isOptionDisabled={(option) => option.isDisabled} // Disable selection of non-supported languages
        onChange={valueChangedHandler}
      />
    </>
  );
};

export default LanguageDropdown;
