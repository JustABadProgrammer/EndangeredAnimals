$(document).ready(function () {

    userInfo = null;

    $.ajax({
        url: "/getLoginInfo", // Url of backend (can be python, php, etc..)
        type: "GET", // data type (can be get, post, put, delete)
        success: function (response, textStatus, jqXHR) {
            
            if(JSON.parse(response)["Username"] != null){
                userInfo = JSON.parse(response)
                console.log(userInfo["Username"])
                $("#loginButton").html(userInfo["Username"])
            }
        }
    });

    console.log($("#loginButton"))

        
    

});