interface MyTaskPageProps {
    framework: string;
}

export default function MyTaskPage({ framework }: MyTaskPageProps) {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Welcome to {framework}</h1>
            <p>This is a clean slate. No Auth. No clutter.</p>
        </div>
    );
}
