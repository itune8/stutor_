import { prisma } from './services/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const educators = [
    { name: 'Alice Educator', email: 'alice.educator@example.com' },
    { name: 'Bob Educator', email: 'bob.educator@example.com' },
  ];
  for (const e of educators) {
    const exists = await prisma.user.findUnique({ where: { email: e.email } });
    if (!exists) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await prisma.user.create({ data: { name: e.name, email: e.email, passwordHash, role: 'EDUCATOR' } });
    }
  }
  console.log('Seed complete');
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
