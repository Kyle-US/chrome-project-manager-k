(function($){
    $(document).ready(function(){

        var storage = chrome.storage.sync;


        // Refresh Tasks List

            function refresh_tasks_list(){

                storage.get(['tasks'],function(result){

                    $('ul.task-list').empty();

                    if(result.tasks.length){
                        result.tasks.forEach(function(task,ind){
                            $('ul.task-list').append('<li>'+task.name+'</li>')
                        });
                    }
                });
            }
            refresh_tasks_list();



        // Set Task

            var setTask = function(new_task){

                storage.get(['tasks'],function(result){

                    var count = result.tasks.length;
                    result.tasks[count] = new_task;

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
                        task: name,
                        deadline: deadline
                    });
                }
            });


        // Clear Tasks

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

