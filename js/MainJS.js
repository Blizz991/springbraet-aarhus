$(document).ready(function () {
    //region Initialization
    //Initialize image zooming
    $('.materialboxed').materialbox();
    //Initialize tooltips
    $('.tooltipped').tooltip();
    //Initialize sidenav for mobile
    // $('.sidenav').sidenav();

    //#endregion Initialization

    //#region Video and Audio controls
    let mainVideo = $('#mainVideo');
    let mainVideoControl = mainVideo.get(0);
    let mainVolume = 0.5;
    let volumeMuteState = false;
    let audioMuteBtn = $('#audioMuteBtn');
    let autoPlay = false;
    let autoPlayBtn = $('#autoPlayBtn');
    let pages = [0,1,2,3,4,5,6,7,8,9,10];

    mainVideoControl.onended = function() {
        // mainVideo.hide("slow");
        mainVideo.hide("slide", { direction: "left" }, 1000);
    };

    mainVideoControl.volume = mainVolume;
    mainVideo.on('click', function (e) {
        if (mainVideoControl.paused) {
            mainVideoControl.play();
        }
        else {
            mainVideoControl.pause();
        }
    });

    //Let the audioSlider control all audio
    $('#audioSlider').on('input', function (e) {
        // console.log($(this).val() / 100);
        mainVideoControl.volume = $(this).val() / 100;
        mainVolume = $(this).val() / 100;

        //Slight hack to trigger a reset of the mute state (and updating the button to show the change)
        if (volumeMuteState) {
            audioMuteBtn.trigger("click");
        }
    });

    audioMuteBtn.on('click', function (e) {
        if (volumeMuteState) {
            mainVideoControl.volume = mainVolume;
            $('#audioSlider').val = mainVolume;
            volumeMuteState = false;
            //Update icon to fit new state
            audioMuteBtn.html('<i class="material-icons">volume_up</i>');
        } else {
            mainVideoControl.volume = 0;
            $('#audioSlider').val = mainVolume;
            volumeMuteState = true;
            //Update icon to fit new state
            audioMuteBtn.html('<i class="material-icons">volume_off</i>');
        }
        //Change the mute button to the opposite color by changing the class (depending on the current)
        audioMuteBtn.toggleClass("red green");
    });

    autoPlayBtn.on('click', function (e) {
        autoPlayBtn.toggleClass("red green");
    });

    //#endregion Video and Audio Controls
});