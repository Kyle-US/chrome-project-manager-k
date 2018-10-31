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

                storage.get(['tasks'],function(result){

                    $('ul.task-list').empty();

                    if(result.tasks.length){
                        result.tasks.forEach(function(task,ind){

                            var $li = $('<li class="task" data-index="'+ind+'"></li>');
                            var $name = $('<div class="name">'+task.name+'</div>');
                            var deadline = task.deadline === 'unset' ? '' : '<div class="deadline">'+task.deadline+'</div>';
                            var $deadline = $(deadline);
                            var $close_btn = $('<button class="btn-remove">delete</button>');
                            var $task = $li.append($name,$deadline,$close_btn);

                            $('ul.task-list').append($task)
                        });
                        $('ul.task-list .btn-remove').off().on('click',function(){
                            var r = confirm("Delete this task forever?");
                            if(r){
                                var index = parseInt($(this).closest('.task').attr('data-index'));
                                removeTask(index);
                            }
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


        // Submit New Task

            $('.task-form').on('submit',function(e){
                e.preventDefault();

                var $name = $(this).find('input[name=name]');
                var $deadline = $(this).find('input[name=deadline]');
                var $priority = $(this).find('input[name=priority]');

                var name = $name.val();
                var deadline = $deadline.val();
                deadline = deadline ? deadline : 'unset';

                $name.val('');
                $deadline.val('');
                $priority.val('');

                if(
                        name.length
                    &&  deadline.length
                ){
                    $('.task-form').removeClass('active')
                    setTask({
                        name: name,
                        deadline: deadline
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


        // Show New Task Form

            $('.btn-add-task').on('click',function(){
                $('.task-form').addClass('active')
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