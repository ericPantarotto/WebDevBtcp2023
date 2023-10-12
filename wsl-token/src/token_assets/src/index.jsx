// import { AuthClient } from "@dfinity/auth-client";
import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";

//NOTE: localhost
const init = async () => { 
  ReactDOM.render(<App />, document.getElementById("root"));
}
init();

//NOTE: internet computer live deploy
// const init = async () => { 

//   const authClient = await AuthClient.create();

//   if (await authClient.isAuthenticated()) {
//     // console.log("logged in !");
//     handleAuthenticated(authClient);
//   } else {
//     await authClient.login({
//       identityProvider: "https://identity.ic0.app/#authorize",
//       onSuccess: () => {
//         handleAuthenticated(authClient);
//       }
//     });
//   }
// }

// async function handleAuthenticated(authClient) {
//   // console.log(authClient);
//   const identity = await authClient.getIdentity(); 
//   const userPrincipal = await identity._principal.toString();
//   // console.log(userPrincipal);

//   ReactDOM.render(<App loggedInPrincipal={userPrincipal} />, document.getElementById("root"));
// }

// init();


