import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "about" */ "../views/404.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/super_user",
    name: "sudo_login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/admin/sudo_login.vue"),
  },
  {
    path: "/admin/:id",
    name: "Admin",
    children: [
      {
        path: "/admin/:id/all_user",

        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/admin/all_user.vue"
          ),
      },
    ],
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/admin/admin.vue"),
  },
  {
    path: "/profile/:id",
    children: [
      {
        path: "menu",
        name: "menu",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/profile/menu.vue"),
      },
      {
        path: "parametre",
        name: "setting",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/profile/setting.vue"
          ),
      },
      {
        path: "me",
        name: "me",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/profile/me.vue"),
      },
      {
        path: "visite/:q",
        name: "visite",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/profile/visite.vue"),
      },
    ],
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/profile/profile_view.vue"
      ),
  },
  {
    path: "/reset/:id",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/reset.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
