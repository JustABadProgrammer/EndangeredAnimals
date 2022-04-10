$(document).ready(function () {

    // $('#mainDiv').css('background-image', 'url("images/Events/Axolotl.png")')
    //getEventInfo();

    gameOrder = [];
    gamePos = 0;


    fullArray = [];
    left = null;
    right = null;
    extra = null;

    imgPos = [-500, 0, 500]
    done = [false, false, false]
    leftmost = 1;


    getEventInfo();

    function moveSliders() {
        for (i = 0; i < 3; i++) {
            slider(i);
        }
    }

    function slider(i) {
        done[i] = false;
        $('#img' + i).animate({ left: imgPos[i] + 'px' }, 1500, function () {
            //If it is -500 then it is the last rounds. So it can be moved
            //And updated to the next image
            if (imgPos[i] === -500) {
                $('#img' + i).css('left', '1000px')
                console.log(extra["Img"])
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
        });
    }


    function getEventInfo() {

        $.ajax({
            url: "/getAnimalStats", // Url of backend (can be python, php, etc..)
            type: "GET", // data type (can be get, post, put, delete)
            //Update the button so it is the opposite
            success: function (response, textStatus, jqXHR) {

                animalInfo = JSON.parse(response)
                len = animalInfo.length;

                for (i = 0; i < len; i++) {
                    random = Math.floor(Math.random() * animalInfo.length);

                    gameOrder.push(animalInfo[random]);
                    fullArray.push(animalInfo[random]);
                    animalInfo.splice(random, 1)
                }

                console.log(gameOrder)

                left = gameOrder[0];
                right = gameOrder[1];
                extra = gameOrder[2];
                gameOrder.splice(0, 3)

                $('#img0').css('background-image', 'url("images/Events/' + left["Img"] + '.png")');
                $('#name0').html(left["Name"])
                $('#number0').html(left["Rating"])
                $('#number0').show();

                $('#img1').css('background-image', 'url("images/Events/' + right["Img"] + '.png")');
                $('#name1').html(right["Name"])
                $('#number1').html(right["Rating"])

                $('#img2').css('background-image', 'url("images/Events/' + extra["Img"] + '.png")');
                $('#name2').html(extra["Name"])
                $('#number2').html(extra["Rating"])
            }
        });
    }

    $('#higher').click(function () {
        if (right["Rating"] >= left["Rating"]) {

            $('#number' + leftmost).fadeIn(1000, function () {
                nextGame();
                moveSliders();
            })
        } else {
            console.log("Your Poop")
        }
    })

    $('#lower').click(function () {
        if (right["Rating"] <= left["Rating"]) {
            $('#number' + leftmost).fadeIn(1000, function () {
                nextGame();
                moveSliders();
            })
        } else {
            console.log("Your Poop")
        }
    })

    $('#startGame').click(function () {
        $('#StartGameDiv').fadeOut(750, function () {
            $('#gameDiv').fadeIn(750);
        });

    })

    function nextGame() {
        if (gameOrder.length != 0) {
            left = right;
            right = extra;
            extra = gameOrder[0];
            gameOrder.splice(0, 1);
        } else {
            console.log("Congrats")
        }

    }

});


/*
THINGS TO DO

Feedback on a fail.
Leaderboard system
Allow entry to leaderboard
*/