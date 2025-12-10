<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { data, pending } = useAPI<ApiResponse<DashboardResponse>>('/dashboard')
</script>

<template>
  <UDashboardPanel id="home-dashboard">
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
            <TransactionsTransactionModal
              :type="CategoryType.INCOME"
              :display-trigger-button="true"
            />
            <TransactionsTransactionModal
              :type="CategoryType.EXPENSE"
              :display-trigger-button="true"
            />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        v-if="pending"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="size-8 animate-spin text-gray-400"
        />
      </div>

      <div
        v-else-if="data?.data"
        class="space-y-6 p-6"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DashboardMetricCard
            title="Current Balance"
            :value="data.data.balance.balance"
            :comparison="data.data.balance.comparison"
            icon="i-lucide-wallet"
            metric-type="balance"
          />

          <DashboardMetricCard
            title="Total Income"
            :value="data.data.income.totalIncome"
            :comparison="data.data.income.comparison"
            icon="i-lucide-trending-up"
            metric-type="income"
          />

          <DashboardMetricCard
            title="Total Expenses"
            :value="data.data.expenses.totalExpenses"
            :comparison="data.data.expenses.comparison"
            icon="i-lucide-trending-down"
            metric-type="expense"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardMonthlyComparisonChart
            :months="data.data.monthlyComparison.months"
          />

          <DashboardExpensesByCategoryChart
            :categories="data.data.expensesByCategory.categories"
            :total-expenses="data.data.expensesByCategory.totalExpenses"
          />
        </div>

        <DashboardNextMonthPrediction
          :prediction="data.data.nextMonthPrediction"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <UIcon
          name="i-lucide-alert-circle"
          class="size-12 text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Failed to load dashboard data
        </p>
      </div>
    </template>
  </UDashboardPanel>
</template>
