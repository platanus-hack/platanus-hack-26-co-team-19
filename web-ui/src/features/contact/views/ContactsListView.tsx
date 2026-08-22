import { ContactsTable } from "../components/ContactsTable";

export default function ContactsListView() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
				<p className="text-sm text-muted-foreground">
					Review and manage messages from the public contact form.
				</p>
			</div>
			<ContactsTable />
		</div>
	);
}
