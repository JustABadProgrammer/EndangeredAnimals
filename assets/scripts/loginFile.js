userInfo = null;

$(document).ready(function () {

    getPage()

    //Check to see if the user is logged in when the page loads
    $.ajax({
        url: "/getLoginInfo", // Url of backend (can be python, php, etc..)
        type: "POST", // data type (can be get, post, put, delete)
        success: function (response, textStatus, jqXHR) {
            
            //If they are logged in then save their information
            if(JSON.parse(response)["Username"] != null){
                userInfo = JSON.parse(response)
                console.log(userInfo["Username"])
                $("#loginButton").html(userInfo["Username"])
            }else{
                userInfo=null;
            }
        }
    });

    //Submit button for the log in system
    //From 
    $("#loginSubmitButton").click(function(){
        //Send request to server to see if the user exists/has correct password
       loginAttempt(getPage());
    })

    $("#loginButton").click(function(){
        $('#blurTag').html('<link rel="stylesheet" href="stylesheets/blur.css"></link>');
       // document.getElementById("backDiv").style.display = "block";
        $('#backDiv').css('display', 'block');
    })

    //Close pop up window
    $("#loginCloseButton").click(function(){
        console.log("Closing")
        closeLoginPopup();
    });

    function closeLoginPopup(){
        $('#blurTag').html('');
        $('#backDiv').css('display', 'none');
    }

    function getPage(){
        console.log($(location). attr("href"));

        if($(location). attr("href").includes("Game")){
            return 1
        }else if($(location). attr("href").includes("Events")){
            return 2
        }else{
            return 0
        }
    }

    //Page id is as follows
    //Home - 0
    //Game - 1
    //Events - 2    
    function loginAttempt(pageID){

        console.log(pageID)

        dataIn = {
            "Username":  $("#emailInp").val(),
            "Password": $("#passwordInp").val()
        }

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
                        document.getElementById("myForm").style.display = "none";
                        $('#blurTag').html('');
                        $("#loginButton").html(userInfo["Username"])
                        document.getElementById("backDiv").style.display = "none";
                        $('#InvalidPassword').html("");
                    }

                    if(pageID==2){
                        console.log("Events Page")
                        $('.loggedIn').css('display','block');
                        $('.eventDiv').css('height','475px');
                    }
                }else{
                    $('#InvalidPassword').html("Incorrect Username/Password");
                }
            }
        })
    }

});