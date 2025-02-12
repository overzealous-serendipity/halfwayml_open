import { RiCheckboxCircleLine, RiTimeLine, RiErrorWarningLine } from "react-icons/ri";
import { IconType } from "react-icons";

type StatusBadgeProps = {
    status: string;
}

// Define interface for status config
interface StatusConfig {
    icon: IconType;
    color: string;
    bg: string;
    label: string;
    animate?: boolean;  // Make animate optional
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const statusConfig: Record<string, StatusConfig> = {
      completed: {
        icon: RiCheckboxCircleLine,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        label: "Completed",
      },
      processing: {
        icon: RiTimeLine,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        label: "Processing",
        animate: true,
      },
      error: {
        icon: RiErrorWarningLine,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        label: "Error",
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
    const Icon = config.icon;
  
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
          config.bg
        } ${config.color} ${config.animate ? "animate-pulse" : ""}`}
      >
        <Icon className={`w-3.5 h-3.5 ${config.animate ? "animate-spin" : ""}`} />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    );
  };

export default StatusBadge;