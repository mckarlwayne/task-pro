<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TasksController extends Controller
{
    //Create a method for index to display the MyTaskPage page with inertia
    public function index(){
        return inertia('MyTaskPage', [
    'framework' => 'Laravel 13 + React'
]);
    }
}
