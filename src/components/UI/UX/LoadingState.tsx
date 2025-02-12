import React, { FC } from "react";
type ComProps = {
  content: string;
};

const LoadingState: FC<ComProps> = ({ content }) => {
  const waveCount = 20;
  const waveItems = Array.from({ length: waveCount }, (_, i) => i);
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`wave`}></div>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Loading...</h2>
        <p className="text-gray-500">{content}</p>
      </div>
    </>
  );
};

export default LoadingState;
