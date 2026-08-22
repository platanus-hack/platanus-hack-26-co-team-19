"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useCreateContact from "@/features/contact/hooks/useCreateContact";

export function ContactForm() {
	const { form, isPending } = useCreateContact({
		onSuccess: () => {
			form.reset();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="grid gap-4"
		>
			<form.Field
				name="name"
				children={(field) => (
					<Field>
						<FieldLabel>Name</FieldLabel>
						<FieldContent>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Your name"
								required
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
								id={field.name}
								name={field.name}
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="you@example.com"
								required
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
								id={field.name}
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="How can we help?"
							/>
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
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Tell us a bit more..."
								rows={5}
								required
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			/>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						disabled={!canSubmit || isPending || isSubmitting}
					>
						{isPending || isSubmitting ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Sending...
							</>
						) : (
							"Send message"
						)}
					</Button>
				)}
			/>
		</form>
	);
}
