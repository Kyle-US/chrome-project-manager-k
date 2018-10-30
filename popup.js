document.addEventListener("DOMContentLoaded",function(event){

    // var $myEl = document.getElementById('checkPage');
    //
    // $myEl.addEventListener('click',function(){
    //     chrome.tabs.create({url: 'popup.html'});
    // }, false);


    chrome.browserAction.onClicked.addListener(function(activeTab)
    {
        var newURL = "popup.html";
        chrome.tabs.create({ url: newURL });
    });
});

