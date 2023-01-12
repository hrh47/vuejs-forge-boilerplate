<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
if (!localStorage.getItem("id_token")) {
  router.push("/login");
} else {
  router.push("/boards");
}
</script>
