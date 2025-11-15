<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const title = 'FinTracker'
const description
  = 'Track income, manage expenses, and predict your financial future with our intuitive expense tracker.'

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

definePageMeta({
  layout: 'landing'
})

const links: ButtonProps[] = [
  {
    label: 'Start Free Today',
    to: '/register',
    trailingIcon: 'material-symbols:arrow-right-alt'
  },
  {
    label: 'Sign In',
    to: '/login',
    variant: 'outline'
  }
]

const features = ref([
  {
    title: 'Smart Categories',
    description:
      'Create and customize categories to organize your transactions exactly how you want.',
    icon: 'material-symbols:pie-chart'
  },
  {
    title: 'Recurring Tracking',
    description:
      'Mark recurring transactions and see predictions for your next month\'s finances.',
    icon: 'material-symbols:calendar-today'
  },
  {
    title: 'Visual Dashboard',
    description:
      'Beautiful charts and graphs that make understanding your money effortless.',
    icon: 'material-symbols:trending-up'
  },
  {
    title: 'Full Control',
    description:
      'Edit, update, or delete any transaction. Your data, your rules.',
    icon: 'material-symbols:settings'
  },
  {
    title: 'Monthly Insights',
    description:
      'Track your spending patterns across months with detailed breakdowns.',
    icon: 'material-symbols:insert-chart-outline'
  },
  {
    title: 'Stay Informed',
    description:
      'Get insights into where your money goes and plan ahead with confidence.',
    icon: 'material-symbols:notifications-outline'
  }
])
</script>

<template>
  <div>
    <UPageHero
      title="Take Control of Your Finances"
      description="Track income, manage expenses, and predict your financial future with our intuitive expense tracker."
      :links="links"
    >
      <template #top>
        <HeroBackground />
      </template>

      <PromotionalImage />
    </UPageHero>

    <UPageSection
      title="Everything You Need to Manage Money"
      description="Powerful features to keep your finances organized and predictable."
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in features"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageCTA
      title="Ready to Take Control?"
      description="Join thousands of users who have transformed their financial lives with FinTracker"
      :links="links"
      variant="subtle"
    />
  </div>
</template>
