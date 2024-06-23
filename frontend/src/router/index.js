import { createRouter, createWebHistory } from "vue-router";
import ScreenshotForm from "../components/ScreenshotForm.vue";
import ViewScreenshot from '../components/ViewScreenshot.vue';
import ViewReport from "../components/ViewReport.vue";

const routes = [
  {
    path: "/",
    name: "ScreenshotForm",
    component: ScreenshotForm,
  },
  {
    path: '/screenshot/:id',
    name: 'ViewScreenshot',
    component: ViewScreenshot,
    props: true,
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
