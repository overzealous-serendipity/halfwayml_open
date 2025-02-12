import React, { useMemo } from "react";
import { RenderLeafProps } from "slate-react";

type LeafProps = RenderLeafProps["leaf"] & {
  confidence: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  highlight: boolean;
  color: string;
  start: number;
};

const RenderLeaf = ({
  attributes,
  children,
  leaf,
  onWordClick,
}: {
  attributes: RenderLeafProps["attributes"];
  children: RenderLeafProps["children"];
  leaf: LeafProps;
  onWordClick: (start: number) => void;
}) => {
  const { confidence, color } = leaf;

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    start: number
  ) => {
    e.preventDefault(); // Prevent the browser default click action
    e.stopPropagation(); // Stop the event from bubbling up to higher elements
    onWordClick(start);
  };

  let style: React.CSSProperties = {
    transition:
      "background-color 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease",
    color: undefined, // Initialize color as undefined
  };

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.highlight) {
    children = <span style={{ backgroundColor: "yellow" }}>{children}</span>;
  }
  if (leaf.color) {
    children = <span style={{ backgroundColor: leaf.color }}>{children}</span>;
  }

  // Apply styling based on confidence levels
  if (confidence < 0.4) {
    style.color = "red"; // Low confidence - red text
  } else if (confidence < 0.7) {
    style.color = "orange"; // Medium confidence - orange text
  }

  // Add a title attribute to show confidence score on hover
  const title = `Confidence: ${
    confidence ? (confidence * 100).toFixed(2) + "%" : "N/A"
  }`;

  return (
    <span
      className={`word-span`}
      onClick={(e) => handleClick(e, leaf.start)}
      {...attributes}
      style={style}
      title={title}
    >
      {children}
    </span>
  );
};

export default RenderLeaf;
