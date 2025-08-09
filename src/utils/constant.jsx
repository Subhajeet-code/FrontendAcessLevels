export const roles = {
  Admin: "1",
  Provisioner: "2",
  Supervisor: "3",
  Scheduler: "4",
};

export const menuItems = [
  {
    label: "Broadband Checker",
    path: "/broadband-checker",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler, roles.Supervisor],
  },
  {
    label: "Broadband Reports",
    path: "/broadband-reports",
    roles: [roles.Admin],
  },
  {
    label: "Order Dashboard",
    path: "/order-dashboard",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler],
  },
  {
    label: "Online Broadband Ordering",
    path: "/online-broadband-ordering",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler],
  },
  // { label: "Order Tracker", path: "/order-tracker" },
  // { label: "User Admin", path: "/user-admin", roles: [roles.Admin] },
  {
    label: "Router Ordering/List",
    path: "/router-ordering",
    roles: [roles.Admin, roles.Scheduler],
  },
  {
    label: "Status Checker",
    path: "/status-checker",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler],
  },
  {
    label: "Regrade Speed",
    path: "/regrade",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler],
  },
  {
    label: "Cancel Order",
    path: "/cancel-order",
    roles: [roles.Admin, roles.Provisioner, roles.Scheduler],
  },
  {
    label: "Cease Order",
    path: "/cease-order",
    roles: [roles.Admin, roles.Supervisor],
  },
  {
    label: "Suspend/Unsuspend",
    path: "/suspend-order",
    roles: [roles.Admin, roles.Supervisor],
  },
  {
    label: "Manage User",
    path: "/manage-user",
    roles: [roles.Admin],
  },
  {
    label: "Logout",
    path: "/logout",
    roles: [roles.Admin, roles.Provisioner, roles.Supervisor, roles.Scheduler],
  },
];
