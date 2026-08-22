import { ContactEditForm } from "../components/ContactEditForm";

type ContactEditViewProps = {
	id: string;
};

export default function ContactEditView({ id }: ContactEditViewProps) {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Edit contact</h1>
				<p className="text-sm text-muted-foreground">
					Update submission details and status.
				</p>
			</div>
			<ContactEditForm id={id} />
		</div>
	);
}
