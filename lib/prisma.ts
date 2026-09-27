import { PrismaClient } from '@/app/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Add this SSL configuration block
    ssl: {
      rejectUnauthorized: false, 
    }
  })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
