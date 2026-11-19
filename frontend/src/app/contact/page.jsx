import Contact from "@/components/Contact";
import SocialLinks from "@/components/Contact/SocialLinks";

export const metadata = {
  title: "Contact | Globira",
  description:
    "Get in touch with Sophia Ellis to share a thought, ask a question, or suggest a story.",
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <Contact />
      <SocialLinks />
    </main>
  );
}
