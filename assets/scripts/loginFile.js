userInfo = null;

$(document).ready(function () {
    popupShowing = true;

    
    //Check to see if the user is logged in when the page loads
    $.ajax({
        url: "/getLoginInfo", // Url of backend (can be python, php, etc..)
        type: "POST", // data type (can be get, post, put, delete),
        async : false,
        success: function (response, textStatus, jqXHR) {

            //If they are logged in then save their information
            if (JSON.parse(response)["Username"] != null) {
                userInfo = JSON.parse(response)
                console.log(userInfo["EventsInterested"])
                //location.reload();
              //  updatePage(getPage());
                
            } else {
                userInfo = null;
            }
            console.log(userInfo)
        }
    });

    if(userInfo!=null){
        $("#loginButton").html(userInfo["Username"])
    }
    //Submit button for the log in system
    //From 
    $("#loginSubmitButton").click(function () {
        //Send request to server to see if the user exists/has correct password
            loginAttempt(getPage());
    })

    $("#loginButton").click(function () {
        if(userInfo==null){
            $('#blurTag').html('<link rel="stylesheet" href="stylesheets/blur.css"></link>');
            // document.getElementById("backDiv").style.display = "block";
            $('#backDiv').css('display', 'block');
        }else{
            if($('#loggedInDropdown').is(':visible')){
                $('#loggedInDropdown').hide();
            }else{
                $('#loggedInDropdown').show();
            }
            popupShowing=true;
        }
           

            /*
            console.log("else")
            $.ajax({
                url: "/account", // Url of backend (can be python, php, etc..)
                type: "GET",
                success: function (response, textStatus, jqXHR) {
                    window.location.href = "finalPage.php";
                }
            });*/
    })

    //Close pop up window
    $("#loginCloseButton").click(function () {
        console.log("Closing")
        closeLoginPopup();
    });

    //This double checks whether a user wants to sign out then proceeds with doing
    //so if they wish
    $('#signOut').click(function(){
        let text = "Are you sure you want to log out?";
        if (confirm(text)) {
            console.log("SigningOut")
            userInfo=null;
            //Send to the server to remove information about the user
            $.ajax({
                url: "/signOut", // Url of backend (can be python, php, etc..)
                type: "POST",
                success: function (response, textStatus, jqXHR) {
                    console.log(response)
                    location.reload();
                }
            })
        }
    })

    $('#newAccount').click(function(){
        $('#loginCloseButton').hide();
        $('#loginSubmitButton').hide();
        $('#title').text("Sign Up")
        $('#newAccount').hide();
        $('#signUp').show();
    })

    $('#signUp').click(function(){
        
    })


    function closeLoginPopup() {
        $('#blurTag').html('');
        $('#backDiv').css('display', 'none');
    }

    //Returns an indexed number depending on which page we are on
    function getPage() {
        if ($(location).attr("href").includes("Game")) {
            return 1
        } else if ($(location).attr("href").includes("Events")) {
            return 2
        } else if($(location).attr("href").includes("account")){
            return 3
        }else{
            return 0
        }
    }

    function loginAttempt(pageID) {

        console.log(pageID)

        dataIn = {
            "Username": $("#usernameInp").val(),
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
                if (response != "") {
                    location.reload();
                } else {
                    $('#InvalidPassword').html("Incorrect Username/Password");
                }
            }
        })
    }

    /*
    $(document).click(function () {
        console.log("Elsewhere Click")
        if (popupShowing) {
            $('#loggedInDropdown').hide();
            popupShowing=false;
        }
    });*/

});