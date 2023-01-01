<template>
  <div v-if="board">
    <div class="flex justify-between">
      <AppPageHeading>
        <input
          @keydown.enter="($event.target as HTMLInputElement).blur()"
          @blur="updateBoardTitle(($event.target as HTMLInputElement).value)"
          type="text"
          :value="board.title"
        />
      </AppPageHeading>
      <BoardMenu
        :board="(board as Board)"
        @deleteBoard="deleteBoardIfConfirmed"
      />
    </div>

    <BoardDragAndDrop
      :tasks="(tasks as Task[])"
      :board="(board as Board)"
      @update="updateBoard"
      :add-task="addTask"
    />
    <AppLoader v-if="loadingBoard" :overlay="true" />
  </div>
</template>

<script setup lang="ts">
import AppPageHeading from "@/components/AppPageHeading.vue";
import BoardMenu from "@/components/BoardMenu.vue";
import BoardDragAndDrop from "@/components/BoardDragAndDrop.vue";
import type { Board, Task } from "@/types";
import { computed, ref, toRefs } from "vue";
import { useAlerts } from "@/stores/alerts";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import getBoardQuery from "@/graphql/queries/board.query.gql";
import updateBoardMutation from "@/graphql/mutations/updateBoard.mutation.gql";
import deleteBoardMutation from "@/graphql/mutations/deleteBoard.mutation.gql";
import addTaskToBoardMutation from "@/graphql/mutations/addTaskToBoard.mutation.gql";
import boardsQuery from "@/graphql/queries/boards.query.gql";

const alerts = useAlerts();
const router = useRouter();
const props = defineProps<{
  id: string;
}>();

const { id: boardId } = toRefs(props);

const {
  result: boardData,
  loading: loadingBoard,
  onError: onBoardError,
} = useQuery(
  getBoardQuery,
  { id: boardId.value },
  { fetchPolicy: "cache-and-network" }
);
onBoardError(() => alerts.error("Error loading board"));
const board = computed(() => boardData.value?.board || null);
const tasks = computed(() => board.value?.tasks?.items);
const updatingTitle = ref(false);

const { mutate: updateBoard, onDone: onBoardUpdated } =
  useMutation(updateBoardMutation);

onBoardUpdated(() => {
  if (updatingTitle.value) {
    alerts.success("Board successfully updated!");
  }
});

const updateBoardTitle = async (title: string) => {
  if (board.value.title === title) return;
  updatingTitle.value = true;
  await updateBoard({ id: boardId.value, title });
  updatingTitle.value = false;
};
const { mutate: deleteBoard, onError: onErrorDeletingBoard } = useMutation(
  deleteBoardMutation,
  {
    update(cache) {
      cache.updateQuery({ query: boardsQuery }, (res) => {
        return {
          boardsList: {
            items: res.boardsList.items.filter(
              (b: Board) => b.id !== boardId.value
            ),
          },
        };
      });
    },
  }
);
onErrorDeletingBoard(() => alerts.error("Error deleting board"));

const deleteBoardIfConfirmed = async () => {
  const yes = confirm("Are you sure you want to delete this board?");
  if (yes) {
    await deleteBoard({ id: boardId.value });
    router.push("/");
    alerts.success("Board successfully deleted");
  }
};

const {
  mutate: addTaskToBoard,
  onError: onErrorCreatingTask,
  onDone: onDoneCreatingTask,
} = useMutation(addTaskToBoardMutation);

let taskResolve = (task: Task) => {};
let taskReject = (message: Error) => {};

const addTask = async (task: Task) => {
  return new Promise<Task>((resolve, reject) => {
    taskResolve = resolve;
    taskReject = reject;
    addTaskToBoard({
      boardId: boardId.value,
      ...task,
    });
  });
};

onErrorCreatingTask((error) => {
  taskReject(error);
});
onDoneCreatingTask((res) => {
  taskResolve(res.data.boardUpdate.tasks.items[0]);
  alerts.success("New task created!");
});
</script>

<style scoped>
pre {
  width: 400px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
