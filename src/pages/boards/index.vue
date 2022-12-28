<template>
  <div>
    <h1 class="text-3xl mb-5">Boards</h1>
    <div class="flex flex-wrap gap-2">
      <div
        class="border rounded-md bg-gradient-to-tr"
        v-for="(board, index) in boards"
        :key="board.id"
        :class="getCoolGradient(index)"
      >
        <BoardCard
          :board="board"
          class="transition duration-100 ease-in border rounded-md hover:-rotate-3"
        />
      </div>
      <button class="text-gray-500" @click="createBoard">
        <span>New Board +</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board } from "@/types";
import { ref } from "vue";

const alerts = useAlerts();

const boards = ref<Partial<Board>[]>([
  {
    id: "1",
    title: "My First Board",
    order: "[]",
    image: {
      downloadUrl: "https://picsum.photos/480/270?board=1",
    },
  },
  {
    id: "2",
    title: "My Second Board",
    order: "[]",
    image: {
      downloadUrl: "https://picsum.photos/480/270?board=2",
    },
  },
  {
    id: "3",
    title: "My Third Board",
    order: "https://picsum.photos/480/270?watermelon=3",
  },
  {
    id: "4",
    title: "And another one",
    order: "https://picsum.photos/480/270?watermelon=4",
  },
  {
    id: "5",
    title: "Cute boardie",
    order: "https://picsum.photos/480/270?watermelon=5",
  },
  {
    id: "6",
    title: "Serious corpo board",
    order: "https://picsum.photos/480/270?watermelon=6",
  },
]);
const createBoard = () => {
  alerts.success("board created!");
};

const getCoolGradient = (index: number) => {
  switch (index) {
    case 1:
      return "from-orange-400 to-pink-500";
    case 2:
      return "from-green-400 to-blue-400";
    case 3:
      return "from-purple-400 to-blue-400";
    default:
      return "from-orange-400 to-yellow-500";
  }
};
</script>

<style scoped></style>
