<script setup lang="ts">
import type { NextMonthPrediction as NextMonthPredictionType } from '~/types/dashboard.types'

interface Props {
  prediction: NextMonthPredictionType
}

defineProps<Props>()

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-crystal-ball"
          class="size-5"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Next Month Prediction
        </h3>
      </div>
    </template>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Predicted Balance -->
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          Predicted Balance
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(prediction.predictedBalance) }}
        </p>
      </div>

      <!-- Predicted Income -->
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          Predicted Income
        </p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatCurrency(prediction.predictedIncome) }}
        </p>
        <UBadge
          color="success"
          variant="subtle"
          size="sm"
        >
          <template #leading>
            <UIcon
              name="i-lucide-repeat"
              class="size-3"
            />
          </template>
          {{ prediction.recurringTransactionsCount.income }} recurring
        </UBadge>
      </div>

      <!-- Predicted Expenses -->
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          Predicted Expenses
        </p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ formatCurrency(prediction.predictedExpenses) }}
        </p>
        <UBadge
          color="error"
          variant="subtle"
          size="sm"
        >
          <template #leading>
            <UIcon
              name="i-lucide-repeat"
              class="size-3"
            />
          </template>
          {{ prediction.recurringTransactionsCount.expenses }} recurring
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
