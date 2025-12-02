<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <UDashboardPanel id="income">
    <template #header>
      <UDashboardNavbar
        title="Income"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="space-x-2">
            <TransactionsTransactionModal type="income" />
            <TransactionsTransactionModal type="expense" />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      income
    </template>
  </UDashboardPanel>
</template>
