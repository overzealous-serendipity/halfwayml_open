import React, { FC } from "react";
import { useRouter } from "next/router";

export interface EmptyStateProps {
  button?: {
    buttonText: string;
    onClickButton: () => void;
  };
  elementDescription?: string;
  elementText: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  button,
  elementDescription,
  elementText,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="text-center p-10">
        <h2 className="text-lg font-semibold">{elementText}</h2>
        <p className="mt-2 text-gray-600">{elementDescription}</p>
        <button
          className="mt-4 btn btn-primary"
          onClick={button?.onClickButton}
        >
          {button?.buttonText}
        </button>
      </div>
    </>
  );
};

export default EmptyState;
