import { useState } from 'react';
import { BugReportForm } from './layouts/Form';
import { AllTasks } from './layouts/AllTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    Plus,
    CheckCircle,
    Circle,
    Moon,
    Sun,
    Monitor,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

interface MyTaskPageProps {
    framework: string;
    tasks: any[];
}

export default function MyTaskPage({ framework, tasks }: MyTaskPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>(
        'all',
    );
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all' ||
            (filter === 'completed' && task.completed) ||
            (filter === 'pending' && !task.completed);
        return matchesSearch && matchesFilter;
    });

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Task Manager
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Built with {framework} • {completedCount} of{' '}
                                {totalCount} tasks completed
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="px-3 py-1">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {Math.round(
                                    (completedCount / totalCount) * 100,
                                ) || 0}
                                % Complete
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        suppressHydrationWarning
                                    >
                                        {resolvedAppearance === 'dark' ? (
                                            <Moon className="h-4 w-4" />
                                        ) : resolvedAppearance === 'light' ? (
                                            <Sun className="h-4 w-4" />
                                        ) : (
                                            <Monitor className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            Toggle theme
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            updateAppearance('light')
                                        }
                                    >
                                        <Sun className="mr-2 h-4 w-4" />
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateAppearance('dark')}
                                    >
                                        <Moon className="mr-2 h-4 w-4" />
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            updateAppearance('system')
                                        }
                                    >
                                        <Monitor className="mr-2 h-4 w-4" />
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={
                                    filter === 'all' ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                All ({totalCount})
                            </Button>
                            <Button
                                variant={
                                    filter === 'pending' ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setFilter('pending')}
                            >
                                <Circle className="mr-1 h-4 w-4" />
                                Pending ({totalCount - completedCount})
                            </Button>
                            <Button
                                variant={
                                    filter === 'completed'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setFilter('completed')}
                            >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Completed ({completedCount})
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Create Task Section */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">
                            Create New Task
                        </h2>
                    </div>
                    <div className="max-w-2xl">
                        <BugReportForm />
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Tasks Section */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Your Tasks ({filteredTasks.length})
                        </h2>
                    </div>
                    <AllTasks tasks={filteredTasks} />
                </div>
            </div>
        </div>
    );
}
