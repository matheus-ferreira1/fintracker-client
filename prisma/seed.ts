import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { CategoryType, PrismaClient } from './generated/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const data = [
  { name: 'Salary', color: '#10B981', type: CategoryType.income, isDefault: true, userId: null },
  { name: 'Rent', color: '#10B981', type: CategoryType.income, isDefault: true, userId: null },
  { name: 'Freelance', color: '#3B82F6', type: CategoryType.income, isDefault: true, userId: null },
  { name: 'Investments', color: '#8B5CF6', type: CategoryType.income, isDefault: true, userId: null },
  { name: 'Other Income', color: '#6366F1', type: CategoryType.income, isDefault: true, userId: null },
  { name: 'Housing', color: '#EF4444', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Transportation', color: '#F59E0B', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Food', color: '#EC4899', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Utilities', color: '#14B8A6', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Healthcare', color: '#F43F5E', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Shopping', color: '#06B6D4', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Education', color: '#84CC16', type: CategoryType.expense, isDefault: true, userId: null },
  { name: 'Other Expenses', color: '#64748B', type: CategoryType.expense, isDefault: true, userId: null }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const d of data) {
    const cat = await prisma.category.create({
      data: d
    })
    console.log(`Created category with id: ${cat.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
