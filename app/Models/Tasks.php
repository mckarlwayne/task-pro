<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable; 

#[Fillable(['title', 'description', 'completed'])]

class Tasks extends Model
{
    //
}
