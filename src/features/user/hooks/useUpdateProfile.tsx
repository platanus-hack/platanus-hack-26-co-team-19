"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

type UseUpdateProfileProps = {
	name: string;
	email: string;
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useUpdateProfile = ({
	name,
	email,
	onSuccess,
	onError,
}: UseUpdateProfileProps) => {
	const updateMutation = useMutation({
		mutationFn: async (value: UpdateProfileInput) => {
			const result = await authClient.updateUser({ name: value.name });
			if (result.error) {
				throw new Error(result.error.message || "Failed to update profile");
			}
			return result;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to update profile",
			);
			onError?.(error);
		},
	});

	const verifyEmailMutation = useMutation({
		mutationFn: async () => {
			const result = await authClient.sendVerificationEmail({
				email,
				callbackURL: "/dashboard",
			});
			if (result.error) {
				throw new Error(
					result.error.message || "Failed to send verification email",
				);
			}
			return result;
		},
		onSuccess: () => {
			toast.success("Verification email sent");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to send verification email",
			);
			onError?.(error);
		},
	});

	const form = useForm({
		defaultValues: {
			name,
		} as UpdateProfileInput,
		validators: {
			onChange: updateProfileSchema,
		},
		onSubmit: async ({ value }) => {
			await updateMutation.mutateAsync(value);
		},
	});

	return {
		form,
		updateMutation,
		verifyEmailMutation,
		isPending: updateMutation.isPending,
		isVerifying: verifyEmailMutation.isPending,
	};
};

export default useUpdateProfile;
