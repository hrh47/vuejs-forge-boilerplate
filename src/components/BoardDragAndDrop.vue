<template>
  <div class="flex items-start py-6 max-w-full">
    <draggable
      :list="columns"
      group="columns"
      item-key="id"
      class="flex flex-grow-0 flex-shrink-0 overflow-x-scroll max-w-full"
    >
      <template #item="{ element: column }">
        <div
          class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 mr-4 w-[300px]"
        >
          <h3>
            <input
              type="text"
              :value="column.title"
              class="bg-transparent mb-2"
              @keydown.enter="($event.target as HTMLInputElement).blur()"
              @blur="column.title = ($event.target as HTMLInputElement).value"
            />
          </h3>
          <draggable
            :list="column.taskIds"
            group="tasks"
            item-key="id"
            :animation="200"
            ghost-class="ghost-card"
            class="min-h-[400px]"
          >
            <template #item="{ element: taskId }">
              <TaskCard
                v-if="tasks.find((t) => t.id === taskId)"
                :task="(tasks.find((t) => t.id === taskId) as Task)"
                class="mt-3 cursor-move"
              />
            </template>
          </draggable>
          <TaskCreator @create="addTask({ column, title: $event })" />
        </div>
      </template>
    </draggable>
  </div>
  <button
    class="text-gray-500 whitespace-nowrap pr-10 block"
    @click="addColumn"
  >
    New Column +
  </button>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { reactive, toRaw, watch } from "vue";
import { v4 as uuid } from "uuid";
import draggable from "vuedraggable";
import TaskCard from "@/components/TaskCard.vue";
import type { Board, Column, Task } from "@/types";
import { useAlerts } from "@/stores/alerts";

const alerts = useAlerts();
const props = defineProps<{
  board: Board;
  tasks: Task[];
  addTask(task: Partial<Task>): Promise<Task>;
}>();
const emit = defineEmits<{
  (e: "update", payload: Partial<Board>): void;
}>();
const tasks = reactive(cloneDeep(props.tasks));
const board = reactive(cloneDeep(props.board));
const columns = reactive<Column[]>(
  typeof board.order === "string"
    ? JSON.parse(board.order as string)
    : board.order
);

const addColumn = () => {
  columns.push({ id: uuid(), title: "New column", taskIds: [] });
};

watch(columns, () => {
  emit(
    "update",
    cloneDeep({
      ...props.board,
      order: JSON.stringify(toRaw(columns)),
    })
  );
});

const addTask = async ({
  column,
  title,
}: {
  column: Column;
  title: string;
}) => {
  const newTask = { title };
  try {
    const savedTask = await props.addTask(newTask);
    tasks.push({ ...savedTask });
    column.taskIds.push(savedTask.id);
  } catch (error) {
    alerts.error("Error creating task!");
  }
};
</script>
