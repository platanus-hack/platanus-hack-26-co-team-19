import { ContactDetail } from "../components/ContactDetail";

type ContactDetailViewProps = {
	id: string;
};

export default function ContactDetailView({ id }: ContactDetailViewProps) {
	return <ContactDetail id={id} />;
}
