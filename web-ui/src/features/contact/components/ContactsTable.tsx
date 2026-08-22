"use client";

import { useQuery } from "@tanstack/react-query";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DateFormatter } from "@/features/shared/date/date-formatter";
import { useTRPC } from "@/trpc/client";
import { DeleteContactButton } from "./DeleteContactButton";

const statusVariant = {
	NEW: "default",
	READ: "secondary",
	ARCHIVED: "outline",
} as const;

export function ContactsTable() {
	const trpc = useTRPC();
	const { data, isPending, error } = useQuery(trpc.contact.list.queryOptions());

	if (isPending) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-sm text-destructive">
				Failed to load contacts: {error.message}
			</p>
		);
	}

	if (!data?.length) {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyTitle>No contact submissions</EmptyTitle>
					<EmptyDescription>
						Messages sent from the public contact form will appear here.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Subject</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((contact) => (
						<TableRow key={contact.id}>
							<TableCell className="font-medium">{contact.name}</TableCell>
							<TableCell>{contact.email}</TableCell>
							<TableCell className="max-w-[200px] truncate">
								{contact.subject || "—"}
							</TableCell>
							<TableCell>
								<Badge variant={statusVariant[contact.status]}>
									{contact.status}
								</Badge>
							</TableCell>
							<TableCell>
								<DateFormatter date={contact.createdAt} />
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-1">
									<Button asChild variant="ghost" size="icon-sm">
										<Link href={`/dashboard/contacts/${contact.id}`}>
											<EyeIcon className="size-4" />
											<span className="sr-only">View</span>
										</Link>
									</Button>
									<Button asChild variant="ghost" size="icon-sm">
										<Link href={`/dashboard/contacts/${contact.id}/edit`}>
											<PencilIcon className="size-4" />
											<span className="sr-only">Edit</span>
										</Link>
									</Button>
									<DeleteContactButton
										id={contact.id}
										trigger={
											<Button variant="ghost" size="icon-sm">
												<Trash2Icon className="size-4" />
												<span className="sr-only">Delete</span>
											</Button>
										}
									/>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
