<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Category, CategoryType } from '~/types/category'
import { PREDEFINED_COLORS } from '~/types/category'

interface Props {
  type: CategoryType
  category?: Category
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [name: string, color: string, type: CategoryType]
  update: [id: string, name: string, color: string]
}>()

const open = defineModel<boolean>('open', { default: false })

const schema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  name: '',
  type: props.type,
  color: PREDEFINED_COLORS[0]
})

watch(() => props.category, (newCategory) => {
  if (newCategory) {
    state.name = newCategory.name
    state.type = newCategory.type
    state.color = newCategory.color
  }
}, { immediate: true })

watch(() => props.type, (newType) => {
  if (!props.category) {
    state.type = newType
  }
})

watch(open, (isOpen) => {
  if (!isOpen && !props.category) {
    state.name = ''
    state.type = props.type
    state.color = PREDEFINED_COLORS[0]
  }
})

const isEditMode = computed(() => !!props.category)
const modalTitle = computed(() => isEditMode.value ? 'Edit Category' : 'Create Category')
const modalDescription = computed(() =>
  isEditMode.value
    ? 'Update the category details below.'
    : 'Create a new category to organize your transactions.'
)
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Create')

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (isEditMode.value && props.category) {
    emit('update', props.category.id, event.data.name, event.data.color)
  } else {
    emit('submit', event.data.name, event.data.color, event.data.type)
  }

  open.value = false
}

function selectColor(color: string) {
  state.color = color
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
    :description="modalDescription"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Name"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            placeholder="Enter category name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Type"
          name="type"
          required
        >
          <USelect
            v-model="state.type"
            :items="[
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' }
            ]"
            value-key="value"
            option-attribute="label"
            disabled
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Color"
          name="color"
          required
        >
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                :style="{ backgroundColor: state.color }"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ state.color }}
              </span>
            </div>

            <div class="grid grid-cols-10 gap-2">
              <button
                v-for="color in PREDEFINED_COLORS"
                :key="color"
                type="button"
                class="w-8 h-8 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :class="{
                  'ring-2 ring-primary ring-offset-2': state.color === color,
                  'border-2 border-gray-200 dark:border-gray-700': state.color !== color
                }"
                :style="{ backgroundColor: color }"
                :aria-label="`Select color ${color}`"
                @click="selectColor(color)"
              />
            </div>
          </div>
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="submitButtonLabel"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
