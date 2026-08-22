"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateProfileFormatter } from "@/features/shared/date/date-formatter";
import { useTRPC } from "@/trpc/client";
import { DeleteContactButton } from "./DeleteContactButton";

type ContactDetailProps = {
	id: string;
};

export function ContactDetail({ id }: ContactDetailProps) {
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
		<div className="mx-auto w-full max-w-3xl space-y-6 rounded-lg border p-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
					<p className="text-muted-foreground">{data.email}</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge>{data.status}</Badge>
					<Button asChild variant="outline" size="sm">
						<Link href={`/dashboard/contacts/${data.id}/edit`}>
							<PencilIcon className="size-4" />
							Edit
						</Link>
					</Button>
					<DeleteContactButton
						id={data.id}
						redirectTo="/dashboard/contacts"
						trigger={
							<Button variant="destructive" size="sm">
								<Trash2Icon className="size-4" />
								Delete
							</Button>
						}
					/>
				</div>
			</div>
			<Separator />
			<div className="space-y-2">
				<p className="text-sm font-medium">Subject</p>
				<p className="text-sm text-muted-foreground">
					{data.subject || "No subject"}
				</p>
			</div>
			<div className="space-y-2">
				<p className="text-sm font-medium">Message</p>
				<p className="whitespace-pre-wrap text-sm leading-relaxed">
					{data.message}
				</p>
			</div>
			<Separator />
			<div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
				<div>
					<span className="mr-2">Created:</span>
					<DateProfileFormatter date={data.createdAt} />
				</div>
				<div>
					<span className="mr-2">Updated:</span>
					<DateProfileFormatter date={data.updatedAt} />
				</div>
			</div>
		</div>
	);
}
