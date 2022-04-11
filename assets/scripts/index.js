$(document).ready(function () {

    $('#UploadPostButton').click(function () {
        $('#newPostDiv').show();
    })

    $('#cancelPost').click(function(){
        $('#newPostDiv').hide();
        $('.inp').val("")
    })

});