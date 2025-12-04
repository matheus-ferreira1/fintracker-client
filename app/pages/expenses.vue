<script setup lang="ts">
import { CategoryType } from '~/types/category.types';

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <UDashboardPanel id="expenses">
    <template #header>
      <UDashboardNavbar
        title="Expenses"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <TransactionsTransactionModal :type="CategoryType.EXPENSE" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <TransactionsTransactionList :type="CategoryType.EXPENSE" />
    </template>
  </UDashboardPanel>
</template>
