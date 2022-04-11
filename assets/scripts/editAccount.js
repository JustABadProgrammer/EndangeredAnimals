$(document).ready(function(){

    $('#editUsername').click(function(){
        console.log($('#editUsername').text());
        console.log($('#editUsername').text() ==="Save")

        //If the button doesnt say Save then unlock the ability to change username
        if($('#editUsername').text() ==="Save"==false){
            $("#usernameTxt").prop('disabled', false);
            $('#usernameCancel').show();
            $('#editUsername').text("Save")
        }else{
            
            //This just checks whether it is actually a new username
            newUsername = $("#usernameTxt").val();
            console.log(newUsername);
            console.log(userInfo["Username"])
            if(newUsername === userInfo["Username"]){
                cancelUsername();
            }else{

                //Simple ajax call and reloading of page
                dataTrans = {
                    Username : userInfo["Username"],
                    NewUsername : newUsername
                }

                $.ajax({
                    url: "/updateUserName", // Url of backend (can be python, php, etc..)
                    type: "POST", // data type (can be get, post, put, delete)
                    data : dataTrans,
                    success: function (response, textStatus, jqXHR) {
                        console.log(response)
                        location.reload();            
                    }
                })
            }


        }
    })

    //Disable textboxes and reset buttons 
    function cancelUsername(){
        $("#usernameTxt").prop('disabled', true);
        $('#usernameCancel').hide();
        $('#editUsername').text("Edit Username")
    }

    function cancelPassword(){
        $("#currPass").prop('disabled', true);
        $("#newPass").prop('disabled', true);
        $("#confNewPass").prop('disabled', true);
        $('#passwordCancel').hide();
        $('#editPassword').text("Edit Password")

        
        $("#currPass").val("");
        $("#newPass").val("");
        $('#confNewPass').val("")
    }

    //Cancel buttons
    $('#usernameCancel').click(function(){
        console.log("Click")
        cancelUsername();
    })

    $('#passwordCancel').click(function(){
        cancelPassword();
    })
        
    
    $('#editPassword').click(function(){

        console.log($('#editPassword').text())
        if($('#editPassword').text() ==="Save"){

            curPass = $("#currPass").val();
            newPass = $("#newPass").val();
            confPass = $('#confNewPass').val()

            //This checks whether the passwords actually match and if they do sends the new password off to the server
            if(newPass===confPass){
                console.log("Same Bois")
                if(newPass===curPass){}else{

                    dataTrans = {
                        Username : userInfo["Username"],
                        Password : curPass,
                        NewPassword : newPass
                    }

                    console.log(dataTrans)
                    
                    $.ajax({
                        url: "/updateUserPassword", // Url of backend (can be python, php, etc..)
                        type: "POST", // data type (can be get, post, put, delete)
                        data : dataTrans,
                        success: function (response, textStatus, jqXHR) {
                            console.log(response)
                            if(response.includes("Incorrect")){
                                $('#incLabel').html("Incorrect Password")                                
                            }else{
                                $('#incLabel').html("Password Changed Successfully")      
                                $("#incLabel").show().delay( 5000 ).hide(0);
                                cancelPassword();
                            }
                        }
                    })


                }
            }else{
                $('#incLabel').html("Passwords do not match")
            }
        
        }else{
            //Reset thingies
            $("#currPass").prop('disabled', false);
            $("#newPass").prop('disabled', false);
            $("#confNewPass").prop('disabled', false);

            $('#passwordCancel').show();
            $('#editPassword').text("Save")
        }
    });

    //Triggers a prompt where, if the user puts the correct password ajax calls the server to delete the user
    $("#deleteAccount").click(function(){
        let pass = prompt("Are you sure you want to delete your account?\nEnter your password to continue:", "");
        if (pass == null || pass == "") {
            text = "User cancelled the prompt.";
        } else {

            dataTrans = {
                Username : userInfo["Username"],
                Password : pass
            }

            $.ajax({
                url: "/deleteUser", // Url of backend (can be python, php, etc..)
                type: "POST", // data type (can be get, post, put, delete)
                data : dataTrans,
                success: function (response, textStatus, jqXHR) {

                    div = "<h1>Goodbye " + userInfo["Username"] + "</h1>";
                    div+= "<h2>Your account has now been deleted";

                    $("#pageContent").html(div)
                    
                    console.log("Bye")
                }}
            );
        }
        })

    
})