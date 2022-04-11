$(document).ready(function () {

    // $('#mainDiv').css('background-image', 'url("images/Events/Axolotl.png")')
    //getEventInfo();

    gameOrder = [];
    curScore = 0;


    fullArray = [];
    left = null;
    right = null;
    extra = null;

    trulyFinished = true;

    imgPos = [-500, 0, 500]
    done = [false, false, false]
    leftmost = 1;
    //console.log(parsed_data)

    score = passedScore.split(",")
    user = passedUser.split(",");

    getEventInfo();

    function moveSliders() {
        for (i = 0; i < 3; i++) {
            slider(i);
        }
    }

    //This does animation stuff
    function slider(i) {
        done[i] = false;
        $('#img' + i).animate({ left: imgPos[i] + 'px' }, 1500, function () {
            //If it is -500 then it is the last rounds. So it can be moved along to be the next image
            //And updated to the next image
            if (imgPos[i] === -500) {
                console.log("i-" + i + ", imgPos-"+imgPos[i])
                $('#img' + i).css('left', '1000px')
                console.log(extra["Img"])
                //Update the div with new image, name and ratign
                $('#img' + i).css('background-image', 'url("images/Events/' + extra["Img"] + '.png")');
                $('#name' + i).html(extra["Name"])
                $('#number' + i).html(extra["Rating"])
                $('#number' + i).hide();

                imgPos[i] = 500
            } else if (imgPos[i] === 0) {
                imgPos[i] = -500;
                $('#number' + i).html(left["Rating"])
            } else {
                imgPos[i] = 0;
                leftmost = i;
            }
            done[i] = true;

            //when everything is done sliding show the VS symbol again
            if (done.includes(false) == false) {
                $('#vs').fadeIn(1000, function () {
                    trulyFinished = true;
                });
            }
        });
    }

    //Use backend api to get all the animals
    function getEventInfo() {

        $.ajax({
            url: "/getAnimalStats", // Url of backend (can be python, php, etc..)
            type: "GET", // data type (can be get, post, put, delete)
            //Update the button so it is the opposite
            success: function (response, textStatus, jqXHR) {
                console.log(fullArray)
                fullArray = JSON.parse(response)
                console.log(fullArray)
            }
        });
    }

    //Check whether the answer is correct and proceed to the Result() method
    $('#higher').click(function () {
        console.log(trulyFinished)
        if (trulyFinished == true) {
            if (right["Rating"] >= left["Rating"]) {
                result(true);
            } else {
                console.log("Your Poop")
                result(false)
            }
        } else {
            console.log("no no no")
        }
    })

    //Same as above
    $('#lower').click(function () {
        console.log(trulyFinished)
        if (trulyFinished == true) {
            console.log(right["Rating"] + "  -  " + left["Rating"])
            if (right["Rating"] <= left["Rating"]) {
                result(true);
            } else {
                result(false)
                console.log("Your Poop")
            }
        } else {
            console.log("no no no")
        }
    })

    function setupGame() {

        len = fullArray.length;

        temp = []
        gameOrder = [];

        //Loop for every animal, pick a random one left, put it in the gameOrder and remove from the full array
        for (i = 0; i < len; i++) {
            random = Math.floor(Math.random() * fullArray.length);

            gameOrder.push(fullArray[random]);
            temp.push(fullArray[random]);
            fullArray.splice(random, 1)
        }

        //Reinstate the full array to be everything
        fullArray = temp;

        //Set the current-left, next-right and hidden-extra rounds 
        left = gameOrder[0];
        right = gameOrder[1];
        extra = gameOrder[2];
        gameOrder.splice(0, 3)

        //Initiate game divs with the information
        $('#img0').css('background-image', 'url("images/Events/' + left["Img"] + '.png")');
        $('#name0').html(left["Name"])
        $('#number0').html(left["Rating"])
        $('#source0').html(left["SourceName"])
        $('#source0').attr('href', left["Source"])
        $('#number0').show();

        $('#img1').css('background-image', 'url("images/Events/' + right["Img"] + '.png")');
        $('#name1').html(right["Name"])
        $('#number1').html(right["Rating"])
        $('#source1').html(right["SourceName"])
        $('#source1').attr('href', right["Source"])

        $('#img2').css('background-image', 'url("images/Events/' + extra["Img"] + '.png")');
        $('#name2').html(extra["Name"])
        $('#number2').html(extra["Rating"])
        $('#source2').html(extra["SourceName"])
        $('#source2').attr('href', extra["Source"])

        $('#conf').css("background-color", "#138613")

        trulyFinished = true;

        imgPos = [-500, 0, 500]
        done = [false, false, false]
        curScore = 0;

        leftmost = 1

    }
    newPB = false;

    function result(win) {
        trulyFinished = false;
        //This fades in the right animals rating then fades in the result
        $('#number' + leftmost).fadeIn(1000, function () {
            if (win == false) {
                //If its a loss set the indicator to be red
                $('#conf').css("background-color", "#862a13")
            } else {
                curScore += 1;
            }
            // $('#vs').hide();
            $('#conf').fadeIn(1000, function () {
                $('#vs').hide();
                $('#CS').html(curScore)
                //If the user is logged in then check if they have a new PB and update if they do
                if(userInfo!=null){
                    if (curScore > userInfo["PersonalBest"]) {
                        userInfo["PersonalBest"] = curScore;
                        $('#PB').html(curScore)
                        newPB = true;
                    }
                }

                if (win == false) {

                    //When they lost hide all the divs
                    $('#youScored').html(curScore);
                    $('.img').fadeOut(2000);
                    $('.circle').fadeOut(2000);
                    $('.personalInfoDiv').fadeOut(2000);

                    //This checks whether they are logged in again
                    //If they are then it checks whether they have a place on the leaderboard
                    //If they do it places them in and moves everyone down one.
                    if (userInfo != null) {
                        changed = false;
                        nam = userInfo["Username"];
                        scor = curScore;
                        for (i = 0; i < 5; i++) {
                            if (curScore >= parseInt(score[i])) {
                                oldScor = scor
                                oldNam = nam;

                                scor = score[i];
                                nam = user[i];

                                score[i] = oldScor;
                                user[i] = oldNam;
                                changed = true;
                            }
                        }
                        console.log(dispLeaders())

                        dataTrans = {
                            boardUpdate: [user, score]
                        }

                        console.log(dataTrans)

                        //This actually updates the leaderboard with the new score
                        if (changed) {
                            console.log("Changing")
                            $.ajax({
                                url: "/updateLeaderboard", // Url of backend (can be python, php, etc..)
                                type: "POST", // data type (can be get, post, put, delete)
                                data: dataTrans,
                                //Update the button so it is the opposite
                                success: function (response, textStatus, jqXHR) {
                                    console.log("Updated")
                                    for (i = 0; i < 5; i++) {
                                        $('#UserRow' + i).html(user[i])
                                        $('#ScoreRow' + i).html(score[i])
                                    }

                                    dataTrans = {
                                        personalBest: userInfo["PersonalBest"]
                                    }

                                    //This updates their accounts PB should they have beaten it
                                    if (newPB == true) {
                                        $.ajax({
                                            url: "/updatePB", // Url of backend (can be python, php, etc..)
                                            type: "POST", // data type (can be get, post, put, delete)
                                            data: dataTrans,
                                            //Update the button so it is the opposite
                                            success: function (response, textStatus, jqXHR) {
                                                console.log(response)
                                            }
                                        });
                                    }
                                }
                            })
                        }

                    }

                } else {
                    $('#conf').fadeOut(2000, function () {

                        nextGame();
                        moveSliders();
                    });
                }
            });
        })
    }

    //Testing output function
    function dispLeaders() {
        str = "";

        for (i = 0; i < 5; i++) {

            str += user[i] + " - " + score[i] + "\n"
        }
        return str;
    }

    $('.startButton').click(function () {

        setupGame();
        //if its a new game reset the divs to their origional positons
        //And show/hide the end screen info
        if (this.id.includes("new")) {
            console.log("new game")
            $('#youScored').html(curScore);
            $('.img').fadeIn(2000);
            $('.circle').fadeOut(2000);
            $('.personalInfoDiv').fadeIn(2000);

            for(i = 0; i < 3; i++){
                $('#number'+i).hide();
                $('#img' + i).css('left', (imgPos[i]+500))
            }

            $('#number0').show();           
        }

        $('#StartGameDiv').fadeOut(750, function () {
            $('#gameDiv').fadeIn(750);

        });

    })

    //Moves the right animal to the left, moves the hidden one to the right
    //Then assigns the next hidden one
    function nextGame() {
        left = right;
        right = extra;
        if (gameOrder.length==0){
            len = fullArray.length;

            temp = []
            gameOrder = [];

            for (i = 0; i < len; i++) {
                random = Math.floor(Math.random() * fullArray.length);

                gameOrder.push(fullArray[random]);
                temp.push(fullArray[random]);
                fullArray.splice(random, 1)

            }
            

            fullArray = temp;

    }

    extra = gameOrder[0];
    gameOrder.splice(0, 1);

}

});