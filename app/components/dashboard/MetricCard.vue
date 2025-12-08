<script setup lang="ts">
import type { PercentageComparison } from '~/types/dashboard.types'

interface Props {
  title: string
  value: number
  comparison: PercentageComparison
  icon: string
  metricType: 'balance' | 'income' | 'expense'
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

const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up':
      return 'i-lucide-trending-up'
    case 'down':
      return 'i-lucide-trending-down'
    case 'stable':
      return 'i-lucide-minus'
  }
}

const getBadgeColor = (): 'success' | 'error' | 'neutral' => {
  const { trend } = props.comparison

  if (props.metricType === 'expense') {
    if (trend === 'down') return 'success'
    if (trend === 'up') return 'error'
    return 'neutral'
  }

  if (trend === 'up') return 'success'
  if (trend === 'down') return 'error'
  return 'neutral'
}
</script>

<template>
  <UCard>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ title }}
        </h3>
        <UIcon
          :name="icon"
          class="size-5 text-gray-400 dark:text-gray-500"
        />
      </div>

      <div class="space-y-2">
        <p class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(value) }}
        </p>

        <UBadge
          :color="getBadgeColor()"
          variant="subtle"
          size="sm"
        >
          <template #leading>
            <UIcon
              :name="getTrendIcon(comparison.trend)"
              class="size-3"
            />
          </template>
          {{ formatPercentage(comparison.percentageChange) }} vs last month
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
