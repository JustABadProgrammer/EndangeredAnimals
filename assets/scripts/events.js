$(document).ready(function () {

    $.ajax({
        url: "/getEvents", // Url of backend (can be python, php, etc..)
        type: "GET", // data type (can be get, post, put, delete)
        success: function (response, textStatus, jqXHR) {
            //console.log(response)

            eventsInfo = JSON.parse(response);

            var div = "";
            eventsInfo.forEach(function (event) {
                console.log(event);

                var divText = '<div class="eventDiv" id=' + event["EventID"] + '>'
                divText += '<h1>' + event["EventName"] + '</h1>';
                divText += '<img src="images/Events/' + event["EventID"] + '.png" class="posterImg">'
                divText += '<h2>' + event["Description"] + '</h2>'
                divText += '<h2>' + event["Location1"] + '</br>' + event["Location2"] + '</h2>'
                divText += '<h2>' + event["Date"] + '</h2>'
                divText += '<div class="loggedIn">'
                divText += '<button type="button" class="imInterested" id="' + event["EventName"] + '">Im Interested!</button>'
                divText += '</div></div></div></br>'
                div += divText;
                console.log(divText)
            })

            $('#pageContent').html(div);

            if(userInfo!=null){
                $('.loggedIn').css('display','block');
                $('.eventDiv').css('height','475px');
            }
        }
    });

});
