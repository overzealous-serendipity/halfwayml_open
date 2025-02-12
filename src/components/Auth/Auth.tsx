// import React, { FC, useState } from "react";
// import { auth } from "@/config/firebase/firebase";
// import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import { googleProvider } from "@/config/firebase/firebase";
// import { signInWithPopup } from "firebase/auth";

// type ComProps = {};

// const Auth: FC<ComProps> = (props) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const signin = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//     } catch (error) {}
//   };
//   const signout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {}
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-3">
//         <label htmlFor="username" className="label primary">
//           {" "}
//           Username{" "}
//         </label>
//         <input
//           id="username"
//           type="text"
//           className="username input input-bordered w-full max-w-xs"
//           onChange={(e) => {
//             setEmail(e.target.value);
//           }}
//         />
//         <label htmlFor="password" className="label primary">
//           {" "}
//           password{" "}
//         </label>

//         <input
//           id="password"
//           type="text"
//           className="password input input-bordered w-full max-w-xs"
//           onChange={(e) => {
//             setPassword(e.target.value);
//           }}
//         />
//       </div>
//       <button className="btn" onClick={signin}>
//         {" "}
//         singin
//       </button>
//       <button
//         className="btn"
//         onClick={() => {
//           signInWithPopup(auth, googleProvider);
//         }}
//       >
//         {" "}
//         Google
//       </button>
//       <button className="btn" onClick={signout}>
//         {" "}
//         signout
//       </button>
//     </>
//   );
// };

// export default Auth;
