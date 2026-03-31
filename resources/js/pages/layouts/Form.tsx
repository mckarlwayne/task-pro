'use client';

import * as React from 'react';
import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters.')
        .max(255, 'Title must be at most 255 characters.'),
    description: z
        .string()
        .min(20, 'Description must be at least 20 characters.')
        .max(1000, 'Description must be at most 1000 characters.'),
    file: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 10 * 1024 * 1024,
            'File size must be less than 10MB',
        )
        .refine(
            (file) =>
                !file ||
                [
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'image/gif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                ].includes(file.type),
            'File type not supported',
        ),
});

export function BugReportForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        console.log('Submitting data:', data);
        console.log('File in data:', data.file);

        // Manually create FormData to ensure file is sent correctly
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.file) {
            formData.append('file', data.file);
        }

        router.post('/tasks', formData, {
            onSuccess: () => {
                toast.success('Task created successfully!');
                form.reset();
                // Clear file input manually since form.reset() might not clear file inputs
                const fileInput = document.getElementById(
                    'task-file',
                ) as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error('Failed to create task. Please try again.');
                console.error(errors);
                // Clear file input on error as well
                const fileInput = document.getElementById(
                    'task-file',
                ) as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
                setIsSubmitting(false);
            },
        });
    }

    return (
        <Card className="mx-auto w-full max-w-2xl shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <svg
                            className="h-6 w-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-xl">
                            Create New Task
                        </CardTitle>
                        <CardDescription>
                            Add a new task to your list with a clear title and
                            detailed description.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form
                    id="task-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={function ({ field, fieldState }) {
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="task-title"
                                            className="text-sm font-medium"
                                        >
                                            Task Title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="task-title"
                                            placeholder="e.g., Review project proposal, Update website design"
                                            className="text-base"
                                            disabled={isSubmitting}
                                        />
                                        <FieldDescription>
                                            Choose a clear, descriptive title
                                            for your task.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={function ({ field, fieldState }) {
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="task-description"
                                            className="text-sm font-medium"
                                        >
                                            Description
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="task-description"
                                            placeholder="Provide detailed information about this task, including any specific requirements, deadlines, or context that will help you complete it successfully."
                                            rows={5}
                                            className="min-h-24 resize-none text-base"
                                            disabled={isSubmitting}
                                        />
                                        <FieldDescription>
                                            Include steps to complete, expected
                                            outcomes, and any relevant details.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <Controller
                            name="file"
                            control={form.control}
                            render={function ({ field, fieldState }) {
                                return (
                                    <Field
                                        data-invalid={
                                            fieldState.invalid
                                                ? 'true'
                                                : undefined
                                        }
                                    >
                                        <FieldLabel
                                            htmlFor="task-file"
                                            className="text-sm font-medium"
                                        >
                                            Attachment (Optional)
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            value={undefined}
                                            id="task-file"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                const file =
                                                    e.target.files?.[0];
                                                field.onChange(file);
                                            }}
                                            className="file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                                            disabled={isSubmitting}
                                        />
                                        <FieldDescription>
                                            Upload images, documents, or other
                                            files (max 10MB). Supported formats:
                                            JPG, PNG, GIF, PDF, DOC, DOCX, TXT.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    Clear Form
                </Button>
                <Button
                    type="submit"
                    form="task-form"
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Creating Task...
                        </>
                    ) : (
                        <>
                            <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Create Task
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
