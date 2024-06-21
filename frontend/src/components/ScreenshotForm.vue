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
        <form @submit.prevent="invokeScreenshot" class="w-full">
          <input
            v-model="url"
            type="text"
            placeholder="Enter a valid URL"
            required
            class="w-full p-2 mb-4 border rounded-lg"
          />
          <button
            type="submit"
            :disabled="!isValidUrl"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Capture Screenshot
          </button>
        </form>
        <div v-if="loading" class="mt-4 text-lg text-white">Processing...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const url = ref("");
    const loading = ref(false);
    const router = useRouter();

    // Validate URL
    const isValidUrl = computed(() => {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)" + // validate protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // validate domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate IP (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      return urlPattern.test(url.value);
    });

    const invokeScreenshot = async () => {
      loading.value = true;

      console.log("URL to be sent:", url.value); // Check if URL is correctly captured

      try {
        const response = await axios.post(
          "https://6cc76a62pb.execute-api.ap-southeast-1.amazonaws.com/dev/screenshot",
          { url: url.value }
        );

        // Parse the response to extract the ID
        const { id } = JSON.parse(response.data.body);
        console.log("POST response.data:", response.data);
        console.log("Parsed id = ", id);

        loading.value = false;

        router.push({ name: 'ViewReport', params: { id: id } });

      } catch (error) {
        console.error("Error:", error);
        loading.value = false;
        // Handle specific error cases here
      }
    };

    return {
      url,
      loading,
      invokeScreenshot,
      isValidUrl,
    };
  },
};
</script>

<style scoped>
/* Additional component-specific styles can go here */
</style>
