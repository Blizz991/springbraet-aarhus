//#region Page handling based on https://stackoverflow.com/questions/4741880/slide-a-div-offscreen-using-jquery

const audioMuteBtn = $('#audioMuteBtn');
const autoPlayBtn = $('#autoPlayBtn');
const playPauseBtn = $('#playPauseVideoBtn');
const audioSlider = $('#audioSlider');
let currentPageVideo = $('#mainVideo').get(0);
let autoPlayState = true;
let mainVolume = 0.5;
let volumeMuteState = false;

let currentPage = 0;
let currentPageId = $(('#page' + currentPage));

function scrollPage(action) {
    if (action === 'next') {
        if (checkIfPageHasVideo(currentPageId)) {
            pauseCurrPageVideo(currentPageId);
        }
        currentPageId.animate({
            left: '-100%'
        }, 1000, function () {
            if (checkIfPageHasVideo(currentPageId)) {
                if (autoPlayState) {
                    playCurrPageVideo(currentPageId);
                    setPlayBtnState(true);
                }
            }
        });
        currentPageId.next().animate({
            left: '0%'
        }, 1000);
        //Set current page to currentPage+1
        currentPage++;
    } else if (action === 'back') {
        if (checkIfPageHasVideo(currentPageId)) {
            pauseCurrPageVideo(currentPageId);
        }
        currentPageId.animate({
            left: '100%'
        }, 1000, function () {
            if (checkIfPageHasVideo(currentPageId)) {
                if (autoPlayState) {
                    playCurrPageVideo(currentPageId);
                    setPlayBtnState(true);
                }
            }
        });
        currentPageId.prev().animate({
            left: '0%'
        }, 1000);
        //Set current page to currentPage-1
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
    currentPageId = $(('#page' + currentPage));
}
//#endregion

//region Functions for reuse
function checkIfPageHasVideo(currPageId) {
    let pageHasVideo = false;
    if (typeof getCurrPageVideo(currPageId) !== "undefined") {
        pageHasVideo = true;
        playPauseBtn.removeClass('disabled');
    } else {
        playPauseBtn.addClass('disabled');
    }
    return pageHasVideo;
}

function playCurrPageVideo(currPageId) {
    if (checkIfPageHasVideo) {
        if (volumeMuteState) {
            getCurrPageVideo(currPageId).volume = 0;
        } else {
            getCurrPageVideo(currPageId).volume = mainVolume;
        }
        getCurrPageVideo(currPageId).play();
        setPlayBtnState(true);
    }
}

function pauseCurrPageVideo(currPageId) {
    if (checkIfPageHasVideo) {
        if (volumeMuteState) {
            getCurrPageVideo(currPageId).volume = 0;
        } else {
            getCurrPageVideo(currPageId).volume = mainVolume;
        }
        getCurrPageVideo(currPageId).pause();
        setPlayBtnState(false);
    }
}

function getCurrPageVideo(currPageId) {
    return currPageId.find('video').get(0);
}

function setPlayBtnState(state) {
    if (state) {
        playPauseBtn.removeClass("green");
        playPauseBtn.addClass('red');
        playPauseBtn.html('<i class="material-icons">pause</i>');
    } else {
        playPauseBtn.removeClass("red");
        playPauseBtn.addClass('green');
        playPauseBtn.html('<i class="material-icons">play_arrow</i>');
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
    $('.responsive-video').each(function () {
        $(this).get(0).onended = function () {
            setPlayBtnState(false);
        };
    });

    $('#mainVideo').get(0).onended = function () {
        $('#navForwardBtn').trigger("click");
    };

    playPauseBtn.on('click', function (e) {
        currentPageVideo = getCurrPageVideo(currentPageId);
        if (currentPageVideo.paused) {
            playCurrPageVideo(currentPageId);
        }
        else {
            pauseCurrPageVideo(currentPageId);
        }
    });

    autoPlayBtn.on('click', function (e) {
        autoPlayBtn.toggleClass("red green");
        autoPlayState = !autoPlayState;
    });

    //Let the audioSlider control all audio
    audioSlider.on('input', function (e) {
        currentPageVideo = getCurrPageVideo(currentPageId);
        currentPageVideo.volume = $(this).val() / 100;
        mainVolume = $(this).val() / 100;

        //Slight hack to trigger a reset of the mute state (and updating the button to show the change)
        if (volumeMuteState) {
            audioMuteBtn.trigger("click");
        }
    });

    audioMuteBtn.on('click', function (e) {
        currentPageVideo = getCurrPageVideo(currentPageId);
        if (volumeMuteState) {
            currentPageVideo.volume = mainVolume;
            audioSlider.val = mainVolume;
            volumeMuteState = false;
            //Update icon to fit new state
            audioMuteBtn.html('<i class="material-icons">volume_up</i>');
        } else {
            currentPageVideo.volume = 0;
            audioSlider.val = mainVolume;
            volumeMuteState = true;
            //Update icon to fit new state
            audioMuteBtn.html('<i class="material-icons">volume_off</i>');
        }
        //Change the mute button to the opposite color by changing the class (depending on the current)
        audioMuteBtn.toggleClass("red green");
    });
    //#endregion Video and Audio Controls
});