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
      <button class="text-gray-500" @click="createBoard(newBoardPayload)">
        <span>New Board +</span>
      </button>
    </div>
  </div>
  <AppLoader v-if="loading" :overlay="true" />
</template>

<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board } from "@/types";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import boardsQuery from "@/graphql/queries/boards.query.gql";
import createBoardMutation from "@/graphql/mutations/createBoard.mutation.gql";

const alerts = useAlerts();

const { result, loading, onError } = useQuery(boardsQuery);
const boards = computed<Partial<Board>[]>(
  () => result?.value?.boardsList?.items || []
);

onError(() => alerts.error("Error loading boards"));

const { mutate: createBoard } = useMutation(createBoardMutation, () => ({
  update(cache, { data: { boardCreate } }) {
    cache.updateQuery({ query: boardsQuery }, (res) => ({
      boardsList: {
        items: [...res.boardsList.items, boardCreate],
      },
    }));
  },
}));

const newBoardPayload = {
  data: {
    title: "Test Board",
  },
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
