import { and, asc, eq, isNull } from "@venom-cowork-ee/den-db/drizzle"
import { MemberTable } from "@venom-cowork-ee/den-db/schema"
import { normalizeDenTypeId } from "@venom-cowork-ee/utils/typeid"
import { db } from "./db.js"

export async function getInitialActiveOrganizationIdForUser(userId: string) {
  const normalizedUserId = normalizeDenTypeId("user", userId)

  const rows = await db
    .select({
      organizationId: MemberTable.organizationId,
    })
    .from(MemberTable)
    .where(and(eq(MemberTable.userId, normalizedUserId), isNull(MemberTable.removedAt)))
    .orderBy(asc(MemberTable.createdAt))
    .limit(1)

  return rows[0]?.organizationId ?? null
}
