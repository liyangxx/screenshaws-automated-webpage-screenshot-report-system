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
      <div class="flex-grow flex flex-col items-center justify-center">
        <div class="w-full max-w-2xl flex flex-col items-center justify-center">
          <h2 class="text-2xl font-bold text-white text-center mt-10 mb-5">Screenshot Preview</h2>
          <div v-if="loading" class="mt-4 text-lg text-center text-white">Loading screenshot...</div>
          <div v-if="screenshotUrl" class="mt-4 items-center justify-center">
            <img :src="screenshotUrl" alt="Screenshot Image" class="w-full rounded-2xl" />
          </div>
          <div v-if="!loading && !screenshotUrl" class="mt-4 text-lg text-center text-white items-center justify-center">
            Please refresh and try again is screenshot preview is not displayed
          </div>
          <button
            v-if="screenshotUrl"
            @click="generateScreenshotPreview"
            class="w-1/2 items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-10 mb-20"
          >
            Generate Report
          </button>
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
      const loading = ref(false);
      const screenshotUrl = ref(null);
      const route = useRoute();
      const router = useRouter();
      const id = route.params.id;
  
      const fetchScreenshot = async () => {
        loading.value = true;
  
        try {
          const response = await axios.post(
            "https://6cc76a62pb.execute-api.ap-southeast-1.amazonaws.com/dev/screenshot/reports",
            { id: id }
          );
  
          const parsedBody = JSON.parse(response.data.body);
          console.log("parsedBody = ", parsedBody);
          
          screenshotUrl.value = parsedBody.screenshotUrl;
          console.log("Screenshot URL Value = ", screenshotUrl.value);
          
          loading.value = false;
        } catch (error) {
          console.error("Error:", error);
          loading.value = false;
          // Handle specific error cases here
        }
      };
  
      const generateScreenshotPreview = () => {
        router.push({ name: 'ViewReport', params: { id: id } });
      };
  
      onMounted(() => {
        fetchScreenshot();
      });
  
      return {
        loading,
        screenshotUrl,
        generateScreenshotPreview,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Additional component-specific styles can go here */
  </style>
