$(document).ready(function () {

    console.log(userInfo)
    if (userInfo == null) {
        $('#Username').html('<h1>You need to log in to view this page</h1>')
        $('#interestedEventsWrapper').hide()
    } else if (userInfo["Admin"]) {
        $('#Username').html('<h1>Hello ' + userInfo["Username"] + '! - Admin</h1>')
        setupEvents()
        //setupAdmin()
    } else {
        $('#Username').html('<h1>Hello ' + userInfo["Username"] + '! </h1>')
        setupEvents()
    }

    divCodeMap = []
    eventID = []

    function setupEvents() {
        
        $.ajax({
            url: "/getEvents", // Url of backend (can be python, php, etc..)
            type: "GET", // data type (can be get, post, put, delete)
            success: function (response, textStatus, jqXHR) {

                eventsInfo = JSON.parse(response);

                console.log(eventsInfo)
                var div = "";
                i = 0;
                //Loop for every event

                eventsInfo.forEach(function (event) {
                    //Id the user has proclaimed interest then genreate the code for it
                    console.log("Event")
                    console.log(event)
                    console.log("Cleared")
                    if (userInfo["EventsInterested"].includes(event["EventID"])) {
                        divText = formatDivText(event, i);
                        div += divText;
                        console.log(event["EventID"])
                        divCodeMap.push({ id: event["EventID"], code: divText })
                        eventID.push(event["EventID"])
                        i++;
                    }

                })

                if(userInfo["EventsInterested"].length == 0){
                    $('#eventTitle').html("You haven't showed any interest in any events :(</br>Head over to the events tab to view our many events")
                }



                $('#interestedEvents').html(div);

            }
        });
    }

    function formatDivText(event, count) {
        var divText = '<div class="eventDiv" id=' + event["EventID"] + '>'
        divText += '<h1>' + event["EventName"] + '</h1>';
        divText +=  '<h2 class="admin">People Interested - '+event["TotalInterested"]+'</h2>'
        divText += '<img src="images/Events/' + event["EventID"] + '.png" class="posterImg">'
        divText += '<h2>' + event["Description"] + '</h2>'
        divText += '<h2>' + event["Location1"] + '</br>' + event["Location2"] + '</h2>'
        divText += '<h2>' + event["Date"] + '</h2>'
        divText += '</div>'
        return divText;
    }




});
