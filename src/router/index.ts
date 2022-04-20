import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import CourseView from "../views/CourseView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/course",
    name: "course",
    component: CourseView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
