import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import * as React from 'react';
import {
    Edit,
    Trash2,
    CheckCircle,
    Circle,
    Calendar,
    FileIcon,
} from 'lucide-react';

('use client');

export function AllTasks({ tasks }: { tasks: any[] }) {
    const [editingId, setEditingId] = React.useState(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [editDescription, setEditDescription] = React.useState('');
    const [editFile, setEditFile] = React.useState<File | null>(null);

    const startEdit = (task: any) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditFile(null);
    };

    const saveEdit = (taskId: number) => {
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        if (editFile) {
            formData.append('file', editFile);
        }
        formData.append('_method', 'PATCH');

        router.post(`/tasks/${taskId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setEditingId(null);
        setEditFile(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleDelete = (taskId: number) => {
        router.delete(`/tasks/${taskId}`);
    };

    if (tasks.length === 0) {
        return (
            <div className="py-12 text-center">
                <Circle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                    No tasks found
                </h3>
                <p className="text-sm text-muted-foreground">
                    Create your first task to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <Card
                    key={task.id}
                    className="group transition-shadow hover:shadow-md"
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            {editingId === task.id ? (
                                <Input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    placeholder="Task Title"
                                    className="text-lg font-semibold"
                                />
                            ) : (
                                <CardTitle className="pr-2 text-lg leading-tight">
                                    {task.title}
                                </CardTitle>
                            )}
                            <Badge
                                variant={
                                    task.completed ? 'default' : 'secondary'
                                }
                                className="shrink-0"
                            >
                                {task.completed ? (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                    <Circle className="mr-1 h-3 w-3" />
                                )}
                                {task.completed ? 'Completed' : 'Pending'}
                            </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Task #{task.id}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                        {editingId === task.id ? (
                            <div className="space-y-3">
                                <Textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    placeholder="Task Description"
                                    rows={3}
                                    className="resize-none"
                                />
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`edit-file-${task.id}`}
                                        className="text-sm font-medium"
                                    >
                                        Update Attachment (optional)
                                    </Label>
                                    <Input
                                        id={`edit-file-${task.id}`}
                                        type="file"
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                        onChange={(e) =>
                                            setEditFile(
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="cursor-pointer"
                                    />
                                    {task.file_path && (
                                        <p className="text-xs text-muted-foreground">
                                            Current: {task.file_name} - Upload a
                                            new file to replace it
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {task.description}
                            </p>
                        )}
                        {task.file_path && (
                            <div className="mt-3 rounded-lg bg-muted/50 p-3">
                                <div className="flex items-center gap-2">
                                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        Attachment:
                                    </span>
                                    <a
                                        href={`/storage/${task.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-sm text-primary hover:underline"
                                    >
                                        {task.file_name}
                                    </a>
                                </div>
                                {task.file_type?.startsWith('image/') && (
                                    <div className="mt-2">
                                        <img
                                            src={`/storage/${task.file_path}`}
                                            alt={task.file_name}
                                            className="h-32 max-w-full rounded-md object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-4 flex items-center space-x-2">
                            <Checkbox
                                id={`completed-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={(checked) => {
                                    router.patch(`/tasks/${task.id}`, {
                                        completed: checked,
                                    });
                                }}
                            />
                            <label
                                htmlFor={`completed-${task.id}`}
                                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mark as{' '}
                                {task.completed ? 'incomplete' : 'complete'}
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        {editingId === task.id ? (
                            <div className="flex w-full space-x-2">
                                <Button
                                    onClick={() => saveEdit(task.id)}
                                    size="sm"
                                    className="flex-1"
                                >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={cancelEdit}
                                    size="sm"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex w-full space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => startEdit(task)}
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Edit className="mr-1 h-4 w-4" />
                                    Edit
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Task
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                "{task.title}"? This action
                                                cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
