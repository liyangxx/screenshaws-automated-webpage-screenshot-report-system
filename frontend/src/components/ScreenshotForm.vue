<template>
  <div class="flex flex-col min-h-screen bg-cover bg-center">
    <header
      class="flex w-full justify-center items-center py-6 bg-gray-800 text-white"
    >
      <img src="@/assets/logo.png" alt="Logo" class="h-10 ml-4 mr-4" />
      <h1 class="text-2xl font-bold">ScreenShaws</h1>
    </header>
    <div class="flex-grow flex-col flex items-center justify-center">
      <h2 v-if="!loading" class="w-5/6 text-2xl font-bold text-white text-center">
        Automated Webpage Screenshot & Report Generation
      </h2>
      <h3
        v-if="!loading"
        class="text-md font-regular text-white text-center mt-3 mb-3"
      >
        Enter your link and it's done in a blink.
      </h3>
      <div
        class="flex flex-col w-full max-w-xl h-36 items-center justify-center"
      >
        <form
          v-if="!loading"
          @submit.prevent="invokeScreenshot"
          class="w-4/5 items-center justify-center"
        >
          <input
            v-model="url"
            type="text"
            placeholder="https://..."
            required
            class="w-full p-2 mb-4 border rounded-lg"
          />
          <button
            type="submit"
            :disabled="!isValidUrl"
            class="w-full bg-blue-500 font-bold text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Capture Screenshot
          </button>
        </form>
        <div v-if="loading" class="text-lg text-center text-white mb-10">
          Processing...
        </div>
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

        router.push({ name: "ViewScreenshot", params: { id: id } });
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
.bg-cover {
  background-image: url("@/assets/background5.jpg");
  background-size: cover;
  background-position: center;
}

.bg-opacity-75 {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
