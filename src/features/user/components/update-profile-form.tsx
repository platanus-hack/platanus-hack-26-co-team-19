"use client";

import { CheckCircle2, Loader2, MailIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DateProfileFormatter } from "@/features/shared/date/date-formatter";
import { useSession } from "@/lib/auth-client";
import useUpdateProfile from "../hooks/useUpdateProfile";
import ImageUpload from "./image-upload";

const UpdateProfileForm = () => {
	const { data, refetch, isPending, error } = useSession();

	if (!data || isPending) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading user data</div>;
	}

	return (
		<UpdateProfileFormContent
			user={data.user}
			onSuccess={() => {
				refetch();
			}}
		/>
	);
};

type UpdateProfileFormContentProps = {
	user: NonNullable<ReturnType<typeof useSession>["data"]>["user"];
	onSuccess: () => void;
};

const UpdateProfileFormContent = ({
	user,
	onSuccess,
}: UpdateProfileFormContentProps) => {
	const { form, isPending, isVerifying, verifyEmailMutation } =
		useUpdateProfile({
			name: user.name,
			email: user.email,
			onSuccess,
		});

	return (
		<Card className="w-full max-w-7xl mx-auto">
			<CardContent className="py-2">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<ImageUpload user={user} />
					<Separator />
					<div className="flex justify-between gap-2 items-center">
						<Label>Email</Label>
						<span className="max-w-1/3">{user.email}</span>
					</div>
					<Separator />
					<div className="flex justify-between gap-2 items-center">
						<Label>Verificado</Label>
						{user.emailVerified ? (
							<div className="flex items-center gap-2">
								<span className="sr-only">Verificado</span>
								<CheckCircle2 className="text-green-600" />
							</div>
						) : (
							<div className="flex items-center gap-2">
								<span className="sr-only">No verificado</span>
								<XCircle className="text-destructive" />
								<Button
									variant="outline"
									size="icon-sm"
									className="rounded-full"
									onClick={() => verifyEmailMutation.mutate()}
									type="button"
									disabled={isVerifying}
								>
									{isVerifying ? (
										<Loader2 className="size-5 animate-spin" />
									) : (
										<MailIcon className="size-5" />
									)}
								</Button>
							</div>
						)}
					</div>
					<Separator />
					<form.Field
						name="name"
						children={(field) => (
							<div className="flex justify-between gap-2 items-start">
								<Field className="flex-1 flex-row items-center justify-between gap-2">
									<FieldLabel htmlFor={field.name}>Nombre Completo</FieldLabel>
									<FieldContent className="max-w-1/3">
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Tu nombre"
										/>
										<FieldError errors={field.state.meta.errors} />
									</FieldContent>
								</Field>
							</div>
						)}
					/>
					<div className="flex justify-end">
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Guardando...
								</>
							) : (
								"Guardar"
							)}
						</Button>
					</div>
					<Separator />
					<div className="flex justify-between gap-2 items-center text-sm text-muted-foreground">
						<span>Te uniste en:</span>
						<DateProfileFormatter date={user.createdAt} />
					</div>
					<div className="flex justify-between gap-2 items-center text-sm text-muted-foreground">
						<span>Ultimo cambio de tu información:</span>
						<DateProfileFormatter date={user.updatedAt} />
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default UpdateProfileForm;
