//#region Page handling based on https://stackoverflow.com/questions/4741880/slide-a-div-offscreen-using-jquery
const audioMuteBtn = $('#audioMuteBtn');
const autoPlayBtn = $('#autoPlayBtn');
const playPauseBtn = $('#playPauseVideoBtn');
const audioSlider = $('#audioSlider');
const pageCount = $('.page').length + ' ';
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
            changePageNumbers(currentPage);
            removePulseFromFwdBtn();
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
            changePageNumbers(currentPage);
            removePulseFromFwdBtn();
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

    if (currentPage === pageCount - 1) {
        $('#navForwardBtn').addClass('disabled');
    } else if ($('#navForwardBtn').hasClass('disabled')) {
        $('#navForwardBtn').removeClass('disabled');
    }
    currentPageId = $(('#page' + currentPage));
}
//#endregion

//region Functions for reuse

function addPulseToFwdBtn() {
    $('#navForwardBtn').addClass('pulse');
}

function removePulseFromFwdBtn() {
    $('#navForwardBtn').removeClass('pulse');
}

function moveToNextPage() {
    $('#navForwardBtn').trigger("click");
}

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

function changePageNumbers(currPageNumber) {
    $('#currPageNumber').html((currPageNumber + 1) + ' ');
}
//#endregion

$(document).ready(function () {
    //region Initialization
    //Initialize image zooming
    $('.materialboxed').materialbox();
    //Initialize tooltips
    $('.tooltipped').tooltip();
    //Count the amount of "pages" (i.e. any element that has the class 'page') and set set the page amount correctly in the display
    $('#totalPages').html(pageCount);
    //Initialize modals
    $('.modal').modal({
        onOpenEnd: function (modal) {
            //Stop any page video currently running - modals are only used on pages with multiple videos, so we don't need to check in this case.
            currentPageId = $(('#page' + currentPage));
            pauseCurrPageVideo(currentPageId);
            if (autoPlayState) {
                ($('#' + (modal.id)).find('video').get(0)).volume = mainVolume;
                ($('#' + (modal.id)).find('video').get(0)).play();
                // playCurrPageVideo(($('#' + (modal.id)).find('video').get(0)));
                // console.log('opened modal - autoplay video in modal');
            }
        },
        onCloseStart: function (modal) {
            ($('#' + (modal.id)).find('video').get(0)).pause();
        },
        onCloseEnd: function () { // Callback for Modal close
            if (autoPlayState) {
                currentPageId = $(('#page' + currentPage));
                playCurrPageVideo(currentPageId);
            }
        }
    });


    //#endregion Initialization

    //#region Video and Audio controls
    $('.responsive-video').each(function () {
        $(this).get(0).onended = function () {
            if (parseInt(this.closest('section').id.substring(4, 5)) < pageCount - 1) {
                addPulseToFwdBtn();
            }
            setPlayBtnState(false);
        };
    });

    //Removed since it made the experience confusing as it was sometimes automatic page switching, and other times it wasn't.
    // $('#mainVideo').get(0).onended = function () {
    //     $('#navForwardBtn').trigger("click");
    // };

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
            if (checkIfPageHasVideo) {
                currentPageVideo.volume = mainVolume;
            }
            audioSlider.val = mainVolume;
            volumeMuteState = false;
            //Update icon to fit new state
            audioMuteBtn.html('<i class="material-icons">volume_up</i>');
        } else {
            if (checkIfPageHasVideo) {
                currentPageVideo.volume = 0;
            }
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