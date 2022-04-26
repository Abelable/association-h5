import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/course",
    name: "course",
    component: () => import("../views/CourseView.vue"),
  },
  {
    path: "/custom_activity",
    name: "custom_activity",
    component: () => import("../views/CustomActivityView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
