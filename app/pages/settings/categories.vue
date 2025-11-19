<script setup lang="ts">
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
        <CategoriesIncomeList />
      </template>

      <template #expenses>
        <CategoriesExpensesList />
      </template>
    </UTabs>
  </UPageCard>
</template>
