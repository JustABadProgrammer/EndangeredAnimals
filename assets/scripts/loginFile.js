//userInfo = null;
$(document).ready(function () {
    popupShowing = true;


console.log(userInfo)
    if (userInfo != null) {
        if (userInfo["LoggedIn"] == true) {
            $("#loginButton").html(userInfo["Username"])
        }
    }
    //Submit button for the log in system
    //From 
    $("#loginButton").click(function () {
        console.log(userInfo)
        if (userInfo == null) {
            $('#blurTag').html('<link rel="stylesheet" href="stylesheets/blur.css"></link>');
            // document.getElementById("backDiv").style.display = "block";
            $('#backDiv').css('display', 'block');
        } else {
            if ($('#loggedInDropdown').is(':visible')) {
                $('#loggedInDropdown').hide();
            } else {
                //$('#loggedInDropdown').show();
                $('#loggedInDropdown').slideDown(500);
            }
            popupShowing = true;
        }

    })

    //Close pop up window
    $("#loginCloseButton").click(function () {
        console.log("Closing")
        closeLoginPopup();
    });

    //This double checks whether a user wants to sign out then proceeds with doing
    //so if they wish
    $('#signOut').click(function () {
        let text = "Are you sure you want to log out?";
        if (confirm(text)) {
            console.log("SigningOut")
            userInfo = null;
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

    $('#newAccount').click(function () {
        $('#loginCloseButton').hide();
        $('#loginSubmitButton').hide();
        $('#title').text("Sign Up")
        $('#newAccount').hide();
        $('#userSignUp').show();
    })


    //Extract sign up information from the popup
    //Send it to the server
    $('#userSignUp').click(function () {

        username = $("#usernameInp").val();
        password = $("#passwordInp").val();
        admin = false;


        dataIn = {
            Username: $("#usernameInp").val(),
            Password: $("#passwordInp").val(),
            Admin: false,
            EventsInterested: [null]
        }

        $.ajax({
            url: "/userSignUp", // Url of backend (can be python, php, etc..)
            type: "POST", // data type (can be get, post, put, delete)
            data: dataIn,
            //This runs if there was data returned
            success: function (response, textStatus, jqXHR) {
                console.log(response)
                //If there is a response then store the information and close the popup
                if (response === ":)") {
                    location.reload();
                } else {
                    $('#InvalidPassword').html("Username taken");
                }
            }
        })
    })


    function closeLoginPopup() {
        $('#blurTag').html('');
        $('#backDiv').css('display', 'none');
    }

    //Sends the popup information to the server
    $('#loginSubmitButton').click(function(){
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
                //If there is a response then store the information and close the popup
                console.log(response)
                if(response===':('){
                    $('#InvalidPassword').html("Incorrect Username/Password");
                }else{
                    location.reload()
                }

            }
        })
    })
    

});