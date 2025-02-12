import { useSelector } from "react-redux";
import { RootState } from "@/config/redux/store/store";

export const ReduxMonitor = () => {
  const modalState = useSelector((state: RootState) => state.modal);

  if (process.env.NODE_ENV === "development") {
  }

  return null;
};
