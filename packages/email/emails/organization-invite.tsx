import {
  OrganizationInviteEmail,
  type OrganizationInviteEmailProps,
} from "../src/templates/organization-invite"

export default function OrganizationInvitePreview(props: OrganizationInviteEmailProps) {
  return <OrganizationInviteEmail {...props} />
}

OrganizationInvitePreview.PreviewProps = {
  inviteLink: "https://app.venomcowork.local/join-org?invite=invitation_preview",
  invitedByName: "Ada Lovelace",
  invitedByEmail: "ada@example.com",
  organizationName: "VenomCowork Preview",
  role: "admin",
} satisfies OrganizationInviteEmailProps
