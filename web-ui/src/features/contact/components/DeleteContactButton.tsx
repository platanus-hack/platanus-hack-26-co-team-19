"use client";

import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useDeleteContact from "../hooks/useDeleteContact";

type DeleteContactButtonProps = {
	id: string;
	trigger: React.ReactNode;
	redirectTo?: string;
};

export function DeleteContactButton({
	id,
	trigger,
	redirectTo,
}: DeleteContactButtonProps) {
	const router = useRouter();
	const deleteContact = useDeleteContact({
		onSuccess: () => {
			if (redirectTo) {
				router.push(redirectTo);
				router.refresh();
			}
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete contact submission?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. The message will be permanently
						removed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={deleteContact.isPending}
						onClick={() => deleteContact.mutate({ id })}
					>
						{deleteContact.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
