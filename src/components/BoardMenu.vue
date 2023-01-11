<template>
  <div>
    <KButton
      icon="folder"
      theme-color="primary"
      fill-mode="outline"
      @click="show = !show"
      ref="button"
    >
      Show Menu
    </KButton>
    <KPopup
      :anchor="'button'"
      :anchor-align="{
        vertical: 'bottom',
        horizontal: 'right',
      }"
      :popup-align="{
        horizontal: 'right',
        vertical: 'top',
      }"
      :show="show"
    >
      <div class="p-5" ref="menu">
        <ul>
          <li class="text-red-500 whitespace-nowrap">
            <button @click="$emit('deleteBoard', null)">
              <span class="k-icon k-i-delete"></span>
              Delete Board
            </button>
          </li>
          <li>
            <strong>Board Image</strong>
            <AppImageDropzone
              class="aspect-video w-56"
              :image="board.image?.downloadUrl"
              :loading="imageLoading"
              @upload="
                attachImageToBoard({
                  id: board.id,
                  imageId: $event.id,
                })
              "
            />
          </li>
          <li>
            <AppLabelsPicker
              :labels="fakeLabelData.existingLabels"
              :selected="fakeLabelData.selectedLabels"
              @labelsUpdate="fakeLabelData.existingLabels = $event"
              @selectionUpdate="fakeLabelData.selectedLabels = $event"
            />
          </li>
        </ul>
      </div>
    </KPopup>
  </div>
</template>

<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board, Label } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { onClickOutside } from "@vueuse/core";
import { reactive, ref } from "vue";
import attachImageToBoardMutation from "@/graphql/mutations/attachImageToBoard.mutation.gql";
import { useMutation } from "@vue/apollo-composable";
import AppImageDropzone from "@/components/AppImageDropzone.vue";
import AppLabelsPicker from "@/components/AppLabelsPicker.vue";

const alerts = useAlerts();

defineProps<{
  board: Board;
}>();
const show = ref(false);
const menu = ref(null);

onClickOutside(menu, () =>
  setTimeout(() => {
    show.value = false;
  }, 2)
);

const emit = defineEmits<{
  (e: "deleteBoard", payload: null): void;
  (e: "imageUpload", payload: { id: string }): void;
}>();

const {
  mutate: attachImageToBoard,
  onError: errorAttachingImage,
  onDone: onImageAttached,
  loading: imageLoading,
} = useMutation(attachImageToBoardMutation);

errorAttachingImage((error) => {
  console.error(error);
  alerts.error("Error setting board image");
});
onImageAttached((result) => {
  emit("imageUpload", result.data.boardUpdate.image);
});

const fakeLabelData = reactive({
  existingLabels: [
    { label: "High Priority", color: "red", id: "1" },
    { label: "Medium Priority", color: "orange", id: "2" },
    { label: "Meh", color: "yellow", id: "3" },
  ] as Partial<Label>[],
  selectedLabels: [
    { label: "High Priority", color: "red", id: "1" },
  ] as Partial<Label>[],
});
</script>

<style scoped>
ul li {
  @apply p-2;
  border-bottom: 1px solid #eee;
}

ul li:last-of-type {
  border-bottom: none;
}
</style>
