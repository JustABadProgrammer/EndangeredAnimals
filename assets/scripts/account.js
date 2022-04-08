$(document).ready(function () {

    setup()

    function setup(){
        $('#loggedInDropdown').hide();
        var div = "Hello " + userInfo["Username"];

        $('#pageContent').html(div);
    }

});