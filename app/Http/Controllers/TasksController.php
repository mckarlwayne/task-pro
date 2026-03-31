<?php

namespace App\Http\Controllers;

use App\Models\Tasks;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    //Create a method for index to display the MyTaskPage page with inertia
    public function index(){
        return inertia('MyTaskPage', [
            'framework' => 'Laravel 13 + React',
            'tasks' => Tasks::all(),
        ]);
    }
    //Create a method for storing a new task in the database
    public function store(Request $request){
        //Validate the request
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,image/jpeg,image/png,image/jpg,image/gif|max:10240', // 10MB max
        ]);

        $filePath = null;
        $fileName = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileType = $file->getMimeType();
            $filePath = $file->store('task-files', 'public');
        }

        //Create the task
        Tasks::create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_type' => $fileType,
        ]);

        //Redirect back with success message
        return redirect()->back()->with('success', 'Task created successfully!');
    }

    //Create a method for updating a task in the database
    public function update(Request $request, Tasks $task){
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'completed' => 'sometimes|boolean',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt|max:10240',
        ]);

        $updateData = $request->only(['title', 'description', 'completed']);

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($task->file_path) {
                \Storage::disk('public')->delete($task->file_path);
            }

            $file = $request->file('file');
            $updateData['file_name'] = $file->getClientOriginalName();
            $updateData['file_type'] = $file->getMimeType();
            $updateData['file_path'] = $file->store('task-files', 'public');
        }

        $task->update($updateData);

        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    //Create a method for deleting a task from the database
    public function destroy(Tasks $task){
        $task->delete();
        return redirect()->back()->with('success', 'Task deleted successfully!');

    }
}
