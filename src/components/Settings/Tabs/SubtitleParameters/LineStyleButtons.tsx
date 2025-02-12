import React, { useState } from "react";
import OneDivider from "@/components/SVG/OneDivider";
import TwoDivider from "@/components/SVG/TwoDivider";
import ThreeDivider from "@/components/SVG/ThreeDivider";

interface Workspace {
  metaData: {
    subtitlePreferences: {
      subtitleStyle: number;
    };
  };
}

interface ComProps {
  onSelectedStyle: (style: number) => void;
  workspace: Workspace;
}

const LineStyleButtons: React.FC<ComProps> = ({
  onSelectedStyle,
  workspace,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<number>(
    workspace?.metaData?.subtitlePreferences?.subtitleStyle || 2
  );
  const handleClick = (style: number) => {
    setSelectedStyle(style);
    onSelectedStyle(style);
  };

  const stylesSubtitleOption = (isSelected: boolean) =>
    `flex items-center gap-4 border-2 ${
      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
    } rounded-lg w-full p-4 cursor-pointer hover:border-blue-500 transition-all ease-in-out duration-150`;

  // Render divider with descriptive text or elements, ensuring consistent rendering
  const renderDivider = (style: number) => {
    let DividerComponent;
    let description;

    switch (style) {
      case 1:
        DividerComponent = OneDivider;
        description =
          "Single line - Keeps subtitles short, clear, and concise.";
        break;
      case 2:
        DividerComponent = TwoDivider;
        description = "Two lines - Balanced, suitable for moderate length.";
        break;
      case 3:
        DividerComponent = ThreeDivider;
        description = "Three lines - Extensive, ideal for detailed subtitles.";
        break;
      default:
        return null;
    }

    return (
      <div className="flex items-center justify-between">
        <span className="text-xs flex-1">{description}</span>
        <DividerComponent size={30} /> {/* Standardized size for consistency */}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>Choose your subtitle style:</h1>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((style) => (
          <div
            key={style}
            className={stylesSubtitleOption(selectedStyle === style)}
            onClick={() => handleClick(style)}
          >
            {renderDivider(style)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineStyleButtons;
