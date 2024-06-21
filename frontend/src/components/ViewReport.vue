<template>
  <div class="flex flex-col min-h-screen bg-gray-700">
    <header
      class="flex w-full justify-center items-center py-6 bg-gray-800 text-white"
    >
      <img src="@/assets/logo.png" alt="Logo" class="h-10 ml-4 mr-4" />
      <h1 class="text-2xl font-bold">
        Automated Web Screenshot and Report Generator
      </h1>
    </header>
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-sm">
        <h2 class="text-2xl font-bold text-white text-center">Your report is ready!</h2>
        <div v-if="loading" class="mt-4 text-lg text-white">Processing...</div>
        <div v-if="finalUrl" class="mt-4 text-center">
          <button
            @click="redirectToReport"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  setup() {
    const loading = ref(false);
    const finalUrl = ref(null);
    const route = useRoute();
    const id = route.params.id;

    const fetchReport = async () => {
      loading.value = true;

      try {
        const response = await axios.post(
          "https://6cc76a62pb.execute-api.ap-southeast-1.amazonaws.com/dev/screenshot/reports",
          { id: id }
        );

        console.log("POST response.data:", response.data);

        const parsedBody = JSON.parse(response.data.body);
        console.log("Parsed Body = ", parsedBody.pdfUrl);

        finalUrl.value = parsedBody.pdfUrl;
        console.log("Final Url value = ", finalUrl.value);

        loading.value = false;
      } catch (error) {
        console.error("Error:", error);
        loading.value = false;
        // Handle specific error cases here
      }
    };

    const redirectToReport = async () => {
      window.open(finalUrl.value, "_blank");
      // try {
      //   // Try to access the URL to ensure it's available
      //   await axios.head(finalUrl.value);
      //   window.open(finalUrl.value, "_blank");
      // } catch (error) {
      //   console.error("URL not accessible yet, retrying...");
      //   // Retry after a short delay
      //   setTimeout(redirectToReport, 2000);
      // }
    };

    onMounted(() => {
      fetchReport();
    });

    return {
      loading,
      redirectToReport,
      finalUrl,
    };
  },
};
</script>

<style scoped>
/* Additional component-specific styles can go here */
</style>
