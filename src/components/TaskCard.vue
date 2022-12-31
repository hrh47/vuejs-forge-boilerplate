<template>
  <RouterLink :to="`/boards/${$route.params.id}/tasks/${task.id}`">
    <Card>
      <CardHeader>
        <div class="flex justify-between">
          <CardTitle>{{ task.title }}</CardTitle>
        </div>
        <Avatar type="image" size="medium" shape="circle">
          <img
            style="size: 45px; height: 45px"
            src="https://www.gravatar.com/avatar/"
          />
        </Avatar>
      </CardHeader>

      <CardSubtitle>
        <Chip
          v-if="task.dueAt"
          :text="date"
          value="chip"
          rounded="full"
          icon="k-i-clock"
          theme-color="info"
        />
      </CardSubtitle>
    </Card>
  </RouterLink>
</template>

<script setup lang="ts">
import {
  Card,
  CardTitle,
  CardHeader,
  Avatar,
  CardSubtitle,
} from "@progress/kendo-vue-layout";
import { Chip } from "@progress/kendo-vue-buttons";
import { useDateFormat } from "@vueuse/shared";
import type { Task } from "@/types";

const props = defineProps<{ task: Task }>();
const date = useDateFormat(props.task.dueAt, "MM/DD");
</script>

<style scoped></style>
