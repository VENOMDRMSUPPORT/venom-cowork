import { sql } from "@venom-cowork-ee/den-db/drizzle"
import { AdminAllowlistTable } from "@venom-cowork-ee/den-db/schema"
import { createDenTypeId } from "@venom-cowork-ee/utils/typeid"
import { db } from "./db.js"

const ADMIN_ALLOWLIST_SEEDS = [
  {
    email: "ben@venomcowork.local",
    note: "Seeded internal admin",
  },
  {
    email: "jan@venomcowork.local",
    note: "Seeded internal admin",
  },
  {
    email: "omar@venomcowork.local",
    note: "Seeded internal admin",
  },
  {
    email: "berk@venomcowork.local",
    note: "Seeded internal admin",
  },
] as const

let ensureAdminAllowlistSeededPromise: Promise<void> | null = null

async function seedAdminAllowlist() {
  for (const entry of ADMIN_ALLOWLIST_SEEDS) {
    await db
      .insert(AdminAllowlistTable)
      .values({
        id: createDenTypeId("adminAllowlist"),
        ...entry,
      })
      .onDuplicateKeyUpdate({
        set: {
          note: entry.note,
          updated_at: sql`CURRENT_TIMESTAMP(3)`,
        },
      })
  }
}

export async function ensureAdminAllowlistSeeded() {
  if (!ensureAdminAllowlistSeededPromise) {
    ensureAdminAllowlistSeededPromise = seedAdminAllowlist().catch((error) => {
      ensureAdminAllowlistSeededPromise = null
      throw error
    })
  }

  await ensureAdminAllowlistSeededPromise
}
