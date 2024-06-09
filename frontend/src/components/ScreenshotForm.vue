<!-- src/components/ScreenshotForm.vue -->
<template>
    <div class="flex flex-col justify-center items-center mt-6">
      <form @submit.prevent="invokeScreenshot" class="w-full max-w-sm ">
        <input v-model="url" type="text" placeholder="Enter URL" required class="w-full p-2 mb-4 border rounded" />
        <button type="submit" class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Capture Screenshot</button>
      </form>
      <div v-if="loading" class="mt-4 text-lg text-gray-600">Processing...</div>
      <div v-if="result" class="mt-4 text-center">
        <img :src="result.screenshotUrl" alt="Screenshot" class="w-full h-auto max-w-xs mx-auto" />
        <a :href="result.pdfUrl" target="_blank" class="block mt-4 text-blue-500 hover:underline">Download PDF</a>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const url = ref('');
      const loading = ref(false);
      const result = ref(null);
  
      const invokeScreenshot = async () => {
        loading.value = true;
        result.value = null;
        try {
          const response = await fetch('https://your-api-gateway-endpoint/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url.value })
          });
          const data = await response.json();
          const resultResponse = await fetch(`https://your-api-gateway-endpoint/result?id=${data.id}`);
          result.value = await resultResponse.json();
        } catch (error) {
          console.error('Error:', error);
        } finally {
          loading.value = false;
        }
      };
  
      return {
        url,
        loading,
        result,
        invokeScreenshot
      };
    }
  };
  </script>
  
  <style scoped>
  /* Additional component-specific styles can go here */
  </style>
  