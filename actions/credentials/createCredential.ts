"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("invalid form data");
  }

  const { userId } = await auth.protect();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const encryptedValue = symmetricEncrypt(data.value);

  console.log("@TEST", {
    plain: data.value,
    encrypted: encryptedValue,
  });

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("failed to create credentials");
  }
}
