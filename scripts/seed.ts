import { faker } from "@faker-js/faker";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient, UserRole } from "@prisma/client";
import "dotenv/config";
// @ts-expect-error not part of main project
import { invokeModel } from "../src/server/bedrock.ts";

const db = new PrismaClient();

const TUTOR_COUNT = 10;

async function main() {
  console.log("🌱 Starting to seed the database...");

  for (let i = 0; i < TUTOR_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = `${faker.internet.password({ length: 10 })}!1A`; // Ensure password meets common complexity requirements

    console.log(
      `[${i + 1}/${TUTOR_COUNT}] Creating tutor: ${firstName} ${lastName} (${email})`,
    );

    try {
      // 1. Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        firstName,
        lastName,
        emailAddress: [email],
        password,
      });

      console.log(` -> Created Clerk user with ID: ${clerkUser.id}`);

      // 2. Prepare profile data and generate embedding
      const profileData = {
        subjectInterests: [faker.company.buzzNoun(), faker.company.buzzNoun()],
        teachingLevels: ['High School', 'Undergraduate'],
        yearsOfExperience: faker.number.int({ min: 1, max: 20 }),
        teachingStyle: [faker.word.adjective(), faker.word.adjective()],
      };
      
      const embeddingText = `
        This text describes a tutor profile for an AI tutoring match system.
        Subject Interests:
        ${profileData.subjectInterests.map((s) => `- ${s}`).join('\n')}
        Teaching Levels:
        ${profileData.teachingLevels.map((l) => `- ${l}`).join('\n')}
        Teaching Style:
        ${profileData.teachingStyle.join(', ')}
      `;

      const { embedding } = await invokeModel(embeddingText);
      console.log(' -> Generated embedding.');

      // 3. Run database operations in a transaction
      await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            supabaseUid: clerkUser.id, // Using supabaseUid field for Clerk ID
            name: `${firstName} ${lastName}`,
            email: email,
            role: UserRole.TUTOR,
          },
        });

        const profile = await tx.tutorProfile.create({
          data: {
            userId: user.id,
            ...profileData,
          },
        });

        await tx.$executeRaw`UPDATE "TutorProfile" SET "embedding" = ${JSON.stringify(embedding)}::vector WHERE "id" = ${profile.id}`;
        
        console.log(` -> Created DB user, profile, and saved embedding for ${user.name}`);
      });

    } catch (e: unknown) {
      const error  = e as Partial<{ errors: unknown; message: unknown }>;
      const message = error.errors ? JSON.stringify(error.errors) : error.message;
      console.error(`❌ Failed to create tutor ${i + 1}:`, message);
    }
  }

  console.log("✅ Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

