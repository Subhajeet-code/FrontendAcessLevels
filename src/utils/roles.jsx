// // src/utils/Roles.js
// import { apiUrl } from "./utils";

// let rolesMap = {};

// export const fetchRoles = async () => {
//   try {
//     const res = await fetch(apiUrl() + "user/getRoles");
//     const data = await res.json();

//     if (data.success && data.allRoles) {
//       rolesMap = data.allRoles.reduce((acc, role) => {
//         acc[role.name] = String(role.id);
//         return acc;
//       }, {});
//     }
//     console.log("rolesmap", rolesMap);
//     return rolesMap;
//   } catch (error) {
//     console.error("Failed to fetch roles:", error);
//     return {};
//   }
// };
