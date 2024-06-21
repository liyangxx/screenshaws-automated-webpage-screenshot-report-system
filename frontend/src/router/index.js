import { createRouter, createWebHistory } from "vue-router";
import ScreenshotForm from "../components/ScreenshotForm.vue";
import ViewReport from "../components/ViewReport.vue";

const routes = [
  {
    path: "/",
    name: "ScreenshotForm",
    component: ScreenshotForm,
  },
  {
    path: "/view-report/:id",
    name: "ViewReport",
    component: ViewReport,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
