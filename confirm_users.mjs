import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Confirming all Supabase auth users...");
        // This will update all unconfirmed users in the Supabase auth schema
        const result = await prisma.$executeRawUnsafe(`UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;`);
        console.log(`Updated ${result} rows in auth.users.`);
        
        // Also list users in auth.users to see if any exist
        const users = await prisma.$queryRawUnsafe(`SELECT id, email, email_confirmed_at FROM auth.users;`);
        console.log("Current Auth Users:", users);
    } catch (e) {
        console.error("Failed:", e);
    }
}

main().finally(() => prisma.$disconnect());
