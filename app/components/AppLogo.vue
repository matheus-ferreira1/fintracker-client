<script setup lang="ts">
const props = defineProps<{
  collapsed?: boolean
}>()

watch(
  () => props.collapsed,
  (newVal) => {
    console.log(newVal)
  }
)
</script>

<template>
  <div class="flex items-center gap-2">
    <UIcon
      name="ic:baseline-wallet"
      class="size-7 text-primary"
    />
    <h1
      :class="[
        'font-bold text-xl text-primary',
        collapsed ? 'hidden' : 'block'
      ]"
    >
      FinTracker
    </h1>
  </div>
</template>
