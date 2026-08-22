import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LawyerContact } from "../schemas/lawyer-profile.schema";

type ContactPanelProps = {
	contact: LawyerContact;
};

export const ContactPanel = ({ contact }: ContactPanelProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Contacto</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="flex flex-col gap-3 text-sm">
					<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
						<dt className="text-muted-foreground">Correo</dt>
						<dd>
							<a
								href={`mailto:${contact.email}`}
								className="text-foreground underline-offset-4 hover:underline"
							>
								{contact.email}
							</a>
						</dd>
					</div>
					<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
						<dt className="text-muted-foreground">Teléfono</dt>
						<dd>
							<a
								href={`tel:${contact.phone.replace(/\s/g, "")}`}
								className="text-foreground underline-offset-4 hover:underline"
							>
								{contact.phone}
							</a>
						</dd>
					</div>
					<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
						<dt className="text-muted-foreground">Dirección</dt>
						<dd className="sm:text-right">{contact.address}</dd>
					</div>
					{contact.website ? (
						<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
							<dt className="text-muted-foreground">Sitio web</dt>
							<dd>
								<a
									href={contact.website}
									target="_blank"
									rel="noreferrer"
									className="text-foreground underline-offset-4 hover:underline"
								>
									{contact.website.replace(/^https?:\/\//, "")}
								</a>
							</dd>
						</div>
					) : null}
				</dl>
			</CardContent>
		</Card>
	);
};
