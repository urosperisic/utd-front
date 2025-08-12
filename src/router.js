import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import Players from "./views/Players.vue";
import Matches from "./views/Matches.vue";
import Profile from "./views/Profile.vue";
import Users from "./views/Users.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home, meta: { public: true } },
  { path: "/login", component: Login, meta: { public: true } },
  { path: "/signup", component: Signup, meta: { public: true } },
  { path: "/players", component: Players, meta: { requiresAuth: true } },
  { path: "/matches", component: Matches, meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  {
    path: "/users",
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.public) {
    return next();
  }

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return next("/home");
  }

  next();
});

export default router;
