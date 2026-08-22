import ContactEditView from "@/features/contact/views/ContactEditView";

type ContactEditPageProps = {
	params: Promise<{ id: string }>;
};

export default async function ContactEditPage({
	params,
}: ContactEditPageProps) {
	const { id } = await params;
	return <ContactEditView id={id} />;
}
