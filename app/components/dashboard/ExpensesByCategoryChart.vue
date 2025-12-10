<script setup lang="ts">
import { VisBulletLegend, VisDonut, VisSingleContainer, VisTooltip } from '@unovis/vue';

interface Props {
  categories: CategoryExpense[]
  totalExpenses: number
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

// Pie chart configuration
const pieChartValue = (d: CategoryExpense) => d.amount
const pieChartColors = (d: CategoryExpense) => d.categoryColor
const pieChartLabel = (d: CategoryExpense) => `${d.categoryName} (${d.percentage.toFixed(1)}%)`
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Expenses by Category
      </h3>
    </template>

    <div class="h-[300px] flex items-center justify-center">
      <VisSingleContainer
        v-if="categories.length > 0"
        :data="categories"
        :height="300"
      >
        <VisDonut
          :value="pieChartValue"
          :color="pieChartColors"
          :arc-width="60"
          :center-label="formatCurrency(totalExpenses)"
          :center-sub-label="'Total Expenses'"
        />
        <VisBulletLegend
          :items="categories.map(cat => ({
            name: pieChartLabel(cat),
            color: pieChartColors(cat)
          }))"
        />
        <VisTooltip />
      </VisSingleContainer>
      <div
        v-else
        class="text-center text-gray-500 dark:text-gray-400"
      >
        <UIcon
          name="i-lucide-pie-chart"
          class="size-12 mb-2 mx-auto opacity-50"
        />
        <p>
          No expense data available
        </p>
      </div>
    </div>
  </UCard>
</template>
