<script setup lang="ts">
import { VisAxis, VisBulletLegend, VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue';
import type { MonthlyData } from '~/types/dashboard.types';

interface Props {
  months: MonthlyData[]
}

const props = defineProps<Props>()

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const barChartX = (_d: MonthlyData, i: number) => i
const barChartY = [
  (d: MonthlyData) => d.income,
  (d: MonthlyData) => d.expenses
]

const barChartLabels = computed<string[]>(() =>
  props.months.map(m => m.label)
)

const barChartColors = ['#10b981', '#ef4444']

const template = (d: MonthlyData) => `I: ${formatCurrency(d.income)}, E: ${formatCurrency(d.expenses)}`
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Monthly Income vs Expenses
      </h3>
    </template>

    <div class="h-[300px]">
      <VisXYContainer
        :data="months"
        :height="300"
      >
        <VisGroupedBar
          :x="barChartX"
          :y="barChartY"
          :color="barChartColors"
          :bar-padding="0.2"
          :group-padding="0.1"
        />
        <VisAxis
          type="x"
          :tick-format="(i: number) => barChartLabels[i] || ''"
          :num-ticks="barChartLabels.length"
        />
        <VisAxis
          type="y"
          :tick-format="formatCurrency"
        />
        <VisCrosshair :template="template" />
        <VisTooltip />
        <VisBulletLegend
          :items="[
            { name: 'Income', color: barChartColors[0] },
            { name: 'Expenses', color: barChartColors[1] }
          ]"
        />
        <VisTooltip />
      </VisXYContainer>
    </div>
  </UCard>
</template>
