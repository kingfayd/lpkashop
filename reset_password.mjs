import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Resetting password for princeboateng2235@gmail.com...");
        
        // Update the password using pgcrypto's crypt() function
        const result = await prisma.$executeRawUnsafe(`
            UPDATE auth.users 
            SET encrypted_password = crypt('password123', gen_salt('bf')) 
            WHERE email = 'princeboateng2235@gmail.com';
        `);
        
        console.log(`Updated ${result} user passwords.`);
    } catch (e) {
        console.error("Error:", e);
    }
}

main().finally(() => prisma.$disconnect());
