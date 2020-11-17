// Document Ready
$(document).ready(function () {
    // init
    $('#progress-section').css('display', 'none');
    $('#wrapper').css('display', 'none');
    $('#graph-row').css('display', 'none');
    $('.view-detail').css('margin-bottom', '20px');
});

// Copy sCAUt.GG URL
$(function () {
    var clipboard = new Clipboard('#share-button');

    clipboard.on('success', function (e) {
        swal({
            title: "Notice",
            text: "URL Copied!"
        });
    });
});

// Ajax Summoner Search
function searchStart() {
    // Progress Section → Display: block
    var section = document.getElementById('progress-section');
    section.style.display = 'block';
    $('.wait').text('Please wait...');
    $('.match-count').text('');
    $('#progress-section').css('display', 'block');

    // Variables
    var summonerName = document.getElementById("textSummonerName").value;
    var progress = document.getElementById("pbar");
    var width = 1;
    // Reset Datas
    progress.value = 0;
    document.getElementById("progress_1").src = "img/icon_none.PNG";
    document.getElementById("progress_2").src = "img/icon_none.PNG";
    document.getElementById("progress_3").src = "img/icon_none.PNG";
    document.getElementById("progress_4").src = "img/icon_none.PNG";
    $('.hand').css({'transform': 'rotate(-90deg)'});
    $('#wrapper').css('display', 'none');
    $('.view-detail').css('margin-bottom', '20px');
    $('#graph-row').css('display', 'none');
    destroyChart();

    // First Request
    var search_api = 'http://13.209.3.139/' + summonerName + '/search';
    $.ajax({
        crossOrigin: true,
        dataType: "json",
        url: search_api
    });

    var crolling = false;
    var getMatchlist = false;
    var getMatches = null;
    var runModel = 0;
    var countMatch = 0;
    var totalMatch = 0;
    var sName = '';
    var sWin = 0;
    var sLose = 0;
    var sLp = 0;
    var sTier = 0;

    var progress_1_finish = false;
    var progress_2_finish = false;
    var progress_3_finish = false;
    var progress_4_finish = false;

    var i = 0;
    var check_api = 'http://13.209.3.139/' + summonerName + '/check';
    var progressing = setInterval(function () {
        if (runModel == true) {
            clearInterval(progressing);
        }
        $.ajax({
            crossOrigin: true,
            dataType: "json",
            url: check_api,
            success: function (data) {
                crolling = data['crolling'];
                getMatchlist = data['getMatchlist'];
                getMatches = data['getMatches'];
                runModel = data['createDatas'];
                sName = data['summonerName'];
                sWin = data['wins'];
                sLose = data['losses'];
                sLp = data['lp'];
                sTier = data['tier'];
                if (getMatches != null) {
                    countMatch = getMatches.split(',')[0];
                    totalMatch = getMatches.split(',')[1];
                }

                // crolling: true → Search Summoner Finish
                if (crolling == true && !progress_1_finish) {
                    console.log('1번 들어옴');
                    progress_1_finish = true;

                    var progress_1_fill = setInterval(function () {
                        width++;
                        progress.value = width;

                        if (width >= 5) {
                            console.log('1번 이미지 수정 부분 들어옴');
                            document.getElementById("progress_1").src = "img/icon_check.PNG";
                            clearInterval(progress_1_fill);
                        }
                    }, 10)
                }
                // getMatchlist: true → Get Match List Finish
                else if (getMatchlist == true && !progress_2_finish && progress_1_finish) {
                    console.log('2번 들어옴');
                    progress_2_finish = true;

                    var progress_2_fill = setInterval(function () {
                        width++;
                        progress.value = width;

                        if (width >= 35) {
                            console.log('2번 이미지 수정 부분 들어옴');
                            document.getElementById("progress_2").src = "img/icon_check.PNG";
                            clearInterval(progress_2_fill);
                        }
                    }, 10)
                }
                // getMatches: not null → Get Matches Counting
                else if (getMatches != null && !progress_3_finish && progress_2_finish && progress_1_finish) {
                    console.log('3번 들어옴');
                    progress_3_finish = true;

                    var progress_3_fill = setInterval(function () {
                        if (width < 65) {
                            let temp = (30 / totalMatch) * countMatch;
                            width = 35 + temp;
                            progress.value = width;
                        }

                        $('.match-count').text('(' + countMatch + '/' + totalMatch + ')');

                        if (width >= 65) {
                            if (Number(countMatch) == Number(totalMatch)) {
                                console.log('3번 이미지 수정 부분 들어옴');
                                document.getElementById("progress_3").src = "img/icon_check.PNG";
                                width = 65;
                                clearInterval(progress_3_fill);
                            }
                        }
                    }, 10)
                }
                // runModel: true → Run Model Finish
                else if (runModel == true && !progress_4_finish && progress_3_finish && progress_2_finish && progress_1_finish) {
                    console.log('4번 들어옴');
                    progress_4_finish = true;

                    var progress_4_fill = setInterval(function () {
                        if (width <= 99) {
                            width++;
                            progress.value = width;
                        }

                        if (width >= 91) {
                            console.log('4번 이미지 수정 부분 들어옴');
                            document.getElementById("progress_4").src = "img/icon_check.PNG";
                        }

                        if (width >= 100) {
                            clearInterval(progress_4_fill);

                            // summoner Info Update
                            predictByMeter(sName, sLp, sWin, sLose, sTier);
                        }
                    }, 10)
                }
                console.log(crolling, getMatchlist, getMatches, runModel, countMatch, totalMatch);
                console.log('runModel(createDatas): ' + runModel);
            }
        });
        i++;
        console.log(i);
    }, 500);
}

// Summoner Info Update
function UpdateSummonerInfo(summonerName, lp, wins, losses, tier) {
    var rank_text = '';
    var promo_rank_text = '';
    var demo_rank_text = '';
    if (tier == 1) {
        demo_rank_text = '-';
        rank_text = 'Iron IV';
        promo_rank_text = 'Iron III';
    } else if (tier == 2) {
        demo_rank_text = 'Iron IV';
        rank_text = 'Iron III';
        promo_rank_text = 'Iron II';
    } else if (tier == 3) {
        demo_rank_text = 'Iron III';
        rank_text = 'Iron II';
        promo_rank_text = 'Iron I';
    } else if (tier == 4) {
        demo_rank_text = 'Iron II';
        rank_text = 'Iron I';
        promo_rank_text = 'Bronze IV';
    } else if (tier == 5) {
        demo_rank_text = 'Iron I';
        rank_text = 'Bronze IV';
        promo_rank_text = 'Bronze III';
    } else if (tier == 6) {
        demo_rank_text = 'Bronze IV';
        rank_text = 'Bronze III';
        promo_rank_text = 'Bronze II';
    } else if (tier == 7) {
        demo_rank_text = 'Bronze III';
        rank_text = 'Bronze II';
        promo_rank_text = 'Bronze I';
    } else if (tier == 8) {
        demo_rank_text = 'Bronze II';
        rank_text = 'Bronze I';
        promo_rank_text = 'Silver IV';
    } else if (tier == 9) {
        demo_rank_text = 'Bronze I';
        rank_text = 'Silver IV';
        promo_rank_text = 'Silver III';
    } else if (tier == 10) {
        demo_rank_text = 'Silver IV';
        rank_text = 'Silver III';
        promo_rank_text = 'Silver II';
    } else if (tier == 11) {
        demo_rank_text = 'Silver III';
        rank_text = 'Silver II';
        promo_rank_text = 'Silver I';
    } else if (tier == 12) {
        demo_rank_text = 'Silver II';
        rank_text = 'Silver I';
        promo_rank_text = 'Gold IV';
    } else if (tier == 13) {
        demo_rank_text = 'Silver I';
        rank_text = 'Gold IV';
        promo_rank_text = 'Gold III';
    } else if (tier == 14) {
        demo_rank_text = 'Gold IV';
        rank_text = 'Gold III';
        promo_rank_text = 'Gold II';
    } else if (tier == 15) {
        demo_rank_text = 'Gold III';
        rank_text = 'Gold II';
        promo_rank_text = 'Gold I';
    } else if (tier == 16) {
        demo_rank_text = 'Gold II';
        rank_text = 'Gold I';
        promo_rank_text = 'Platinum IV';
    } else if (tier == 17) {
        demo_rank_text = 'Gold I';
        rank_text = 'Platinum IV';
        promo_rank_text = 'Platinum III';
    } else if (tier == 18) {
        demo_rank_text = 'Platinum IV';
        rank_text = 'Platinum III';
        promo_rank_text = 'Platinum II';
    } else if (tier == 19) {
        demo_rank_text = 'Platinum III';
        rank_text = 'Platinum II';
        promo_rank_text = 'Platinum I';
    } else if (tier == 20) {
        demo_rank_text = 'Platinum II';
        rank_text = 'Platinum I';
        promo_rank_text = 'Diamond IV';
    } else if (tier == 21) {
        demo_rank_text = 'Platinum I';
        rank_text = 'Diamond IV';
        promo_rank_text = 'Diamond III';
    } else if (tier == 22) {
        demo_rank_text = 'Diamond IV';
        rank_text = 'Diamond III';
        promo_rank_text = 'Diamond II';
    } else if (tier == 23) {
        demo_rank_text = 'Diamond III';
        rank_text = 'Diamond II';
        promo_rank_text = 'Diamond I';
    } else if (tier == 24) {
        demo_rank_text = 'Diamond II';
        rank_text = 'Diamond I';
        promo_rank_text = 'Master';
    } else if (tier == 25) {
        demo_rank_text = 'Diamond';
        rank_text = 'Master';
        promo_rank_text = 'Grandmaster';
    } else if (tier == 26) {
        demo_rank_text = 'Master';
        rank_text = 'Grandmaster';
        promo_rank_text = 'Challenger';
    } else if (tier == 27) {
        demo_rank_text = 'Grandmaster';
        rank_text = 'Challenger';
        promo_rank_text = '-';
    }

    // info update
    $('.summoner-rank').text(rank_text);
    $('.summoner-name').text(summonerName);
    $('.summoner-lp').text(lp);
    $('.summoner-wins').text(wins);
    $('.summoner-lose').text(losses);
    $(".now-tier").attr("src", "img/emblems/" + tier + '.png');

    // meter update
    $('.demotion-rank').text(demo_rank_text);
    $('.promotion-rank').text(promo_rank_text);
    $(".demotion-tier").attr("src", "img/emblems/" + (tier - 1) + '.png');
    $(".promotion-tier").attr("src", "img/emblems/" + (tier + 1) + '.png');
}

// Predict By Meter
function predictByMeter(summonerName, lp, wins, losses, tier) {
    var promotion = 0;
    var api = 'http://13.209.3.139/' + summonerName + '/result';
    $.ajax({
        crossOrigin: true,
        dataType: "json",
        url: api,
        success: function (data) {
            // update summoner info
            $('.wait').text('Analysis Completed!');
            UpdateSummonerInfo(summonerName, lp, wins, losses, tier);
            $('#wrapper').css('display', 'flex');

            promotion = data.user_promotion;
            console.log('승급률: ' + promotion);

            var hand = $('.hand');
            var tempDeg = -90;
            var inputVal = tempDeg + (Math.floor(180 * promotion));

            // promotion : tier
            if (promotion > 0.5) {
                $('.d-tier').addClass('deactive');
                $('.d-tier').removeClass('active');
                $('.p-tier').addClass('active');
                $('.p-tier').removeClass('deactive');
            } else if (promotion < 0.5) {
                $('.d-tier').addClass('active');
                $('.d-tier').removeClass('deactive');
                $('.p-tier').addClass('deactive');
                $('.p-tier').removeClass('active');
            } else {
                $('.d-tier').addClass('deactive');
                $('.d-tier').removeClass('active');
                $('.p-tier').addClass('deactive');
                $('.p-tier').removeClass('active');
            }

            var intervalRate = 0;
            if (inputVal > tempDeg + 150) {
                intervalRate = 10;
            } else if (inputVal > tempDeg + 110) {
                intervalRate = 8;
            } else if (inputVal > tempDeg + 80) {
                intervalRate = 6;
            } else if (inputVal > tempDeg + 50) {
                intervalRate = 4;
            } else {
                intervalRate = 2;
            }

            var i = tempDeg;
            var timer = setInterval(function () {
                $('.hand').css({
                    'transform': 'rotate(' + (i++) + 'deg)'
                });

                if (i > inputVal) {
                    clearInterval(timer);
                }
            }, 1000 / (60 * intervalRate));

            // create chart
            var indicator = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            indicator[0] = data.user_info[0].win;
            indicator[1] = data.user_info[0].loss;
            indicator[2] = data.user_info[0].kills;
            indicator[3] = data.user_info[0].deaths;
            indicator[4] = data.user_info[0].assists;
            indicator[5] = data.user_info[0].killingSprees;
            indicator[6] = data.user_info[0].totalDamageDealt;
            indicator[7] = data.user_info[0].totalDamageDealtToChampions;
            indicator[8] = data.user_info[0].totalDamageTaken;
            indicator[9] = data.user_info[0].goldEarned;
            indicator[10] = data.user_info[0].goldSpent;
            indicator[11] = data.user_info[0].totalMinionsKilled;
            indicator[12] = data.user_info[0].totalTimeCrowdControlDealt;
            indicator[13] = data.user_info[0].champLevel;
            createGraphData(indicator, tier);
        }
    });
}

// Toggle Graphs
function toggleGraphs() {
    if ($('#graph-row').css('display') == 'flex') {
        $('.view-detail').css('margin-bottom', '20px');
        $('.view-detail').text('View Details');
    } else {
        $('.view-detail').css('margin-bottom', '0');
        $('.view-detail').text('Hide');
    }
    $('#graph-row').slideToggle();
}

// Create Graph
function createGraphData(indicator, tier) {
    var league = 16;    // = tier
    var api = 'http://13.209.3.139/league/' + league;

    // p: promotion, d: demotion
    var pTempData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    var dTempData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    $.ajax({
        crossOrigin: true,
        dataType: "json",
        url: api,
        success: function (data) {
            let i = 0;
            while (data[i] != undefined) {
                if (data[i].promotion == true) {
                    // wins
                    if (0.0 <= data[i].win && data[i].win < 0.1) pTempData[0][0]++;
                    else if (0.1 <= data[i].win && data[i].win < 0.2) pTempData[0][1]++;
                    else if (0.2 <= data[i].win && data[i].win < 0.3) pTempData[0][2]++;
                    else if (0.3 <= data[i].win && data[i].win < 0.4) pTempData[0][3]++;
                    else if (0.4 <= data[i].win && data[i].win < 0.5) pTempData[0][4]++;
                    else if (0.5 <= data[i].win && data[i].win < 0.6) pTempData[0][5]++;
                    else if (0.6 <= data[i].win && data[i].win < 0.7) pTempData[0][6]++;
                    else if (0.7 <= data[i].win && data[i].win < 0.8) pTempData[0][7]++;
                    else if (0.8 <= data[i].win && data[i].win < 0.9) pTempData[0][8]++;
                    else if (0.9 <= data[i].win && data[i].win < 1.0) pTempData[0][9]++;

                    // loss
                    if (0.0 <= data[i].loss && data[i].loss < 0.1) pTempData[1][0]++;
                    else if (0.1 <= data[i].loss && data[i].loss < 0.2) pTempData[1][1]++;
                    else if (0.2 <= data[i].loss && data[i].loss < 0.3) pTempData[1][2]++;
                    else if (0.3 <= data[i].loss && data[i].loss < 0.4) pTempData[1][3]++;
                    else if (0.4 <= data[i].loss && data[i].loss < 0.5) pTempData[1][4]++;
                    else if (0.5 <= data[i].loss && data[i].loss < 0.6) pTempData[1][5]++;
                    else if (0.6 <= data[i].loss && data[i].loss < 0.7) pTempData[1][6]++;
                    else if (0.7 <= data[i].loss && data[i].loss < 0.8) pTempData[1][7]++;
                    else if (0.8 <= data[i].loss && data[i].loss < 0.9) pTempData[1][8]++;
                    else if (0.9 <= data[i].loss && data[i].loss < 1.0) pTempData[1][9]++;

                    // kills
                    if (0.0 <= data[i].kills && data[i].kills < 0.1) pTempData[2][0]++;
                    else if (0.1 <= data[i].kills && data[i].kills < 0.2) pTempData[2][1]++;
                    else if (0.2 <= data[i].kills && data[i].kills < 0.3) pTempData[2][2]++;
                    else if (0.3 <= data[i].kills && data[i].kills < 0.4) pTempData[2][3]++;
                    else if (0.4 <= data[i].kills && data[i].kills < 0.5) pTempData[2][4]++;
                    else if (0.5 <= data[i].kills && data[i].kills < 0.6) pTempData[2][5]++;
                    else if (0.6 <= data[i].kills && data[i].kills < 0.7) pTempData[2][6]++;
                    else if (0.7 <= data[i].kills && data[i].kills < 0.8) pTempData[2][7]++;
                    else if (0.8 <= data[i].kills && data[i].kills < 0.9) pTempData[2][8]++;
                    else if (0.9 <= data[i].kills && data[i].kills < 1.0) pTempData[2][9]++;

                    // deaths
                    if (0.0 <= data[i].deaths && data[i].deaths < 0.1) pTempData[3][0]++;
                    else if (0.1 <= data[i].deaths && data[i].deaths < 0.2) pTempData[3][1]++;
                    else if (0.2 <= data[i].deaths && data[i].deaths < 0.3) pTempData[3][2]++;
                    else if (0.3 <= data[i].deaths && data[i].deaths < 0.4) pTempData[3][3]++;
                    else if (0.4 <= data[i].deaths && data[i].deaths < 0.5) pTempData[3][4]++;
                    else if (0.5 <= data[i].deaths && data[i].deaths < 0.6) pTempData[3][5]++;
                    else if (0.6 <= data[i].deaths && data[i].deaths < 0.7) pTempData[3][6]++;
                    else if (0.7 <= data[i].deaths && data[i].deaths < 0.8) pTempData[3][7]++;
                    else if (0.8 <= data[i].deaths && data[i].deaths < 0.9) pTempData[3][8]++;
                    else if (0.9 <= data[i].deaths && data[i].deaths < 1.0) pTempData[3][9]++;

                    // assists
                    if (0.0 <= data[i].assists && data[i].assists < 0.1) pTempData[4][0]++;
                    else if (0.1 <= data[i].assists && data[i].assists < 0.2) pTempData[4][1]++;
                    else if (0.2 <= data[i].assists && data[i].assists < 0.3) pTempData[4][2]++;
                    else if (0.3 <= data[i].assists && data[i].assists < 0.4) pTempData[4][3]++;
                    else if (0.4 <= data[i].assists && data[i].assists < 0.5) pTempData[4][4]++;
                    else if (0.5 <= data[i].assists && data[i].assists < 0.6) pTempData[4][5]++;
                    else if (0.6 <= data[i].assists && data[i].assists < 0.7) pTempData[4][6]++;
                    else if (0.7 <= data[i].assists && data[i].assists < 0.8) pTempData[4][7]++;
                    else if (0.8 <= data[i].assists && data[i].assists < 0.9) pTempData[4][8]++;
                    else if (0.9 <= data[i].assists && data[i].assists < 1.0) pTempData[4][9]++;

                    // killingSprees
                    if (0.0 <= data[i].killingSprees && data[i].killingSprees < 0.1) pTempData[5][0]++;
                    else if (0.1 <= data[i].killingSprees && data[i].killingSprees < 0.2) pTempData[5][1]++;
                    else if (0.2 <= data[i].killingSprees && data[i].killingSprees < 0.3) pTempData[5][2]++;
                    else if (0.3 <= data[i].killingSprees && data[i].killingSprees < 0.4) pTempData[5][3]++;
                    else if (0.4 <= data[i].killingSprees && data[i].killingSprees < 0.5) pTempData[5][4]++;
                    else if (0.5 <= data[i].killingSprees && data[i].killingSprees < 0.6) pTempData[5][5]++;
                    else if (0.6 <= data[i].killingSprees && data[i].killingSprees < 0.7) pTempData[5][6]++;
                    else if (0.7 <= data[i].killingSprees && data[i].killingSprees < 0.8) pTempData[5][7]++;
                    else if (0.8 <= data[i].killingSprees && data[i].killingSprees < 0.9) pTempData[5][8]++;
                    else if (0.9 <= data[i].killingSprees && data[i].killingSprees < 1.0) pTempData[5][9]++;

                    // totalDamageDealt
                    if (0.0 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.1) pTempData[6][0]++;
                    else if (0.1 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.2) pTempData[6][1]++;
                    else if (0.2 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.3) pTempData[6][2]++;
                    else if (0.3 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.4) pTempData[6][3]++;
                    else if (0.4 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.5) pTempData[6][4]++;
                    else if (0.5 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.6) pTempData[6][5]++;
                    else if (0.6 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.7) pTempData[6][6]++;
                    else if (0.7 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.8) pTempData[6][7]++;
                    else if (0.8 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.9) pTempData[6][8]++;
                    else if (0.9 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 1.0) pTempData[6][9]++;

                    // totalDamageDealtToChampions
                    if (0.0 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.1) pTempData[7][0]++;
                    else if (0.1 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.2) pTempData[7][1]++;
                    else if (0.2 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.3) pTempData[7][2]++;
                    else if (0.3 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.4) pTempData[7][3]++;
                    else if (0.4 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.5) pTempData[7][4]++;
                    else if (0.5 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.6) pTempData[7][5]++;
                    else if (0.6 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.7) pTempData[7][6]++;
                    else if (0.7 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.8) pTempData[7][7]++;
                    else if (0.8 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.9) pTempData[7][8]++;
                    else if (0.9 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 1.0) pTempData[7][9]++;

                    // totalDamageTaken
                    if (0.0 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.1) pTempData[8][0]++;
                    else if (0.1 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.2) pTempData[8][1]++;
                    else if (0.2 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.3) pTempData[8][2]++;
                    else if (0.3 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.4) pTempData[8][3]++;
                    else if (0.4 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.5) pTempData[8][4]++;
                    else if (0.5 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.6) pTempData[8][5]++;
                    else if (0.6 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.7) pTempData[8][6]++;
                    else if (0.7 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.8) pTempData[8][7]++;
                    else if (0.8 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.9) pTempData[8][8]++;
                    else if (0.9 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 1.0) pTempData[8][9]++;

                    // goldEarned
                    if (0.0 <= data[i].goldEarned && data[i].goldEarned < 0.1) pTempData[9][0]++;
                    else if (0.1 <= data[i].goldEarned && data[i].goldEarned < 0.2) pTempData[9][1]++;
                    else if (0.2 <= data[i].goldEarned && data[i].goldEarned < 0.3) pTempData[9][2]++;
                    else if (0.3 <= data[i].goldEarned && data[i].goldEarned < 0.4) pTempData[9][3]++;
                    else if (0.4 <= data[i].goldEarned && data[i].goldEarned < 0.5) pTempData[9][4]++;
                    else if (0.5 <= data[i].goldEarned && data[i].goldEarned < 0.6) pTempData[9][5]++;
                    else if (0.6 <= data[i].goldEarned && data[i].goldEarned < 0.7) pTempData[9][6]++;
                    else if (0.7 <= data[i].goldEarned && data[i].goldEarned < 0.8) pTempData[9][7]++;
                    else if (0.8 <= data[i].goldEarned && data[i].goldEarned < 0.9) pTempData[9][8]++;
                    else if (0.9 <= data[i].goldEarned && data[i].goldEarned < 1.0) pTempData[9][9]++;

                    // goldSpent
                    if (0.0 <= data[i].goldSpent && data[i].goldSpent < 0.1) pTempData[10][0]++;
                    else if (0.1 <= data[i].goldSpent && data[i].goldSpent < 0.2) pTempData[10][1]++;
                    else if (0.2 <= data[i].goldSpent && data[i].goldSpent < 0.3) pTempData[10][2]++;
                    else if (0.3 <= data[i].goldSpent && data[i].goldSpent < 0.4) pTempData[10][3]++;
                    else if (0.4 <= data[i].goldSpent && data[i].goldSpent < 0.5) pTempData[10][4]++;
                    else if (0.5 <= data[i].goldSpent && data[i].goldSpent < 0.6) pTempData[10][5]++;
                    else if (0.6 <= data[i].goldSpent && data[i].goldSpent < 0.7) pTempData[10][6]++;
                    else if (0.7 <= data[i].goldSpent && data[i].goldSpent < 0.8) pTempData[10][7]++;
                    else if (0.8 <= data[i].goldSpent && data[i].goldSpent < 0.9) pTempData[10][8]++;
                    else if (0.9 <= data[i].goldSpent && data[i].goldSpent < 1.0) pTempData[10][9]++;

                    // totalMinionsKilled
                    if (0.0 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.1) pTempData[11][0]++;
                    else if (0.1 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.2) pTempData[11][1]++;
                    else if (0.2 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.3) pTempData[11][2]++;
                    else if (0.3 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.4) pTempData[11][3]++;
                    else if (0.4 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.5) pTempData[11][4]++;
                    else if (0.5 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.6) pTempData[11][5]++;
                    else if (0.6 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.7) pTempData[11][6]++;
                    else if (0.7 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.8) pTempData[11][7]++;
                    else if (0.8 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.9) pTempData[11][8]++;
                    else if (0.9 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 1.0) pTempData[11][9]++;

                    // totalTimeCrowdControlDealt
                    if (0.0 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.1) pTempData[12][0]++;
                    else if (0.1 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.2) pTempData[12][1]++;
                    else if (0.2 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.3) pTempData[12][2]++;
                    else if (0.3 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.4) pTempData[12][3]++;
                    else if (0.4 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.5) pTempData[12][4]++;
                    else if (0.5 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.6) pTempData[12][5]++;
                    else if (0.6 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.7) pTempData[12][6]++;
                    else if (0.7 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.8) pTempData[12][7]++;
                    else if (0.8 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.9) pTempData[12][8]++;
                    else if (0.9 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 1.0) pTempData[12][9]++;

                    // champLevel
                    if (0.0 <= data[i].champLevel && data[i].champLevel < 0.1) pTempData[13][0]++;
                    else if (0.1 <= data[i].champLevel && data[i].champLevel < 0.2) pTempData[13][1]++;
                    else if (0.2 <= data[i].champLevel && data[i].champLevel < 0.3) pTempData[13][2]++;
                    else if (0.3 <= data[i].champLevel && data[i].champLevel < 0.4) pTempData[13][3]++;
                    else if (0.4 <= data[i].champLevel && data[i].champLevel < 0.5) pTempData[13][4]++;
                    else if (0.5 <= data[i].champLevel && data[i].champLevel < 0.6) pTempData[13][5]++;
                    else if (0.6 <= data[i].champLevel && data[i].champLevel < 0.7) pTempData[13][6]++;
                    else if (0.7 <= data[i].champLevel && data[i].champLevel < 0.8) pTempData[13][7]++;
                    else if (0.8 <= data[i].champLevel && data[i].champLevel < 0.9) pTempData[13][8]++;
                    else if (0.9 <= data[i].champLevel && data[i].champLevel < 1.0) pTempData[13][9]++;
                } else {
                    // wins
                    if (0.0 <= data[i].win && data[i].win < 0.1) dTempData[0][0]++;
                    else if (0.1 <= data[i].win && data[i].win < 0.2) dTempData[0][1]++;
                    else if (0.2 <= data[i].win && data[i].win < 0.3) dTempData[0][2]++;
                    else if (0.3 <= data[i].win && data[i].win < 0.4) dTempData[0][3]++;
                    else if (0.4 <= data[i].win && data[i].win < 0.5) dTempData[0][4]++;
                    else if (0.5 <= data[i].win && data[i].win < 0.6) dTempData[0][5]++;
                    else if (0.6 <= data[i].win && data[i].win < 0.7) dTempData[0][6]++;
                    else if (0.7 <= data[i].win && data[i].win < 0.8) dTempData[0][7]++;
                    else if (0.8 <= data[i].win && data[i].win < 0.9) dTempData[0][8]++;
                    else if (0.9 <= data[i].win && data[i].win < 1.0) dTempData[0][9]++;

                    // loss
                    if (0.0 <= data[i].loss && data[i].loss < 0.1) dTempData[1][0]++;
                    else if (0.1 <= data[i].loss && data[i].loss < 0.2) dTempData[1][1]++;
                    else if (0.2 <= data[i].loss && data[i].loss < 0.3) dTempData[1][2]++;
                    else if (0.3 <= data[i].loss && data[i].loss < 0.4) dTempData[1][3]++;
                    else if (0.4 <= data[i].loss && data[i].loss < 0.5) dTempData[1][4]++;
                    else if (0.5 <= data[i].loss && data[i].loss < 0.6) dTempData[1][5]++;
                    else if (0.6 <= data[i].loss && data[i].loss < 0.7) dTempData[1][6]++;
                    else if (0.7 <= data[i].loss && data[i].loss < 0.8) dTempData[1][7]++;
                    else if (0.8 <= data[i].loss && data[i].loss < 0.9) dTempData[1][8]++;
                    else if (0.9 <= data[i].loss && data[i].loss < 1.0) dTempData[1][9]++;

                    // kills
                    if (0.0 <= data[i].kills && data[i].kills < 0.1) dTempData[2][0]++;
                    else if (0.1 <= data[i].kills && data[i].kills < 0.2) dTempData[2][1]++;
                    else if (0.2 <= data[i].kills && data[i].kills < 0.3) dTempData[2][2]++;
                    else if (0.3 <= data[i].kills && data[i].kills < 0.4) dTempData[2][3]++;
                    else if (0.4 <= data[i].kills && data[i].kills < 0.5) dTempData[2][4]++;
                    else if (0.5 <= data[i].kills && data[i].kills < 0.6) dTempData[2][5]++;
                    else if (0.6 <= data[i].kills && data[i].kills < 0.7) dTempData[2][6]++;
                    else if (0.7 <= data[i].kills && data[i].kills < 0.8) dTempData[2][7]++;
                    else if (0.8 <= data[i].kills && data[i].kills < 0.9) dTempData[2][8]++;
                    else if (0.9 <= data[i].kills && data[i].kills < 1.0) dTempData[2][9]++;

                    // deaths
                    if (0.0 <= data[i].deaths && data[i].deaths < 0.1) dTempData[3][0]++;
                    else if (0.1 <= data[i].deaths && data[i].deaths < 0.2) dTempData[3][1]++;
                    else if (0.2 <= data[i].deaths && data[i].deaths < 0.3) dTempData[3][2]++;
                    else if (0.3 <= data[i].deaths && data[i].deaths < 0.4) dTempData[3][3]++;
                    else if (0.4 <= data[i].deaths && data[i].deaths < 0.5) dTempData[3][4]++;
                    else if (0.5 <= data[i].deaths && data[i].deaths < 0.6) dTempData[3][5]++;
                    else if (0.6 <= data[i].deaths && data[i].deaths < 0.7) dTempData[3][6]++;
                    else if (0.7 <= data[i].deaths && data[i].deaths < 0.8) dTempData[3][7]++;
                    else if (0.8 <= data[i].deaths && data[i].deaths < 0.9) dTempData[3][8]++;
                    else if (0.9 <= data[i].deaths && data[i].deaths < 1.0) dTempData[3][9]++;

                    // assists
                    if (0.0 <= data[i].assists && data[i].assists < 0.1) dTempData[4][0]++;
                    else if (0.1 <= data[i].assists && data[i].assists < 0.2) dTempData[4][1]++;
                    else if (0.2 <= data[i].assists && data[i].assists < 0.3) dTempData[4][2]++;
                    else if (0.3 <= data[i].assists && data[i].assists < 0.4) dTempData[4][3]++;
                    else if (0.4 <= data[i].assists && data[i].assists < 0.5) dTempData[4][4]++;
                    else if (0.5 <= data[i].assists && data[i].assists < 0.6) dTempData[4][5]++;
                    else if (0.6 <= data[i].assists && data[i].assists < 0.7) dTempData[4][6]++;
                    else if (0.7 <= data[i].assists && data[i].assists < 0.8) dTempData[4][7]++;
                    else if (0.8 <= data[i].assists && data[i].assists < 0.9) dTempData[4][8]++;
                    else if (0.9 <= data[i].assists && data[i].assists < 1.0) dTempData[4][9]++;

                    // killingSprees
                    if (0.0 <= data[i].killingSprees && data[i].killingSprees < 0.1) dTempData[5][0]++;
                    else if (0.1 <= data[i].killingSprees && data[i].killingSprees < 0.2) dTempData[5][1]++;
                    else if (0.2 <= data[i].killingSprees && data[i].killingSprees < 0.3) dTempData[5][2]++;
                    else if (0.3 <= data[i].killingSprees && data[i].killingSprees < 0.4) dTempData[5][3]++;
                    else if (0.4 <= data[i].killingSprees && data[i].killingSprees < 0.5) dTempData[5][4]++;
                    else if (0.5 <= data[i].killingSprees && data[i].killingSprees < 0.6) dTempData[5][5]++;
                    else if (0.6 <= data[i].killingSprees && data[i].killingSprees < 0.7) dTempData[5][6]++;
                    else if (0.7 <= data[i].killingSprees && data[i].killingSprees < 0.8) dTempData[5][7]++;
                    else if (0.8 <= data[i].killingSprees && data[i].killingSprees < 0.9) dTempData[5][8]++;
                    else if (0.9 <= data[i].killingSprees && data[i].killingSprees < 1.0) dTempData[5][9]++;

                    // totalDamageDealt
                    if (0.0 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.1) dTempData[6][0]++;
                    else if (0.1 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.2) dTempData[6][1]++;
                    else if (0.2 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.3) dTempData[6][2]++;
                    else if (0.3 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.4) dTempData[6][3]++;
                    else if (0.4 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.5) dTempData[6][4]++;
                    else if (0.5 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.6) dTempData[6][5]++;
                    else if (0.6 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.7) dTempData[6][6]++;
                    else if (0.7 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.8) dTempData[6][7]++;
                    else if (0.8 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 0.9) dTempData[6][8]++;
                    else if (0.9 <= data[i].totalDamageDealt && data[i].totalDamageDealt < 1.0) dTempData[6][9]++;

                    // totalDamageDealtToChampions
                    if (0.0 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.1) dTempData[7][0]++;
                    else if (0.1 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.2) dTempData[7][1]++;
                    else if (0.2 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.3) dTempData[7][2]++;
                    else if (0.3 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.4) dTempData[7][3]++;
                    else if (0.4 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.5) dTempData[7][4]++;
                    else if (0.5 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.6) dTempData[7][5]++;
                    else if (0.6 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.7) dTempData[7][6]++;
                    else if (0.7 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.8) dTempData[7][7]++;
                    else if (0.8 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 0.9) dTempData[7][8]++;
                    else if (0.9 <= data[i].totalDamageDealtToChampions && data[i].totalDamageDealtToChampions < 1.0) dTempData[7][9]++;

                    // totalDamageTaken
                    if (0.0 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.1) dTempData[8][0]++;
                    else if (0.1 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.2) dTempData[8][1]++;
                    else if (0.2 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.3) dTempData[8][2]++;
                    else if (0.3 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.4) dTempData[8][3]++;
                    else if (0.4 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.5) dTempData[8][4]++;
                    else if (0.5 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.6) dTempData[8][5]++;
                    else if (0.6 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.7) dTempData[8][6]++;
                    else if (0.7 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.8) dTempData[8][7]++;
                    else if (0.8 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 0.9) dTempData[8][8]++;
                    else if (0.9 <= data[i].totalDamageTaken && data[i].totalDamageTaken < 1.0) dTempData[8][9]++;

                    // goldEarned
                    if (0.0 <= data[i].goldEarned && data[i].goldEarned < 0.1) dTempData[9][0]++;
                    else if (0.1 <= data[i].goldEarned && data[i].goldEarned < 0.2) dTempData[9][1]++;
                    else if (0.2 <= data[i].goldEarned && data[i].goldEarned < 0.3) dTempData[9][2]++;
                    else if (0.3 <= data[i].goldEarned && data[i].goldEarned < 0.4) dTempData[9][3]++;
                    else if (0.4 <= data[i].goldEarned && data[i].goldEarned < 0.5) dTempData[9][4]++;
                    else if (0.5 <= data[i].goldEarned && data[i].goldEarned < 0.6) dTempData[9][5]++;
                    else if (0.6 <= data[i].goldEarned && data[i].goldEarned < 0.7) dTempData[9][6]++;
                    else if (0.7 <= data[i].goldEarned && data[i].goldEarned < 0.8) dTempData[9][7]++;
                    else if (0.8 <= data[i].goldEarned && data[i].goldEarned < 0.9) dTempData[9][8]++;
                    else if (0.9 <= data[i].goldEarned && data[i].goldEarned < 1.0) dTempData[9][9]++;

                    // goldSpent
                    if (0.0 <= data[i].goldSpent && data[i].goldSpent < 0.1) dTempData[10][0]++;
                    else if (0.1 <= data[i].goldSpent && data[i].goldSpent < 0.2) dTempData[10][1]++;
                    else if (0.2 <= data[i].goldSpent && data[i].goldSpent < 0.3) dTempData[10][2]++;
                    else if (0.3 <= data[i].goldSpent && data[i].goldSpent < 0.4) dTempData[10][3]++;
                    else if (0.4 <= data[i].goldSpent && data[i].goldSpent < 0.5) dTempData[10][4]++;
                    else if (0.5 <= data[i].goldSpent && data[i].goldSpent < 0.6) dTempData[10][5]++;
                    else if (0.6 <= data[i].goldSpent && data[i].goldSpent < 0.7) dTempData[10][6]++;
                    else if (0.7 <= data[i].goldSpent && data[i].goldSpent < 0.8) dTempData[10][7]++;
                    else if (0.8 <= data[i].goldSpent && data[i].goldSpent < 0.9) dTempData[10][8]++;
                    else if (0.9 <= data[i].goldSpent && data[i].goldSpent < 1.0) dTempData[10][9]++;

                    // totalMinionsKilled
                    if (0.0 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.1) dTempData[11][0]++;
                    else if (0.1 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.2) dTempData[11][1]++;
                    else if (0.2 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.3) dTempData[11][2]++;
                    else if (0.3 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.4) dTempData[11][3]++;
                    else if (0.4 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.5) dTempData[11][4]++;
                    else if (0.5 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.6) dTempData[11][5]++;
                    else if (0.6 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.7) dTempData[11][6]++;
                    else if (0.7 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.8) dTempData[11][7]++;
                    else if (0.8 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 0.9) dTempData[11][8]++;
                    else if (0.9 <= data[i].totalMinionsKilled && data[i].totalMinionsKilled < 1.0) dTempData[11][9]++;

                    // totalTimeCrowdControlDealt
                    if (0.0 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.1) dTempData[12][0]++;
                    else if (0.1 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.2) dTempData[12][1]++;
                    else if (0.2 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.3) dTempData[12][2]++;
                    else if (0.3 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.4) dTempData[12][3]++;
                    else if (0.4 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.5) dTempData[12][4]++;
                    else if (0.5 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.6) dTempData[12][5]++;
                    else if (0.6 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.7) dTempData[12][6]++;
                    else if (0.7 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.8) dTempData[12][7]++;
                    else if (0.8 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 0.9) dTempData[12][8]++;
                    else if (0.9 <= data[i].totalTimeCrowdControlDealt && data[i].totalTimeCrowdControlDealt < 1.0) dTempData[12][9]++;

                    // champLevel
                    if (0.0 <= data[i].champLevel && data[i].champLevel < 0.1) dTempData[13][0]++;
                    else if (0.1 <= data[i].champLevel && data[i].champLevel < 0.2) dTempData[13][1]++;
                    else if (0.2 <= data[i].champLevel && data[i].champLevel < 0.3) dTempData[13][2]++;
                    else if (0.3 <= data[i].champLevel && data[i].champLevel < 0.4) dTempData[13][3]++;
                    else if (0.4 <= data[i].champLevel && data[i].champLevel < 0.5) dTempData[13][4]++;
                    else if (0.5 <= data[i].champLevel && data[i].champLevel < 0.6) dTempData[13][5]++;
                    else if (0.6 <= data[i].champLevel && data[i].champLevel < 0.7) dTempData[13][6]++;
                    else if (0.7 <= data[i].champLevel && data[i].champLevel < 0.8) dTempData[13][7]++;
                    else if (0.8 <= data[i].champLevel && data[i].champLevel < 0.9) dTempData[13][8]++;
                    else if (0.9 <= data[i].champLevel && data[i].champLevel < 1.0) dTempData[13][9]++;
                }
                i++;
            }

            var pData = [
                [
                    { x: 0, y: pTempData[0][0] },
                    { x: 1, y: pTempData[0][1] },
                    { x: 2, y: pTempData[0][2] },
                    { x: 3, y: pTempData[0][3] },
                    { x: 4, y: pTempData[0][4] },
                    { x: 5, y: pTempData[0][5] },
                    { x: 6, y: pTempData[0][6] },
                    { x: 7, y: pTempData[0][7] },
                    { x: 8, y: pTempData[0][8] },
                    { x: 9, y: pTempData[0][9] },
                    { x: 10, y: pTempData[0][9] }
                ], 
                [
                    { x: 0, y: pTempData[1][0] },
                    { x: 1, y: pTempData[1][1] },
                    { x: 2, y: pTempData[1][2] },
                    { x: 3, y: pTempData[1][3] },
                    { x: 4, y: pTempData[1][4] },
                    { x: 5, y: pTempData[1][5] },
                    { x: 6, y: pTempData[1][6] },
                    { x: 7, y: pTempData[1][7] },
                    { x: 8, y: pTempData[1][8] },
                    { x: 9, y: pTempData[1][9] },
                    { x: 10, y: pTempData[1][9] }
                ],
                [
                    { x: 0, y: pTempData[2][0] },
                    { x: 1, y: pTempData[2][1] },
                    { x: 2, y: pTempData[2][2] },
                    { x: 3, y: pTempData[2][3] },
                    { x: 4, y: pTempData[2][4] },
                    { x: 5, y: pTempData[2][5] },
                    { x: 6, y: pTempData[2][6] },
                    { x: 7, y: pTempData[2][7] },
                    { x: 8, y: pTempData[2][8] },
                    { x: 9, y: pTempData[2][9] },
                    { x: 10, y: pTempData[2][9] }
                ],
                [
                    { x: 0, y: pTempData[3][0] },
                    { x: 1, y: pTempData[3][1] },
                    { x: 2, y: pTempData[3][2] },
                    { x: 3, y: pTempData[3][3] },
                    { x: 4, y: pTempData[3][4] },
                    { x: 5, y: pTempData[3][5] },
                    { x: 6, y: pTempData[3][6] },
                    { x: 7, y: pTempData[3][7] },
                    { x: 8, y: pTempData[3][8] },
                    { x: 9, y: pTempData[3][9] },
                    { x: 10, y: pTempData[3][9] }
                ],
                [
                    { x: 0, y: pTempData[4][0] },
                    { x: 1, y: pTempData[4][1] },
                    { x: 2, y: pTempData[4][2] },
                    { x: 3, y: pTempData[4][3] },
                    { x: 4, y: pTempData[4][4] },
                    { x: 5, y: pTempData[4][5] },
                    { x: 6, y: pTempData[4][6] },
                    { x: 7, y: pTempData[4][7] },
                    { x: 8, y: pTempData[4][8] },
                    { x: 9, y: pTempData[4][9] },
                    { x: 10, y: pTempData[4][9] }
                ],
                [
                    { x: 0, y: pTempData[5][0] },
                    { x: 1, y: pTempData[5][1] },
                    { x: 2, y: pTempData[5][2] },
                    { x: 3, y: pTempData[5][3] },
                    { x: 4, y: pTempData[5][4] },
                    { x: 5, y: pTempData[5][5] },
                    { x: 6, y: pTempData[5][6] },
                    { x: 7, y: pTempData[5][7] },
                    { x: 8, y: pTempData[5][8] },
                    { x: 9, y: pTempData[5][9] },
                    { x: 10, y: pTempData[5][9] }
                ],
                [
                    { x: 0, y: pTempData[6][0] },
                    { x: 1, y: pTempData[6][1] },
                    { x: 2, y: pTempData[6][2] },
                    { x: 3, y: pTempData[6][3] },
                    { x: 4, y: pTempData[6][4] },
                    { x: 5, y: pTempData[6][5] },
                    { x: 6, y: pTempData[6][6] },
                    { x: 7, y: pTempData[6][7] },
                    { x: 8, y: pTempData[6][8] },
                    { x: 9, y: pTempData[6][9] },
                    { x: 10, y: pTempData[6][9] }
                ],
                [
                    { x: 0, y: pTempData[7][0] },
                    { x: 1, y: pTempData[7][1] },
                    { x: 2, y: pTempData[7][2] },
                    { x: 3, y: pTempData[7][3] },
                    { x: 4, y: pTempData[7][4] },
                    { x: 5, y: pTempData[7][5] },
                    { x: 6, y: pTempData[7][6] },
                    { x: 7, y: pTempData[7][7] },
                    { x: 8, y: pTempData[7][8] },
                    { x: 9, y: pTempData[7][9] },
                    { x: 10, y: pTempData[7][9] }
                ],
                [
                    { x: 0, y: pTempData[8][0] },
                    { x: 1, y: pTempData[8][1] },
                    { x: 2, y: pTempData[8][2] },
                    { x: 3, y: pTempData[8][3] },
                    { x: 4, y: pTempData[8][4] },
                    { x: 5, y: pTempData[8][5] },
                    { x: 6, y: pTempData[8][6] },
                    { x: 7, y: pTempData[8][7] },
                    { x: 8, y: pTempData[8][8] },
                    { x: 9, y: pTempData[8][9] },
                    { x: 10, y: pTempData[8][9] }
                ],
                [
                    { x: 0, y: pTempData[9][0] },
                    { x: 1, y: pTempData[9][1] },
                    { x: 2, y: pTempData[9][2] },
                    { x: 3, y: pTempData[9][3] },
                    { x: 4, y: pTempData[9][4] },
                    { x: 5, y: pTempData[9][5] },
                    { x: 6, y: pTempData[9][6] },
                    { x: 7, y: pTempData[9][7] },
                    { x: 8, y: pTempData[9][8] },
                    { x: 9, y: pTempData[9][9] },
                    { x: 10, y: pTempData[9][9] }
                ],
                [
                    { x: 0, y: pTempData[10][0] },
                    { x: 1, y: pTempData[10][1] },
                    { x: 2, y: pTempData[10][2] },
                    { x: 3, y: pTempData[10][3] },
                    { x: 4, y: pTempData[10][4] },
                    { x: 5, y: pTempData[10][5] },
                    { x: 6, y: pTempData[10][6] },
                    { x: 7, y: pTempData[10][7] },
                    { x: 8, y: pTempData[10][8] },
                    { x: 9, y: pTempData[10][9] },
                    { x: 10, y: pTempData[10][9] }
                ],
                [
                    { x: 0, y: pTempData[11][0] },
                    { x: 1, y: pTempData[11][1] },
                    { x: 2, y: pTempData[11][2] },
                    { x: 3, y: pTempData[11][3] },
                    { x: 4, y: pTempData[11][4] },
                    { x: 5, y: pTempData[11][5] },
                    { x: 6, y: pTempData[11][6] },
                    { x: 7, y: pTempData[11][7] },
                    { x: 8, y: pTempData[11][8] },
                    { x: 9, y: pTempData[11][9] },
                    { x: 10, y: pTempData[11][9] }
                ],
                [
                    { x: 0, y: pTempData[12][0] },
                    { x: 1, y: pTempData[12][1] },
                    { x: 2, y: pTempData[12][2] },
                    { x: 3, y: pTempData[12][3] },
                    { x: 4, y: pTempData[12][4] },
                    { x: 5, y: pTempData[12][5] },
                    { x: 6, y: pTempData[12][6] },
                    { x: 7, y: pTempData[12][7] },
                    { x: 8, y: pTempData[12][8] },
                    { x: 9, y: pTempData[12][9] },
                    { x: 10, y: pTempData[12][9] }
                ],
                [
                    { x: 0, y: pTempData[13][0] },
                    { x: 1, y: pTempData[13][1] },
                    { x: 2, y: pTempData[13][2] },
                    { x: 3, y: pTempData[13][3] },
                    { x: 4, y: pTempData[13][4] },
                    { x: 5, y: pTempData[13][5] },
                    { x: 6, y: pTempData[13][6] },
                    { x: 7, y: pTempData[13][7] },
                    { x: 8, y: pTempData[13][8] },
                    { x: 9, y: pTempData[13][9] },
                    { x: 10, y: pTempData[13][9] }
                ],
            ];

            var dData = [
                [
                    { x: 0, y: dTempData[0][0] },
                    { x: 1, y: dTempData[0][1] },
                    { x: 2, y: dTempData[0][2] },
                    { x: 3, y: dTempData[0][3] },
                    { x: 4, y: dTempData[0][4] },
                    { x: 5, y: dTempData[0][5] },
                    { x: 6, y: dTempData[0][6] },
                    { x: 7, y: dTempData[0][7] },
                    { x: 8, y: dTempData[0][8] },
                    { x: 9, y: dTempData[0][9] },
                    { x: 10, y: dTempData[0][9] }
                ], 
                [
                    { x: 0, y: dTempData[1][0] },
                    { x: 1, y: dTempData[1][1] },
                    { x: 2, y: dTempData[1][2] },
                    { x: 3, y: dTempData[1][3] },
                    { x: 4, y: dTempData[1][4] },
                    { x: 5, y: dTempData[1][5] },
                    { x: 6, y: dTempData[1][6] },
                    { x: 7, y: dTempData[1][7] },
                    { x: 8, y: dTempData[1][8] },
                    { x: 9, y: dTempData[1][9] },
                    { x: 10, y: dTempData[1][9] }
                ],
                [
                    { x: 0, y: dTempData[2][0] },
                    { x: 1, y: dTempData[2][1] },
                    { x: 2, y: dTempData[2][2] },
                    { x: 3, y: dTempData[2][3] },
                    { x: 4, y: dTempData[2][4] },
                    { x: 5, y: dTempData[2][5] },
                    { x: 6, y: dTempData[2][6] },
                    { x: 7, y: dTempData[2][7] },
                    { x: 8, y: dTempData[2][8] },
                    { x: 9, y: dTempData[2][9] },
                    { x: 10, y: dTempData[2][9] }
                ],
                [
                    { x: 0, y: dTempData[3][0] },
                    { x: 1, y: dTempData[3][1] },
                    { x: 2, y: dTempData[3][2] },
                    { x: 3, y: dTempData[3][3] },
                    { x: 4, y: dTempData[3][4] },
                    { x: 5, y: dTempData[3][5] },
                    { x: 6, y: dTempData[3][6] },
                    { x: 7, y: dTempData[3][7] },
                    { x: 8, y: dTempData[3][8] },
                    { x: 9, y: dTempData[3][9] },
                    { x: 10, y: dTempData[3][9] }
                ],
                [
                    { x: 0, y: dTempData[4][0] },
                    { x: 1, y: dTempData[4][1] },
                    { x: 2, y: dTempData[4][2] },
                    { x: 3, y: dTempData[4][3] },
                    { x: 4, y: dTempData[4][4] },
                    { x: 5, y: dTempData[4][5] },
                    { x: 6, y: dTempData[4][6] },
                    { x: 7, y: dTempData[4][7] },
                    { x: 8, y: dTempData[4][8] },
                    { x: 9, y: dTempData[4][9] },
                    { x: 10, y: dTempData[4][9] }
                ],
                [
                    { x: 0, y: dTempData[5][0] },
                    { x: 1, y: dTempData[5][1] },
                    { x: 2, y: dTempData[5][2] },
                    { x: 3, y: dTempData[5][3] },
                    { x: 4, y: dTempData[5][4] },
                    { x: 5, y: dTempData[5][5] },
                    { x: 6, y: dTempData[5][6] },
                    { x: 7, y: dTempData[5][7] },
                    { x: 8, y: dTempData[5][8] },
                    { x: 9, y: dTempData[5][9] },
                    { x: 10, y: dTempData[5][9] }
                ],
                [
                    { x: 0, y: dTempData[6][0] },
                    { x: 1, y: dTempData[6][1] },
                    { x: 2, y: dTempData[6][2] },
                    { x: 3, y: dTempData[6][3] },
                    { x: 4, y: dTempData[6][4] },
                    { x: 5, y: dTempData[6][5] },
                    { x: 6, y: dTempData[6][6] },
                    { x: 7, y: dTempData[6][7] },
                    { x: 8, y: dTempData[6][8] },
                    { x: 9, y: dTempData[6][9] },
                    { x: 10, y: dTempData[6][9] }
                ],
                [
                    { x: 0, y: dTempData[7][0] },
                    { x: 1, y: dTempData[7][1] },
                    { x: 2, y: dTempData[7][2] },
                    { x: 3, y: dTempData[7][3] },
                    { x: 4, y: dTempData[7][4] },
                    { x: 5, y: dTempData[7][5] },
                    { x: 6, y: dTempData[7][6] },
                    { x: 7, y: dTempData[7][7] },
                    { x: 8, y: dTempData[7][8] },
                    { x: 9, y: dTempData[7][9] },
                    { x: 10, y: dTempData[7][9] }
                ],
                [
                    { x: 0, y: dTempData[8][0] },
                    { x: 1, y: dTempData[8][1] },
                    { x: 2, y: dTempData[8][2] },
                    { x: 3, y: dTempData[8][3] },
                    { x: 4, y: dTempData[8][4] },
                    { x: 5, y: dTempData[8][5] },
                    { x: 6, y: dTempData[8][6] },
                    { x: 7, y: dTempData[8][7] },
                    { x: 8, y: dTempData[8][8] },
                    { x: 9, y: dTempData[8][9] },
                    { x: 10, y: dTempData[8][9] }
                ],
                [
                    { x: 0, y: dTempData[9][0] },
                    { x: 1, y: dTempData[9][1] },
                    { x: 2, y: dTempData[9][2] },
                    { x: 3, y: dTempData[9][3] },
                    { x: 4, y: dTempData[9][4] },
                    { x: 5, y: dTempData[9][5] },
                    { x: 6, y: dTempData[9][6] },
                    { x: 7, y: dTempData[9][7] },
                    { x: 8, y: dTempData[9][8] },
                    { x: 9, y: dTempData[9][9] },
                    { x: 10, y: dTempData[9][9] }
                ],
                [
                    { x: 0, y: dTempData[10][0] },
                    { x: 1, y: dTempData[10][1] },
                    { x: 2, y: dTempData[10][2] },
                    { x: 3, y: dTempData[10][3] },
                    { x: 4, y: dTempData[10][4] },
                    { x: 5, y: dTempData[10][5] },
                    { x: 6, y: dTempData[10][6] },
                    { x: 7, y: dTempData[10][7] },
                    { x: 8, y: dTempData[10][8] },
                    { x: 9, y: dTempData[10][9] },
                    { x: 10, y: dTempData[10][9] }
                ],
                [
                    { x: 0, y: dTempData[11][0] },
                    { x: 1, y: dTempData[11][1] },
                    { x: 2, y: dTempData[11][2] },
                    { x: 3, y: dTempData[11][3] },
                    { x: 4, y: dTempData[11][4] },
                    { x: 5, y: dTempData[11][5] },
                    { x: 6, y: dTempData[11][6] },
                    { x: 7, y: dTempData[11][7] },
                    { x: 8, y: dTempData[11][8] },
                    { x: 9, y: dTempData[11][9] },
                    { x: 10, y: dTempData[11][9] }
                ],
                [
                    { x: 0, y: dTempData[12][0] },
                    { x: 1, y: dTempData[12][1] },
                    { x: 2, y: dTempData[12][2] },
                    { x: 3, y: dTempData[12][3] },
                    { x: 4, y: dTempData[12][4] },
                    { x: 5, y: dTempData[12][5] },
                    { x: 6, y: dTempData[12][6] },
                    { x: 7, y: dTempData[12][7] },
                    { x: 8, y: dTempData[12][8] },
                    { x: 9, y: dTempData[12][9] },
                    { x: 10, y: dTempData[12][9] }
                ],
                [
                    { x: 0, y: dTempData[13][0] },
                    { x: 1, y: dTempData[13][1] },
                    { x: 2, y: dTempData[13][2] },
                    { x: 3, y: dTempData[13][3] },
                    { x: 4, y: dTempData[13][4] },
                    { x: 5, y: dTempData[13][5] },
                    { x: 6, y: dTempData[13][6] },
                    { x: 7, y: dTempData[13][7] },
                    { x: 8, y: dTempData[13][8] },
                    { x: 9, y: dTempData[13][9] },
                    { x: 10, y: dTempData[13][9] }
                ],
            ];
            createChart(pData[0], dData[0], indicator[0], 'Wins');
            createChart(pData[1], dData[1], indicator[1], 'Losses');
            createChart(pData[2], dData[2], indicator[2], 'Kills');
            createChart(pData[3], dData[3], indicator[3], 'Deaths');
            createChart(pData[4], dData[4], indicator[4], 'Assists');
            createChart(pData[5], dData[5], indicator[5], 'KillingSprees');
            createChart(pData[6], dData[6], indicator[6], 'TotalDamageDealt');
            createChart(pData[7], dData[7], indicator[7], 'TotalDamageDealtToChampions');
            createChart(pData[8], dData[8], indicator[8], 'TotalDamageTaken');
            createChart(pData[9], dData[9], indicator[9], 'GoldEarned');
            createChart(pData[10], dData[10], indicator[10], 'GoldSpent');
            createChart(pData[11], dData[11], indicator[11], 'TotalMinionsKilled');
            createChart(pData[12], dData[12], indicator[12], 'TotalTimeCrowControlDealt');
            createChart(pData[13], dData[13], indicator[13], 'ChampionLevel');
        }
    });
}

var graphs = []

// Create Charts
function createChart(promotionData, demotionData, indicator, category) {
    if (category == 'Wins')
        var ctx = document.getElementById("canvas-1").getContext("2d");
    else if (category == 'Losses')
        var ctx = document.getElementById("canvas-2").getContext("2d");
    else if (category == 'Kills')
        var ctx = document.getElementById("canvas-3").getContext("2d");
    else if (category == 'Deaths')
        var ctx = document.getElementById("canvas-4").getContext("2d");
    else if (category == 'Assists')
        var ctx = document.getElementById("canvas-5").getContext("2d");
    else if (category == 'KillingSprees')
        var ctx = document.getElementById("canvas-6").getContext("2d");
    else if (category == 'TotalDamageDealt')
        var ctx = document.getElementById("canvas-7").getContext("2d");
    else if (category == 'TotalDamageDealtToChampions')
        var ctx = document.getElementById("canvas-8").getContext("2d");
    else if (category == 'TotalDamageTaken')
        var ctx = document.getElementById("canvas-9").getContext("2d");
    else if (category == 'GoldEarned')
        var ctx = document.getElementById("canvas-10").getContext("2d");
    else if (category == 'GoldSpent')
        var ctx = document.getElementById("canvas-11").getContext("2d");
    else if (category == 'TotalMinionsKilled')
        var ctx = document.getElementById("canvas-12").getContext("2d");
    else if (category == 'TotalTimeCrowControlDealt')
        var ctx = document.getElementById("canvas-13").getContext("2d");
    else if (category == 'ChampionLevel')
        var ctx = document.getElementById("canvas-14").getContext("2d");

    // 그라데이션
    var gradientPromo = ctx.createLinearGradient(0, 0, 0, 450);
    var gradientDemo = ctx.createLinearGradient(0, 0, 0, 450);

    gradientPromo.addColorStop(0, 'rgba(18, 132, 152, 0.5)');
    gradientPromo.addColorStop(0.25, 'rgba(0, 0, 0, 0.5)');

    gradientDemo.addColorStop(0, 'rgba(84, 84, 84, 0.5)');
    gradientDemo.addColorStop(0.25, 'rgba(0, 0, 0, 0.5)');

    var chartData = {
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        datasets: [{
                type: 'line',
                label: 'Demotion',
                data: demotionData,
                pointRadius: 0,
                borderColor: "rgba(84, 84, 84, 1)",
                borderWidth: 1,
                backgroundColor: gradientDemo,
                fill: true,
            },
            {
                type: 'line',
                label: 'Promotion',
                data: promotionData,
                pointRadius: 0,
                borderColor: "rgba(18, 132, 152, 1)",
                borderWidth: 1,
                backgroundColor: gradientPromo,
                fill: true,
            }
        ]
    };

    // 차트 에어리어 색
    Chart.pluginService.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options
                .chartArea
                .backgroundColor) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea
                    .backgroundColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea
                    .right -
                    chartArea.left, chartArea
                    .bottom - chartArea.top);
                ctx.restore();
            }
        }
    });

    var graph = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
            annotation: {
                annotations: [{
                    drawTime: "afterDatasetsDraw",
                    type: "line",
                    mode: "vertical",
                    scaleID: "x-axis-0",
                    value: indicator * 10,
                    borderWidth: 0.7,
                    borderColor: "#C8AA6E",
                    label: {
                        // content: "0.52",
                        enabled: true,
                        position: "top"
                    }
                }]
            },
            responsive: false,
            chartArea: {
                backgroundColor: 'rgba(48, 48, 48, 0.1)'
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        fontColor: 'white',
                        fontSize: 8,
                        callback: function (value, index, values) {
                            if (index == 0)
                                return '0';
                            else if (index == 2)
                                return '1';
                            else
                                return '';
                        }
                    }
                }],
                yAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        suggestedMin: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'y축'
                    }
                }]
            }
        }
    });
    graphs.push(graph)
}

// Destroy Charts
function destroyChart() {
    if(graphs){
        for (var i = 0; i < graphs.length; i++) {
            graphs[i].update();
            graphs[i].destroy();
        }
    }
    graphs = []
}