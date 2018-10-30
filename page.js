(function($){
    $(document).ready(function(){

        var storage = chrome.storage.sync;


        // Refresh Tasks List

            function refresh_tasks_list(){

                storage.get(['tasks'],function(result){

                    $('ul.task-list').empty();

                    if(result.tasks.length){
                        result.tasks.forEach(function(task,ind){
                            var li = '<li class="item" data-index="'+ind+'"><span>'+task.name+'</span><button class="btn-remove">X</button></li>';
                            $('ul.task-list').append($(li))
                        });
                        $('ul.task-list .btn-remove').off().on('click',function(){
                            var index = parseInt($(this).closest('.item').attr('data-index'));
                            removeTask(index);
                        })
                    }
                });
            }
            refresh_tasks_list();


        // Set Task

            var setTask = function(new_task){

                storage.get(['tasks'],function(result){
                    result.tasks.push(new_task);
                    storage.set({'tasks':result.tasks},function(){
                        refresh_tasks_list();
                    });
                });
            };


        // New Task Input

            $('.task-form').on('submit',function(e){e.preventDefault();

                var name = $(this).find('input[name=name]').val();
                var deadline = $(this).find('input[name=deadline]').val();

                if(
                        name.length
                    &&  deadline.length
                ){
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


        // Clear all tasks

            function clearTaskList(){
                storage.set({'tasks':[]},function(){
                    refresh_tasks_list();
                });
            }
            $('.btn-clear-tasks').on('click',function(){
                clearTaskList()
            })


    })
}(jQuery));

