export const transactionRepository = {
  async getAvailablePeriods(userId: string): Promise<{ period: Date }[]> {
    return prisma.$queryRaw`
    SELECT DISTINCT DATE_TRUNC('month', t.date) AS period
    FROM "Transaction" t
    WHERE t."userId" = ${userId}
    ORDER BY period DESC
  `
  }
}
