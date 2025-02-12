import React, { FC } from "react";
type ComProps = {
  retry?: () => void;
  message?: string;
};

const ErrorState: FC<ComProps> = ({ retry, message }) => {
  return (
    <>
      <div className="text-center p-10">
        <p className="text-lg text-red-500">
          {message || "An error occurred. Please try again."}
        </p>
        <button className="mt-4 btn" onClick={retry}>
          Retry
        </button>
      </div>
    </>
  );
};

export default ErrorState;
