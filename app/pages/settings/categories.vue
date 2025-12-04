<script setup lang="ts">
import { CategoryType } from '~/types/category.types';

definePageMeta({
  middleware: 'auth'
})

const items = [
  {
    label: 'Income',
    icon: 'material-symbols:trending-up',
    slot: 'income'
  },
  {
    label: 'Expenses',
    icon: 'material-symbols:trending-down',
    slot: 'expenses'
  }
]
</script>

<template>
  <UPageCard
    title="Categories"
    description="Create and customize categories to organize your transactions exactly how you want."
    variant="subtle"
  >
    <UTabs :items="items">
      <template #income>
        <CategoriesCategoryList :type="CategoryType.INCOME" />
      </template>

      <template #expenses>
        <CategoriesCategoryList :type="CategoryType.EXPENSE" />
      </template>
    </UTabs>
  </UPageCard>
</template>
