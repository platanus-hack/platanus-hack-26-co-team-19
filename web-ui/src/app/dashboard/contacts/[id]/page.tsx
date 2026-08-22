import ContactDetailView from "@/features/contact/views/ContactDetailView";

type ContactPageProps = {
	params: Promise<{ id: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
	const { id } = await params;
	return <ContactDetailView id={id} />;
}
