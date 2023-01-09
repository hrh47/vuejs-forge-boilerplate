<template>
  <div
    ref="dropZoneRef"
    class="bg-gray-100 p-2 flex justify-center items-center border-2 border-gray-100 relative"
    :class="{
      border: isOverDropZone,
      'border-blue-200': isOverDropZone,
      'border-2': isOverDropZone,
    }"
  >
    <label class="absolute top-0 left-0 right-0 bottom-0 block">
      <input
        accept="image/png, image/jepg"
        class="hidden"
        type="file"
        @change="onFileSelect"
      />
      <AppImage v-if="image" :src="src" />
      <template v-else>{{ "Click or drop to upload image" }}</template>
      <AppLoader v-if="loading || uploadingToFilestack" :overlay="true" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { useBase64, useDropZone } from "@vueuse/core";
import { ref, computed } from "vue";
import use8BaseStorage from "@/composables/use8baseStorage";

const props = defineProps<{
  image?: string;
  loading?: boolean;
}>();
const emit = defineEmits<{
  (e: "upload", payload: { id: string }): void;
}>();
const image = ref<string | File | null | undefined>(props.image);
const dropZoneRef = ref(null);
const { base64 } = useBase64(image);
const uploadingToFilestack = ref(false);
const src = computed(() => {
  return typeof image.value === "string" ? image.value : base64.value;
});

const onFileSelect = (e: Event) => {
  handleFiles((e.target as HTMLInputElement).files);
};
const onDrop = (files: File[] | null) => {
  handleFiles(files);
};

const { uploadAsset } = use8BaseStorage();
const handleFiles = async (files: FileList | File[] | null) => {
  if (!files) return;
  image.value = files[0];
  uploadingToFilestack.value = true;
  const res = await uploadAsset(files[0]);
  emit("upload", res?.data.fileCreate);
  uploadingToFilestack.value = false;
};

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);
</script>

<style scoped></style>
