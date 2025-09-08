const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a test account (or get existing one)
  const testAccount = await prisma.accounts.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test Account',
      email: 'test@example.com',
      password: 'hashedpassword123',
    },
  });
  console.log('✅ Created/found test account');

  // Create a test company (or get existing one)
  const testCompany = await prisma.companies.upsert({
    where: { name: 'Test Company' },
    update: {},
    create: {
      account_id: testAccount.id,
      name: 'Test Company',
      description: 'A test company for testing purposes',
      address: '123 Test Street',
      phone_number: '+1234567890',
    },
  });
  console.log('✅ Created/found test company');

  // Check if startup exists, if not create it
  const existingStartup = await prisma.startups.findFirst({
    where: { company_id: testCompany.id }
  });
  
  if (!existingStartup) {
    await prisma.startups.create({
      data: {
        company_id: testCompany.id,
        website_url: 'https://test-startup.com',
      },
    });
    console.log('✅ Created test startup with id: 1');
  } else {
    console.log('✅ Test startup already exists');
  }

  // Create some additional startups for testing
  for (let i = 2; i <= 5; i++) {
    const account = await prisma.accounts.upsert({
      where: { email: `test${i}@example.com` },
      update: {},
      create: {
        name: `Test Account ${i}`,
        email: `test${i}@example.com`,
        password: 'hashedpassword123',
      },
    });

    const company = await prisma.companies.upsert({
      where: { name: `Test Company ${i}` },
      update: {},
      create: {
        account_id: account.id,
        name: `Test Company ${i}`,
        description: `Test company ${i} for testing purposes`,
      },
    });

    const existingStartup = await prisma.startups.findFirst({
      where: { company_id: company.id }
    });
    
    if (!existingStartup) {
      await prisma.startups.create({
        data: {
          company_id: company.id,
          website_url: `https://test-startup${i}.com`,
        },
      });
    }
  }

  console.log('✅ Created additional test startups');
  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
