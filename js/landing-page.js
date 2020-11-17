function searchStart() {
    var summonerName = document.getElementById("textSummonerName").value;
    var progress = document.getElementById("pbar");
    var width = 1;
    var id = setInterval(frame, 10);

    for (var i = 1; i < 5; i++) {
        document.getElementById("progress_" + i).src = "img/icon_none.PNG";
    }

    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            progress.value = width
        }

        if (width == 9) document.getElementById("progress_1").src = "img/icon_check.PNG";
        else if (width == 37) document.getElementById("progress_2").src = "img/icon_check.PNG";
        else if (width == 64) document.getElementById("progress_3").src = "img/icon_check.PNG";
        else if (width == 91) document.getElementById("progress_4").src = "img/icon_check.PNG";
    }

    console.log('요청 보냄');
    $.ajax({
        crossOrigin : true,
        dataType : "json",
        url : "http://13.209.3.139/jax/check",
        success : function(data) {
            console.log(data);
        }
    });

    // 최초 검색 요청을 보냄
    // 

    // fetch('http://13.209.3.139/jax/search')
    //     .then(function (resp) {
    //         // 응답 형식에 따라 resp.text() 가 될 수도 있다
    //         console.log(resp.json());
    //         return resp.json();
    //     })
    //     .then(function (json) {
    //         console.log(json); // { tempature: 27 }
    //     });
    // console.log('ㅇㅅㅇ');
}