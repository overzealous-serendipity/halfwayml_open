// // UserDataContext.js
// import { createContext, useContext } from "react";
// import { useUserData } from "../hooks/global/useGlobal";

// interface UserDataContextType {
//   data: any;
//   isLoading: boolean;
//   isError: any;
//   refetch: () => void;
// }
// type AuthProviderProps = {
//   children: React.ReactNode;
// };

// const UserDataContext = createContext<UserDataContextType>({
//   data: null,
//   isLoading: true,
//   isError: null,
//   refetch: () => {},
// });

// export const UserDataProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const { data, isLoading, isError, refetch } = useUserData();

//   return (
//     <UserDataContext.Provider value={{ data, isLoading, isError, refetch }}>
//       {children}
//     </UserDataContext.Provider>
//   );
// };

// export const useUserDataContext = () => useContext(UserDataContext);
