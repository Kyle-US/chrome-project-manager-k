(function($){
    $(document).ready(function(){


        // Setup Tasks Storage

            var storage = chrome.storage.sync;

            storage.get(['tasks'],function(result){
                if($.isEmptyObject(result)){
                    storage.set({'tasks':[]},function(){
                        refresh_tasks_list();
                    });
                }else{
                    refresh_tasks_list();
                }
            });


        // Refresh Tasks List

            function refresh_tasks_list(){

                storage.get(['tasks'],function(result){console.log(result)

                    $('ul.task-list,ul.task-list-archive').empty();

                    if(result.tasks.length){

                        // reorder by priority

                        var priorities = [5,4,3,2,1];
                        var ordered_tasks_arr = [];

                        priorities.forEach(function(p){
                            result.tasks.forEach(function(task,ind){
                                if(p == task.priority){
                                    ordered_tasks_arr.push(task);
                                }
                            })
                        });

                        var tasks = ordered_tasks_arr;

                        // update tasks

                        storage.set({'tasks':tasks},function(){

                        // create the task html

                            var $task,
                                $li,
                                $name,
                                $priority,
                                $deadline,
                                $delete_btn,
                                $archive_btn,
                                $colors,
                                $task_details,
                                $restore_btn,
                                i = 0;

                            tasks.forEach(function(task,ind){i++;

                                if(!task.archive){
                                    // Active tasks

                                    $li = $('<li class="task" data-index="'+ind+'"></li>');
                                    $priority = $('<div class="priority priority-'+task.priority+'"></div>');
                                    $name = $('<div class="name">'+task.name+'</div>');
                                    $deadline = task.deadline === 'unset' ? $('') : $('<div class="deadline">Due: '+task.deadline+'</div>');
                                    $delete_btn = $('<button class="btn-remove">&#x2718; delete</button>');
                                    $archive_btn = $('<button class="btn-archive">&#10004; complete</button>');

                                    var c = 5;
                                    $colors = '';
                                    while(c){
                                        $colors += '<label class="color-'+c+'" data-priority="'+c+'"></label>';
                                        c--;
                                    }
                                    $priority_colors = $('<div class="priority-colors">'+$colors+'</div>').clone();

                                    $task_details = $('<div class="details"></div>');
                                    $task_details.append($name,$deadline,$priority_colors,$delete_btn,$archive_btn);

                                    $task = $li.append($priority,$task_details);

                                    $('ul.task-list').append($task)
                                }
                                else{
                                    // Archived tasks

                                    $li = $('<li class="task archived" data-index="'+ind+'"></li>');
                                    $name = $('<div class="name">&#10004; '+task.name+'</div>');
                                    $delete_btn = $('<button class="btn-remove">&#x2718; delete</button>');
                                    $restore_btn = $('<button class="btn-restore">&#x2197; restore</button>');

                                    $task_details = $('<div class="details"></div>');
                                    $task_details.append($name,$delete_btn,$restore_btn);

                                    $task = $li.append($task_details);

                                    $('ul.task-list-archive').append($task)
                                }
                            });

                            $('ul.task-list .priority-colors label').off().on('click',function(){

                            var task_index = $(this).closest('.task').attr('data-index');
                            var priority = $(this).attr('data-priority');
                            updateTask(task_index,'priority',priority);
                        })

                            $('ul.task-list .btn-remove,ul.task-list-archive .btn-remove').off().on('click',function(){
                                var r = confirm("Delete this task forever?");
                                if(r){
                                    var index = parseInt($(this).closest('.task').attr('data-index'));
                                    deleteTask(index);
                                }
                            });

                            $('ul.task-list .btn-archive').off().on('click',function(){
                                var index = parseInt($(this).closest('.task').attr('data-index'));
                                updateTask(index,'archive',true);
                            });

                            $('ul.task-list-archive .btn-restore').off().on('click',function(){
                                var index = parseInt($(this).closest('.task').attr('data-index'));
                                updateTask(index,'archive',false);
                            });
                        });
                    }
                });
            }


        // Set Task

            var setTask = function(new_task){

                storage.get(['tasks'],function(result){
                    result.tasks.push(new_task);
                    storage.set({'tasks':result.tasks},function(){
                        refresh_tasks_list();
                    });
                });
            };


        // update task

            function updateTask(ind,key,val){

                storage.get(['tasks'],function(result){

                    result.tasks[ind][key] = val;

                    storage.set({'tasks':result.tasks},function(){
                        refresh_tasks_list();
                    });
                });
            }


        // Submit New Task

            $('.task-form').on('submit',function(e){
                e.preventDefault();

                var $name = $(this).find('input[name=name]');
                var $deadline = $(this).find('input[name=deadline]');
                var $priority = $(this).find('input[name=priority]:checked');

                var name = $name.val();

                var deadline = $deadline.val();
                deadline = deadline ? deadline : 'unset';

                var priority = $priority.val();

                $name.val('');
                $deadline.val('');

                if(
                        name.length
                    &&  deadline.length
                    &&  priority.length
                ){
                    $(this).removeClass('active');
                    setTask({
                        archive: false,
                        name: name,
                        deadline: deadline,
                        priority: priority
                    });
                }
            });


        // Delete Task

            function deleteTask(index){
                storage.get(['tasks'],function(result){
                    result.tasks.splice(index,1);
                    storage.set({'tasks':result.tasks},function(){
                        refresh_tasks_list();
                    });
                });
            }


        // Show 'New Task' Form

            $('.btn-add-task').on('click',function(){
                $('.task-form').toggleClass('active')
                $('.task-form').find('[name=name]').focus();
            });


        // Clear all tasks

            function clearTaskList(){
                storage.set({'tasks':[]},function(){
                    refresh_tasks_list();
                });
            }
            $('.btn-clear-tasks').on('click',function(){
                var r = confirm("Delete all tasks forever?");
                if(r){
                    clearTaskList()
                }
            })


        // Clear archive list

            function clearArchiveList(){

                storage.get(['tasks'],function(result){

                    var new_tasks = [];

                    result.tasks.forEach(function(task,index){
                        if(!task.archive){
                            new_tasks.push(task)
                        }
                    });

                    storage.set({'tasks':new_tasks},function(){
                        refresh_tasks_list()
                    });
                });
            }

            $('.btn-clear-archive').on('click',function(){
                var r = confirm("Delete all archived tasks?");
                if(r){
                    clearArchiveList()
                }
            })

    })
}(jQuery));