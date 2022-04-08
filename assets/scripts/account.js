$(document).ready(function () {

    console.log(userInfo)
    if(userInfo==null){
        $('#Username').html('<h1>You need to log in to view this page</h1>')
        $('#interestedEventsWrapper').hide()
    }else if(userInfo["Admin"]){
        $('#Username').html('<h1>Hello ' + userInfo["Username"] +'! - Admin Page</h1>')
    }else{
        $('#Username').html('<h1>Hello ' + userInfo["Username"] +'! </h1>')
        setupEvents()
    }
    
    divCodeMap = []
    eventID = []


    function setupEvents() {
        //$('#loggedInDropdown').hide();
        // var div = "Hello " + userInfo["Username"];

        // $('#pageContent').html(div);

        $.ajax({
            url: "/getEvents", // Url of backend (can be python, php, etc..)
            type: "GET", // data type (can be get, post, put, delete)
            success: function (response, textStatus, jqXHR) {

                eventsInfo = JSON.parse(response);

                console.log(eventsInfo)
                var div = "";
                i = 0;
                eventsInfo.forEach(function (event) {
                    console.log(event["EventID"])
                    console.log(userInfo["EventsInterested"])
                    if (userInfo["EventsInterested"].includes(event["EventID"])) {
                        divText = formatDivText(event, i);
                        div += divText;
                        console.log(event["EventID"])
                        divCodeMap.push({ id: event["EventID"], code: divText })
                        eventID.push(event["EventID"])
                        i++;
                    }
                })

                console.log(userInfo["EventsInterested"].length)
                if(userInfo["EventsInterested"].length == 1 ){
                    console.log("Yeet")
                    div += '<div class="eventDiv"><h1> </h1></div>'
                }
                


                $('#interestedEvents').html(div);

            }
        });
    }

    function formatDivText(event, count) {
        var divText = '<div class="eventDiv" id=' + event["EventID"] + '>'
        divText += '<h1>' + event["EventName"] + '</h1>';
        divText += '<img src="images/Events/' + event["EventID"] + '.png" class="posterImg">'
        divText += '<h2>' + event["Description"] + '</h2>'
        divText += '<h2>' + event["Location1"] + '</br>' + event["Location2"] + '</h2>'
        divText += '<h2>' + event["Date"] + '</h2>'
        divText += '</div>'
        return divText;
    }


    

});
