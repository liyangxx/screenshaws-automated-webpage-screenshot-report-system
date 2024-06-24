<template>
  <div class="flex flex-col min-h-screen bg-gray-700">
    <header
      class="flex w-full justify-center items-center py-6 bg-gray-800 text-white"
    >
      <img src="@/assets/logo.png" alt="Logo" class="h-10 ml-4 mr-4" />
      <h1 class="text-2xl font-bold">ScreenShaws</h1>
    </header>
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-sm mb-24">
        <div v-if="!reportUrl" class="text-lg text-center text-white">
          Processing...
        </div>
        <h2
          v-if="reportUrl && !loading"
          class="text-2xl font-semibold text-white text-center"
        >
          Your report is ready!
        </h2>
        <div v-if="reportUrl && !loading" class="text-center">
          <button
            @click="redirectToReport"
            class="w-2/3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-5"
          >
            View Report
          </button>
          <button
            v-if="viewedReport"
            @click="redirectToHome"
            class="w-2/3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mt-5"
          >
            Try Another URL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const loading = ref(true); // Initially set to true
    const reportUrl = ref(null);
    const error = ref(null);
    const viewedReport = ref(false);
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds

    const checkUrlAccessible = async (url) => {
      try {
        const response = await axios.get(url);
        return response.status === 200;
      } catch (error) {
        return false;
      }
    };

    const fetchReport = async (retries = 0) => {
      try {
        const response = await axios.post(
          "https://6cc76a62pb.execute-api.ap-southeast-1.amazonaws.com/dev/screenshot/reports",
          { id: id }
        );

        const parsedBody = JSON.parse(response.data.body);
        console.log("parsedBody = ", parsedBody);

        if (parsedBody.pdfUrl) {
          const pdfAccessible = await checkUrlAccessible(parsedBody.pdfUrl);
          if (pdfAccessible) {
            reportUrl.value = parsedBody.pdfUrl;
            console.log("PDF URL Value = ", reportUrl.value);
            loading.value = false;
          } else if (retries < maxRetries) {
            setTimeout(() => fetchReport(retries + 1), retryDelay);
          } else {
            error.value = "Failed to load the report. Please try again later.";
            loading.value = false;
          }
        }
      } catch (error) {
        console.error("Error:", error);
        loading.value = false;
        // Handle specific error cases here
      }
    };

    const redirectToReport = async () => {
      window.open(reportUrl.value, "_blank");
      viewedReport.value = true;
    };

    const redirectToHome = () => {
      router.push({ name: "ScreenshotForm" });
    };
    
    onMounted(() => {
      fetchReport();
    });

    return {
      loading,
      redirectToReport,
      reportUrl,
      viewedReport,
      redirectToHome,
    };
  },
};
</script>

<style scoped>
/* Additional component-specific styles can go here */
</style>
