<script setup lang="ts">
import { CategoryTypeEnum, type Category } from '~/types/category.types'

const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories(CategoryTypeEnum.INCOME)

const createModalOpen = ref(false)
const editModalOpen = ref(false)
const selectedCategory = ref<Category | undefined>()

function openEditModal(category: Category) {
  selectedCategory.value = category
  editModalOpen.value = true
}

async function handleCreate(name: string, color: string, type: 'income' | 'expense') {
  await createCategory({ name, color, type })
  createModalOpen.value = false
}

async function handleUpdate(id: string, name: string, color: string) {
  await updateCategory({ id, name, color })
  editModalOpen.value = false
  selectedCategory.value = undefined
}

async function handleConfirmDelete(categoryIDToDelete: string) {
  await deleteCategory(categoryIDToDelete)
}

watch(editModalOpen, (isOpen) => {
  if (!isOpen) {
    selectedCategory.value = undefined
  }
})
</script>

<template>
  <div class="mt-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Income Categories
      </h3>
      <UButton
        label="Add Category"
        icon="i-lucide-plus"
        color="primary"
        variant="solid"
        size="sm"
        @click="createModalOpen = true"
      />
    </div>

    <div
      v-if="loading"
      class="flex justify-center items-center py-12"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-6 h-6 animate-spin text-gray-400"
      />
    </div>

    <div
      v-else-if="error"
      class="text-center py-12"
    >
      <p class="text-red-500 dark:text-red-400">
        Failed to load categories. Please try again.
      </p>
    </div>

    <div
      v-else-if="categories.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-folder-open"
        class="w-12 h-12 mx-auto mb-4 text-gray-400"
      />
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        No income categories yet
      </p>
    </div>

    <div
      v-else
      class="space-y-2"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        <div class="flex items-center gap-3 flex-1">
          <div
            class="w-3 h-3 rounded-full shrink-0"
            :style="{ backgroundColor: category.color }"
            :aria-label="`Category color: ${category.color}`"
          />
          <span class="font-medium text-gray-900 dark:text-white">
            {{ category.name }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <UBadge
            v-if="category.is_default"
            label="Default"
            color="neutral"
            variant="subtle"
            size="sm"
          />

          <div
            v-if="!category.is_default"
            class="flex items-center gap-1"
          >
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Edit category"
              @click="openEditModal(category)"
            />
            <CategoriesDeleteModal
              :category="category"
              @confirm="handleConfirmDelete(category.id)"
            >
              <UButton
                icon="i-lucide-trash"
                color="error"
                variant="ghost"
                size="sm"
                aria-label="Delete category"
              />
            </CategoriesDeleteModal>
          </div>
        </div>
      </div>
    </div>

    <CategoriesCategoryModal
      v-model:open="createModalOpen"
      type="income"
      @submit="handleCreate"
    />

    <CategoriesCategoryModal
      v-model:open="editModalOpen"
      type="income"
      :category="selectedCategory"
      @update="handleUpdate"
    />
  </div>
</template>
