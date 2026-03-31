<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable; 

#[Fillable(['title', 'description', 'completed', 'file_path', 'file_name', 'file_type'])]

class Tasks extends Model
{
    //
}
