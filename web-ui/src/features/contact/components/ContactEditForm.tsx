"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import useUpdateContact from "../hooks/useUpdateContact";
import type { Contact, ContactStatusType } from "../schemas/contact.schema";

type ContactEditFormProps = {
	id: string;
};

export function ContactEditForm({ id }: ContactEditFormProps) {
	const router = useRouter();
	const trpc = useTRPC();
	const { data, isPending, error } = useQuery(
		trpc.contact.get.queryOptions({ id }),
	);

	if (isPending) {
		return (
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Loader2 className="size-4 animate-spin" />
				Loading contact...
			</div>
		);
	}

	if (error || !data) {
		return (
			<p className="text-sm text-destructive">
				{error?.message || "Contact not found"}
			</p>
		);
	}

	return (
		<ContactEditFormInner
			contact={data}
			onSuccess={() => {
				router.push(`/dashboard/contacts/${id}`);
				router.refresh();
			}}
		/>
	);
}

type ContactEditFormInnerProps = {
	contact: Contact;
	onSuccess: () => void;
};

function ContactEditFormInner({
	contact,
	onSuccess,
}: ContactEditFormInnerProps) {
	const { form, isPending } = useUpdateContact({ contact, onSuccess });

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border p-6"
		>
			<form.Field
				name="name"
				children={(field) => (
					<Field>
						<FieldLabel>Name</FieldLabel>
						<FieldContent>
							<Input
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<form.Field
				name="email"
				children={(field) => (
					<Field>
						<FieldLabel>Email</FieldLabel>
						<FieldContent>
							<Input
								type="email"
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<form.Field
				name="subject"
				children={(field) => (
					<Field>
						<FieldLabel>Subject</FieldLabel>
						<FieldContent>
							<Input
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<form.Field
				name="status"
				children={(field) => (
					<Field>
						<FieldLabel>Status</FieldLabel>
						<FieldContent>
							<Select
								value={field.state.value}
								onValueChange={(value) =>
									field.handleChange(value as ContactStatusType)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="NEW">NEW</SelectItem>
									<SelectItem value="READ">READ</SelectItem>
									<SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
								</SelectContent>
							</Select>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<form.Field
				name="message"
				children={(field) => (
					<Field>
						<FieldLabel>Message</FieldLabel>
						<FieldContent>
							<Textarea
								rows={6}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<div className="flex gap-2">
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Saving...
						</>
					) : (
						"Save changes"
					)}
				</Button>
				<Button type="button" variant="outline" onClick={() => onSuccess()}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
