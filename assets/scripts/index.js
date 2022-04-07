$(document).ready(function () {

    userInfo = null;

    //Check to see if the user is logged in
    $.ajax({
        url: "/getLoginInfo", // Url of backend (can be python, php, etc..)
        type: "GET", // data type (can be get, post, put, delete)
        success: function (response, textStatus, jqXHR) {
            
            //If they are logged in then save their information
            if(JSON.parse(response)["Username"] != null){
                userInfo = JSON.parse(response)
                console.log(userInfo["Username"])
                $("#loginButton").html(userInfo["Username"])
            }
        }
    });

    //Simple click button to login
    //Shows login window and blurs everything else on screen
    $("#loginButton").click(function(){
        $('#blurTag').html('<link rel="stylesheet" href="stylesheets/blur.css"></link>');
        document.getElementById("backDiv").style.display = "block";
        
    })

    //Submit button for the log in system
    $("#loginSubmitButton").click(function(){
        console.log("Loggin Submit")

        dataIn = {
            "Username":  $("#emailInp").val(),
            "Password": $("#passwordInp").val()
        }

        console.log(dataIn)

        //Send request to server to see if the user exists/has correct password
        $.ajax({
            url: "/loginAuth", // Url of backend (can be python, php, etc..)
            type: "POST", // data type (can be get, post, put, delete)
            data: dataIn,
            //This runs if there was data returned
            success: function (response, textStatus, jqXHR) {
                console.log(response)
                //If there is a response then store the information and close the popup
                if(response!=""){
                    if(JSON.parse(response)["Username"] != null){
                        userInfo = JSON.parse(response)
                        console.log(userInfo["Username"])
                        $("#loginButton").html(userInfo["Username"])
                        document.getElementById("myForm").style.display = "none";
                        closeLoginPopup();
                    }
                }else{
                    console.log("Didnt work")
                }
            }
        })
        
    })

    //Close pop up window
    $("#loginCloseButton").click(function(){
        console.log("Closing")
        closeLoginPopup();
    });

    function closeLoginPopup(){
        $('#blurTag').html('');
        document.getElementById("backDiv").style.display = "none";
    }

});