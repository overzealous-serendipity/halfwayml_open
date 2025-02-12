import { useState, FC, useEffect } from "react";
import SliderWithInput from "./SliderWithInput";
import { SubtitleStyleParameters, Workspace } from "@/types/workspace";
interface ComProps {
  onSelectedParameters: (submission: SubtitleStyleParameters) => void;
  workspace: Workspace;
}

const SettingsComponent: FC<ComProps> = ({
  onSelectedParameters,
  workspace,
}) => {
  const currentSubtitleParameters =
    workspace?.metaData?.subtitlePreferences?.parameters;
  const [cpl, setCPL] = useState(currentSubtitleParameters?.cpl || 25);
  const [gap, setGap] = useState(currentSubtitleParameters?.gap || 25);
  const [cps, setCPS] = useState(currentSubtitleParameters?.cps || 20);
  const [minDuration, setMinDuration] = useState(
    currentSubtitleParameters?.minDuration || 0.1
  );
  const [maxDuration, setMaxDuration] = useState(
    currentSubtitleParameters?.maxDuration || 10
  );

  useEffect(() => {
    const result = {
      cpl: cpl,
      gap: gap,
      cps: cps,
      minDuration: minDuration,
      maxDuration: maxDuration,
    };
    onSelectedParameters(result);
  }, [cpl, gap, cps, minDuration, maxDuration, onSelectedParameters]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1>Subtitle Parameters</h1>
      <div className="flex flex-col gap-6">
        {/* CPS Slider */}
        <SliderWithInput
          label="Maximum characters per second (CPS) in CPS"
          unit="CPS"
          min={1}
          max={100}
          step={1}
          value={cps}
          onChange={(value) => setCPS(Number(value))}
        />

        {/* Gap Slider */}
        <SliderWithInput
          label="Minimum gap between subtitles in ms"
          unit="ms"
          min={1}
          max={100}
          step={1}
          value={gap}
          onChange={setGap}
        />

        {/* Min Duration Slider */}
        <SliderWithInput
          label="Minimum subtitle duration in s"
          unit="s"
          min={0}
          max={4}
          step={0.1}
          value={minDuration}
          onChange={setMinDuration}
        />
        {/* CPL Slider */}
        <SliderWithInput
          label="Maximum characters per line (CPL) in CPL"
          unit="CPL"
          min={1}
          max={50}
          step={1}
          value={cpl}
          onChange={setCPL}
        />

        {/* Max Duration Slider */}
        <SliderWithInput
          label="Maximum subtitle duration in s"
          unit="s"
          min={4}
          max={15}
          step={0.1}
          value={maxDuration}
          onChange={setMaxDuration}
        />
      </div>
    </div>
  );
};

export default SettingsComponent;
