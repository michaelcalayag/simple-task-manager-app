<?php

namespace App\Console\Commands;

use App\Models\Tasks;
use Carbon\Carbon;
use Illuminate\Console\Command;

class PurgeSoftDeletedTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:purge-soft-deleted-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove task after 30 days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $thresholdDate = Carbon::now()->subDays(30);

        $deletedTasks = Tasks::onlyTrashed()
            ->where('deleted_at', '<=', $thresholdDate)
            ->forceDelete();

        $this->info('Forced delete old soft-deleted tasks.');
    }
}
