eventID = []

$(document).ready(function () {

    $.ajax({
        url: "/getEvents", // Url of backend (can be python, php, etc..)
        type: "GET", // data type (can be get, post, put, delete)
        success: function (response, textStatus, jqXHR) {
            //console.log(response)

            eventsInfo = JSON.parse(response);

            var div = "";
            i = 0;
            eventsInfo.forEach(function (event) {
                var divText = '<div class="eventDiv" id=' + event["EventID"] + '>'
                divText += '<h1>' + event["EventName"] + '</h1>';
                divText += '<img src="images/Events/' + event["EventID"] + '.png" class="posterImg">'
                divText += '<h2>' + event["Description"] + '</h2>'
                divText += '<h2>' + event["Location1"] + '</br>' + event["Location2"] + '</h2>'
                divText += '<h2>' + event["Date"] + '</h2>'
                divText += '<div class="loggedIn">'
                divText += '<button type="button" class="imInterested" id="' + event["EventID"] + '_btn" onclick="eventButton('+i+')">Add to interested list</button>'
                divText += '</div></div></br>'
                div += divText;
                eventID.push(event["EventID"]);
                i++;

            })

            $('#pageContent').html(div);

            if(userInfo!=null){
                $('.loggedIn').css('display','block');
                $('.eventDiv').css('height','550px');

                userInfo["EventsInterested"].forEach(function(e){
                    console.log(e)
                    $('#'+e+'_btn').text("Remove from interested list")
                    $('#'+e+'_btn').css('backgroundColor', '#4d4a52')
                    $('#'+e+'_btn').css('color', 'white')
                })
            }
        }
    });

    /*
    $('.imInterested').click(function(){
        console.log(this.id)
    })*/
    

});

//This fires whenever an interest button is pressed
function eventButton(eventName){
    console.log(eventID[eventName])
    //If the action is to remove then the given event is removed from the array
    //Otherwise it is added
    num = 1;
    console.log(userInfo["EventsInterested"])
    if($('#'+eventID[eventName]+'_btn').text().includes("Remove")){
        userInfo["EventsInterested"].splice(userInfo["EventsInterested"].indexOf(eventID[eventName]),1);
       
        num = -1;
    }else{
        userInfo["EventsInterested"].push(eventID[eventName]);
    }
    console.log(userInfo["EventsInterested"])

    dataSend = {
        Username : userInfo["Username"],
        EventsInterested : userInfo["EventsInterested"]
    }

    //This is then sent to the database to be updated
    $.ajax({
        url: "/updateInterestedEvents", // Url of backend (can be python, php, etc..)
        type: "POST", // data type (can be get, post, put, delete)
        data : dataSend,
        //Update the button so it is the opposite
        success: function (response, textStatus, jqXHR) {

            console.log(response)

            btn = document.getElementById(eventID[eventName]+'_btn');

            if($('#'+eventID[eventName]+'_btn').text().includes("Remove")){
                btn.style.backgroundColor = "#adaab2";
                btn.style.color = "black";
                btn.innerHTML = "Add to isnterested list";
            }else{
                btn.style.backgroundColor = "#4d4a52";
                btn.style.color = "white";
                btn.innerHTML = "Remove from interested list";
            }
        
            dataSend = {EventID : eventID[eventName], number : num}
            $.ajax({
                url: "/incrementEvent", // Url of backend (can be python, php, etc..)
                type: "POST", // data type (can be get, post, put, delete)
                data : dataSend
                //Update the button so it is the opposite
            });
        }
    });
}