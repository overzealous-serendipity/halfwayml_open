import React from "react";
type ComProps = {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

const SliderWithInput: React.FC<ComProps> = ({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <label className="block">
    <div className="flex flex-row justify-between items-center gap-2">
      <span className="text-gray-700 text-xs w-[75%]">{label}</span>
      <div className="flex flex-row items-center w-[15%] ">
        <input
          className="border-[1px] w-14 p-1 rounded-lg text-xs text-center"
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(Number(e.target.value))
          }
        />
        {/* <span className="ml-2 text-[9px]">/{unit}</span> */}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-3 w-full range range-xs "
      step={step}
    />
    <div className=" flex justify-between text-xs px-2">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </label>
);
export default SliderWithInput;
