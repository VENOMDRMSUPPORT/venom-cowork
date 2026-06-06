import { LegalPage } from "../../components/legal-page";

export const metadata = {
  title: "VenomCowork â€” Terms of Use",
  description: "Terms of use for Different AI, doing business as VenomCowork.",
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsPage() {
  return <LegalPage file="terms/terms-of-use.md" />;
}
