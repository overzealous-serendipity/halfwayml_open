// import React, { FC, useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaSpinner } from "react-icons/fa";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "@/config/firebase/firebase";

// type ComProps = {
//   signType: "signup" | "signin";
// };
// type CodeError = {
//   code: string;
//   message: string;
//   isError: boolean;
// };

// const Signup: FC<ComProps> = ({ signType }) => {
//   const [isLoading, setIsLoading] = React.useState<boolean>(false);
//   const [codeError, setCodeError] = useState<CodeError | null>(null);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const btnSignUpHandler = async (data: any) => {
//     const { email, password } = data;
//     try {
//       const userCredentials = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredentials.user;
//       await updateProfile(user, {
//         displayName: `${data.firstName} ${data.lastName}`,
//       });
//     } catch (error) {
//       setCodeError({
//         code: (error as any).code,
//         message: (error as any).message,
//         isError: true,
//       });
//     }
//   };
//   if (signType === "signin") {
//     return null;
//   }
//   return (
//     <>
//       <div className="flex flex-col space-y-2 text-center">
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Create an account
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Enter your email below to create your account
//         </p>
//       </div>
//       <form
//         onSubmit={handleSubmit(btnSignUpHandler)}
//         className="flex flex-col gap-2 p-2"
//       >
//         <label htmlFor="email" className="input-label">
//           Your Email
//         </label>
//         <input
//           className="input input-bordered"
//           type="text"
//           {...register("email", { required: "Please enter your email" })}
//         />
//         {errors.email && (
//           <span className="text-red-500 font-light text-[12px]">
//             {errors.email?.message as React.ReactNode}
//           </span>
//         )}
//         <label htmlFor="password" className="input-label">
//           Your password
//         </label>
//         <input
//           type="password"
//           {...register("password", { required: "Please enter your password" })}
//         />
//         {errors?.password && (
//           <span className="text-red-500 font-light text-[12px]">
//             {errors?.password.message as React.ReactNode}
//           </span>
//         )}
//         <label htmlFor="firstName" className="input-label">
//           First Name
//         </label>
//         <input
//           type="text"
//           {...register("firstName", {
//             required: "Please enter your First Name",
//           })}
//           placeholder="Whats your first name?"
//         />
//         {errors?.firstName && (
//           <span className="text-red-500 font-light text-[12px]">
//             {errors?.firstName.message as React.ReactNode}
//           </span>
//         )}
//         <label htmlFor="lastName" className="input-label">
//           Last Name
//         </label>
//         <input
//           type="text"
//           {...register("lastName", { required: "Please enter your last name" })}
//           placeholder="What is your last name? "
//         />
//         {errors?.lastName && (
//           <span className="text-red-500 font-light text-[12px]">
//             {errors?.lastName.message as React.ReactNode}
//           </span>
//         )}
//         <button type="submit" disabled={isLoading}>
//           {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
//           Sign Up with Email
//         </button>
//       </form>
//       {codeError && (
//         <div>
//           <p className="text-red-600">{codeError.message}</p>
//         </div>
//       )}
//     </>
//   );
// };

// export default Signup;
