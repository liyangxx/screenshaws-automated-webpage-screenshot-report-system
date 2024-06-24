<template>
  <div class="flex flex-col min-h-screen bg-gray-700">
    <header
      class="flex w-full justify-center items-center py-6 bg-gray-800 text-white"
    >
      <img src="@/assets/logo.png" alt="Logo" class="h-10 ml-4 mr-4" />
      <h1 class="text-2xl font-bold">ScreenShaws</h1>
    </header>
    <div class="flex-grow flex flex-col items-center justify-center">
      <div class="w-full max-w-3xl flex flex-col items-center justify-center">
        <h2
          v-if="screenshotUrl"
          class="text-2xl font-semibold text-white text-center mt-8 mb-5"
        >
          Screenshot Preview
        </h2>
        <div v-if="!screenshotUrl" class="text-lg text-center text-white mb-10">
          Loading screenshot...
        </div>
        <div
          v-if="screenshotUrl && !loading"
          class="w-11/12 mt-4 items-center justify-center"
        >
          <img
            :src="screenshotUrl"
            @load="onImageLoad"
            @error="onImageError"
            alt="Try refreshing the page if the screenshot is not displayed"
            class="w-full rounded-2xl"
          />
        </div>
        <div v-if="error" class="mt-4 text-lg text-center text-red-500">
          {{ error }}
        </div>
        <div v-if="message" class="mt-4 text-lg text-center text-yellow-500">
          {{ message }}
        </div>
        <button
          v-if="screenshotUrl && !loading"
          @click="generateScreenshotPreview"
          class="w-5/12 items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-10 mb-12"
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
    const loading = ref(true); // Initially set to true
    const screenshotUrl = ref(null);
    const error = ref(null);
    const message = ref(null);
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

    const fetchScreenshot = async (retries = 0) => {
      try {
        const response = await axios.post(
          "https://6cc76a62pb.execute-api.ap-southeast-1.amazonaws.com/dev/screenshot/reports",
          { id: id }
        );

        const parsedBody = JSON.parse(response.data.body);
        console.log("parsedBody = ", parsedBody);
        console.log("Parsed Body.Screenshot URL = ", parsedBody.screenshotUrl);

        if (parsedBody.screenshotUrl) {
          const screenshotAccessible = await checkUrlAccessible(
            parsedBody.screenshotUrl
          );
          if (screenshotAccessible) {
            screenshotUrl.value = parsedBody.screenshotUrl;
            console.log("Screenshot URL Value = ", screenshotUrl.value);
          } else if (retries < maxRetries) {
            setTimeout(() => fetchScreenshot(retries + 1), retryDelay);
          } else {
            error.value =
              "Failed to load the screenshot. Please try again later.";
          }
        }

        if (parsedBody.message) {
          message.value = parsedBody.message;
        }
      } catch (error) {
        console.error("Error:", error);
        error.value = "Failed to load the screenshot. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    const generateScreenshotPreview = () => {
      router.push({ name: "ViewReport", params: { id: id } });
    };

    const onImageLoad = () => {
      loading.value = false;
    };

    const onImageError = () => {
      error.value = "Failed to load the screenshot image.";
      loading.value = false;
    };

    onMounted(() => {
      fetchScreenshot();
    });

    return {
      loading,
      screenshotUrl,
      error,
      message,
      generateScreenshotPreview,
      onImageLoad,
      onImageError,
    };
  },
};
</script>

<style scoped>
/* Additional component-specific styles can go here */
</style>
