const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Home.vue"),
      },
      {
        path: "/Tasks",
        component: () => import("src/pages/Tasks.vue"),
        meta: { protect: true }
      },
      {
        path: "/Register",
        component: () => import("pages/RegisterUser.vue")
      },
      {
        path: "/LogIn",
        component: () => import("pages/LogInUser.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
