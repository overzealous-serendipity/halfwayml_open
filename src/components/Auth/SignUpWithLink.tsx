// import React, { FC } from "react";
// import { useForm } from "react-hook-form";
// import { auth } from "@/config/firebase/firebase";
// import { sendSignInLinkToEmail } from "firebase/auth";
// import { useRouter } from "next/router";
// // Make sure to import firebase auth
// type ComProps = {};

// const SignUpWithLink: FC<ComProps> = (props) => {
//   const router = useRouter();
//   const { ref } = router.query;
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const btnSignUpHandler = async (data: any) => {
//     const baseUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/login/verify`;
//     const url = ref ? `${baseUrl}?${ref}` : baseUrl;
//     const { email } = data;
//     const actionCodeSettings = {
//       url,
//       handleCodeInApp: true, // This must be true.
//     };

//     try {
//       await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//       window.localStorage.setItem("emailForSignIn", email); // Remember the email.

//       // Redirect the user to another page
//       router.push(`/login/confirmation?email=${email}`);
//     } catch (error) {
//       console.error("Error sending sign-in link: ", error);
//     }
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(btnSignUpHandler)}
//         className="flex flex-col gap-3"
//       >
//         <input
//           className="input input-primary "
//           {...register("email", { required: true })}
//           placeholder="name@example.com"
//         />
//         {errors.email && <span>This field is required</span>}
//         <button className="btn btn-primary" type="submit">
//           Sign Up with Email
//         </button>
//       </form>
//     </>
//   );
// };

// export default SignUpWithLink;
