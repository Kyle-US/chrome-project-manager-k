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

                    $('ul.task-list').empty();

                    if(result.tasks.length){var i=0;
                        result.tasks.forEach(function(task,ind){i++;

                            var $li = $('<li class="task" data-index="'+ind+'"></li>');
                            var $priority = $('<div class="priority priority-'+task.priority+'"></div>');
                            var $name = $('<div class="name">'+task.name+'</div>');
                            var $deadline = task.deadline === 'unset' ? $('') : $('<div class="deadline">Due: '+task.deadline+'</div>');
                            var $delete_btn = $('<button class="btn-remove">delete</button>');

                            var $colors;
                            $colors = '<label class="color-1" data-priority="1"></label>';
                            $colors += '<label class="color-2" data-priority="2"></label>';
                            $colors += '<label class="color-3" data-priority="3"></label>';
                            $colors += '<label class="color-4" data-priority="4"></label>';
                            $colors += '<label class="color-5" data-priority="5"></label>';

                            $priority_colors = $('<div class="priority-colors">'+$colors+'</div>').clone();

                            var $task_details = $('<div class="details"></div>');
                            $task_details.append($name,$deadline,$priority_colors,$delete_btn);

                            var $task = $li.append($priority,$task_details);

                            $('ul.task-list').append($task)
                        });
                        $('ul.task-list .btn-remove').off().on('click',function(){
                            var r = confirm("Delete this task forever?");
                            if(r){
                                var index = parseInt($(this).closest('.task').attr('data-index'));
                                removeTask(index);
                            }
                        })
                        $('ul.task-list .priority-colors label').off().on('click',function(){

                            var task_index = $(this).closest('.task').attr('data-index');
                            var priority = $(this).attr('data-priority');
                            update_task(task_index,'priority',priority);
                        })
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


        // update

            function update_task(ind,key,val){

                storage.get(['tasks'],function(result){

                    result.tasks[ind][key] = val;

                    console.log(result);

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
                $priority.val('');
                console.log(priority)
                if(
                        name.length
                    &&  deadline.length
                    &&  priority.length
                ){
                    $(this).removeClass('active');
                    setTask({
                        name: name,
                        deadline: deadline,
                        priority: priority
                    });
                }
            });


        // Remove Task

            function removeTask(index){
                storage.get(['tasks'],function(result){
                    result.tasks.splice(index,1);
                    storage.set({'tasks':result.tasks},function(){
                        refresh_tasks_list();
                    });
                });
            }


        // Show 'New Task' Form

            $('.btn-add-task').on('click',function(){
                $('.task-form').addClass('active')
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


    })
}(jQuery));