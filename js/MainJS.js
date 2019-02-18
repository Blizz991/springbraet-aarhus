//#region Page handling based on https://stackoverflow.com/questions/4741880/slide-a-div-offscreen-using-jquery
let currentPage = 0;
let currentPageId;
function scrollPage(action) {

    currentPageId = $(('#page' + currentPage));

    if (action === 'next') {
        currentPageId.animate({
            left: '-100%'
        }, 500);
        currentPageId.next().animate({
            left: '0%'
        }, 500);
        currentPage++;
    } else if (action === 'back') {
        currentPageId.animate({
            left: '100%'
        }, 500);

        currentPageId.prev().animate({
            left: '0%'
        }, 500);
        currentPage--;
    }
    if (currentPage === 0) {
        $('#navBackBtn').addClass('disabled');
    } else if ($('#navBackBtn').hasClass('disabled')) {
        $('#navBackBtn').removeClass('disabled');
    }

    if (currentPage === 5) {
        $('#navForwardBtn').addClass('disabled');
    } else if ($('#navForwardBtn').hasClass('disabled')) {
        $('#navForwardBtn').removeClass('disabled');
    }
}
//#endregion

$(document).ready(function () {
    //region Initialization
    //Initialize image zooming
    $('.materialboxed').materialbox();
    //Initialize tooltips
    $('.tooltipped').tooltip();
    //#endregion Initialization

    //#region Video and Audio controls
    const mainVideo = $('#mainVideo');
    const audioMuteBtn = $('#audioMuteBtn');
    const mainVideoControl = mainVideo.get(0);
    const autoPlayBtn = $('#autoPlayBtn');
    let mainVolume = 0.5;
    let volumeMuteState = false;
    let autoPlay = false;

    // mainVideoControl.onended = function () {
    //     mainVideo.hide("slide", { direction: "left" }, 1000);
    // };

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