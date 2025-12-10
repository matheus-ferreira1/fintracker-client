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
          <TransactionsTransactionModal
            :type="CategoryType.INCOME"
            :display-trigger-button="true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <TransactionsTransactionList :type="CategoryType.INCOME" />
    </template>
  </UDashboardPanel>
</template>
