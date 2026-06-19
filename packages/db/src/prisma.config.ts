import "dotenv/config";

export const prismaConfig = {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
