import { PrismaClient, Role, AccountStatus, TenantStatus, GlucoseContext } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial HMS data...');

  // 1. Create Demo Hospital Tenant (Embu Level Five Hospital)
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'embu-level-5' },
    update: {},
    create: {
      name: 'Embu Level Five Hospital',
      slug: 'embu-level-5',
      status: TenantStatus.ACTIVE,
      settings: {
        create: {
          glucoseUnits: 'mmol/L',
          pharmacyContact: '+254700000000',
          refillReminderOffsets: [7, 3, 0],
          critHypoThreshold: 3.0,
          critHyperThreshold: 16.7,
          critHba1cThreshold: 10.0,
          highHba1cMin: 8.5,
          modHba1cMin: 7.0,
        },
      },
    },
  });

  console.log(`Tenant created/found: ${tenant.name} (${tenant.id})`);

  // Common password hash for demo accounts
  const passwordHash = await argon2.hash('Admin123!Password');

  // 2. Create Super Admin User (No tenant)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@hms.health' },
    update: {},
    create: {
      email: 'superadmin@hms.health',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });
  console.log(`Super Admin created: ${superAdmin.email}`);

  // 3. Create Hospital Admin User
  const hospitalAdmin = await prisma.user.upsert({
    where: { email: 'admin@embuhospital.or.ke' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@embuhospital.or.ke',
      passwordHash,
      firstName: 'Hospital',
      lastName: 'Admin',
      role: Role.HOSPITAL_ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });
  console.log(`Hospital Admin created: ${hospitalAdmin.email}`);

  // 4. Create Clinician User (Diabetologist)
  const clinicianUser = await prisma.user.upsert({
    where: { email: 'dr.mwangi@embuhospital.or.ke' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'dr.mwangi@embuhospital.or.ke',
      passwordHash,
      firstName: 'Dr. James',
      lastName: 'Mwangi',
      role: Role.DIABETOLOGIST,
      status: AccountStatus.ACTIVE,
    },
  });

  const clinicianProfile = await prisma.clinicianProfile.upsert({
    where: { userId: clinicianUser.id },
    update: {},
    create: {
      userId: clinicianUser.id,
      tenantId: tenant.id,
      specialty: Role.DIABETOLOGIST,
      licenceNumber: 'KMPDC-12345',
      bio: 'Lead Diabetologist at Embu Level 5 Hospital.',
    },
  });
  console.log(`Clinician Profile created: ${clinicianUser.firstName} ${clinicianUser.lastName}`);

  // 5. Create Patient User
  const patientUser = await prisma.user.upsert({
    where: { email: 'amina.wambui@patient.hms.health' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'amina.wambui@patient.hms.health',
      phone: '+254712345678',
      passwordHash,
      firstName: 'Amina',
      lastName: 'Wambui',
      role: Role.PATIENT,
      status: AccountStatus.ACTIVE,
    },
  });

  const patientProfile = await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      tenantId: tenant.id,
      dateOfBirth: new Date('1985-06-15'),
      sex: 'FEMALE',
      diagnosisDate: new Date('2020-01-10'),
      assignedClinicianId: clinicianProfile.id,
    },
  });
  console.log(`Patient Profile created: ${patientUser.firstName} ${patientUser.lastName}`);

  // 6. Create sample glucose readings
  await prisma.glucoseReading.createMany({
    data: [
      {
        tenantId: tenant.id,
        patientId: patientProfile.id,
        value: 6.8,
        context: GlucoseContext.FASTING,
        source: 'MANUAL',
        measuredAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      },
      {
        tenantId: tenant.id,
        patientId: patientProfile.id,
        value: 8.2,
        context: GlucoseContext.AFTER_MEAL,
        source: 'MANUAL',
        measuredAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
      },
      {
        tenantId: tenant.id,
        patientId: patientProfile.id,
        value: 5.9,
        context: GlucoseContext.FASTING,
        source: 'MANUAL',
        measuredAt: new Date(),
      },
    ],
  });

  // 7. Create sample HbA1c result
  await prisma.hba1cResult.create({
    data: {
      tenantId: tenant.id,
      patientId: patientProfile.id,
      value: 7.4,
      recordedById: clinicianProfile.id,
      notes: 'Initial evaluation HbA1c result.',
      resultDate: new Date(),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
