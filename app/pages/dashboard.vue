<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Dashboard"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="space-x-2">
            <TransactionsIncomeModal />
            <TransactionsExpenseModal />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      teste
    </template>
  </UDashboardPanel>
</template>
