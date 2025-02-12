// import React, { FC, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/router";
// import { auth } from "@/config/firebase/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { FaSpinner } from "react-icons/fa";
// type ComProps = {
//   signType: "signup" | "signin";
// };
// type CodeError = {
//   code: string;
//   message: string;
//   isError: boolean;
// };

// const Login: FC<ComProps> = ({ signType }) => {
//   const router = useRouter();
//   const { register, handleSubmit } = useForm();
//   const [error, setError] = React.useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [codeError, setCodeError] = useState<CodeError | null>(null);
//   const onSubmit = async (data: any) => {
//     const { email, password } = data;
//     try {
//       const signedInUser = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//     } catch (error: any) {
//       setError(error);
//       setCodeError({
//         code: (error as any).code,
//         message: (error as any).message,
//         isError: true,
//       });
//     }
//   };
//   const forgetPasswordHandler = () => {
//     router.push("/forget-password");
//   };

//   return (
//     <>
//       <div className="flex flex-col space-y-2 text-center">
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Sign into your account
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Enter your email below to sign in to your account
//         </p>
//       </div>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col gap-2 p-2"
//       >
//         <label htmlFor="email" className="input-label">
//           Your Email
//         </label>
//         <input type="text" {...register("email")} />
//         <label htmlFor="password" className="input-label">
//           Your password
//         </label>
//         <input type="password" {...register("password")} />
//         <button type="submit" disabled={isLoading}>
//           {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
//           Sign In with Email
//         </button>
//         <p
//           className="
//         text-sm text-muted-foreground text-center cursor-pointer
//         "
//           onClick={forgetPasswordHandler}
//         >
//           Forget your password?{" "}
//         </p>
//       </form>
//       {codeError && (
//         <div className="flex flex-col gap-2 ">
//           <div>
//             <p className="text-red-600">
//               {(codeError as { message: string })?.message}
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Login;
