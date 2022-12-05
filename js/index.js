// 音乐信息链接
var url = 'https://api.vvhan.com/api/rand.music?type=json&sort=热歌榜'
// 音乐信息
var musicInfo = []
var nowmusic = ''
// 创建DOM元素
var audio = $("<audio></audio>")
// 创建图片标签
var musicimg = $("<img>")
// 获取歌名标签
var song = $("<div></div>")
// 获取歌手标签
var auther = $("<div></div>")

// 相关属性
var isPaused = false
var isMuted = false
// 播放列表长度
var len = 0
var nowloca = 0
// 音量
var volume = 1


// 初始化 获取音乐信息
function init() {
    $.ajax({
        url: url,
        type: "get",
        dataType: 'json',
        success: function (res) {
            // 设置自动播放
            audio.attr("autoplay", "autoplay")
            // 设置音乐源地址(URL)
            audio.attr("src", res.info.mp3url)
            $(".musicbox").append(audio)
            // 设置图片URL
            musicimg.attr("src", res.info.picUrl)
            // 给图篇标题添加musicimg类
            musicimg.addClass("musicimg")
            // 把图片标签插入HTML中
            $(".music-img").append(musicimg)
            // 插入歌手名
            auther.text(res.info.auther)
            auther.addClass("auther")
            // 插入歌曲名
            song.text(res.info.name)
            song.addClass("name")
            // 插入标签
            $(".music-info").append(song)
            $(".music-info").append(auther)

            len = 1
            nowloca = 1

            // 存储歌曲列表
            musicInfo.push(res.info)
            nowmusic = res.info
        }
    })
}

$(function () {
    // 初始化
    init()
    // 监测数据变化
    setTimer()
})

// 进度条
function ProgressBar() {
    // 获取歌曲全长
    var duration = audio.prop("duration")
    // 获取歌曲当前播放长度
    var currentTime = audio.prop("currentTime")

    // 时长
    let m = parseInt(duration / 60)
    let s = parseInt(duration % 60)

    // 当前播放时长
    let sm = parseInt(currentTime / 60)
    let ss = parseInt(currentTime % 60)

    // 将时间插入到网页中
    if (s > 9) {
        let end = '0' + m + ':' + s
        $(".end").text(end)
    } else {
        let end = '0' + m + ':0' + s
        $(".end").text(end)
    }
    if (sm > 0) {
        if (ss > 9) {
            let runtime = '0' + sm + ':' + ss
            $(".start").text(runtime)
        } else {
            let runtime = '0' + sm + ':0' + ss
            $(".start").text(runtime)
        }
    }else {
        if (ss > 9) {
            let runtime = '0' + sm + ':' + ss
            $(".start").text(runtime)
        } else {
            let runtime = '0' + sm + ':0' + ss 
            $(".start").text(runtime)
        }
    }

    // 修改进度条长度
    let width = $(".running").css("width")
    let rate = currentTime / duration
    width = parseFloat(width)  * parseFloat(rate)
    $(".running1").css("width", parseInt(width))
    
    // 歌曲播放完 加载下一曲
    if (duration == currentTime) {
        $.ajax({
            url: url,
            type: "get",
            dataType: 'json',
            success: function (res) {
                nowmusic = res.info

                // nowloca等于数组长度 获取新的歌曲
                musicInfo.push(nowmusic)
                // 定位参数
                len = musicInfo.length
                nowloca = len
                // 设置信息
                audio.prop("src", nowmusic.mp3url)
                musicimg.prop("src", nowmusic.picUrl)
                auther.text(nowmusic.auther)
                song.text(nowmusic.name)
            }
        })
    }
}
// 重新播放
function replayMusic() {
    audio.prop("src", nowmusic.mp3url)
    musicimg.prop("src", nowmusic.picUrl)
    auther.text(nowmusic.auther)
    song.text(nowmusic.name)
}
// 暂停播放
function pauseMusic() {
    var player = document.getElementsByTagName("audio")
    if (isPaused)
    {
        player[0].play()
        musicimg.css("animation-play-state", "running")
        $("#pause").html("&#xe6e5;")
    } else {
        player[0].pause()
        musicimg.css("animation-play-state", "paused")
        $("#pause").html("&#xe6e4;")
    }
    isPaused = !isPaused
}
// 静音
function muteMusic() {
    // 静音 defaultMuted默认是否静音
    var player = document.getElementsByTagName("audio")
    if (isMuted) {
        player[0].muted = false
        $("#mute").html("&#xe62f;")
        $(".vulmeBar").css("width", vulme * 100)
    } else {
        player[0].muted = true
        $("#mute").html("&#xe706;")
        $(".vulmeBar").css("width", 0)
    }
    isMuted = !isMuted
}
// 上一曲
function preMusic() {
    if (nowloca == 1) {
        alert("这是第一首歌曲哦！！！")
    } else {
        nowloca = nowloca - 1 
        nowmusic = musicInfo[nowloca - 1]
        audio.prop("src", nowmusic.mp3url)
        musicimg.prop("src", nowmusic.picUrl)
        auther.text(nowmusic.auther)
        song.text(nowmusic.name)
    }
}
// 下一曲
function nextMusic() {
    // 根据nowloca判断读取列表里面的还是重新获取歌曲
    if (nowloca == len) {
        $.ajax({
            url: url,
            type: "get",
            dataType: 'json',
            success: function (res) {
                nowmusic = res.info

                // nowloca等于数组长度 获取新的歌曲
                musicInfo.push(nowmusic)
                // 定位参数
                len = musicInfo.length
                nowloca = len
                // 设置信息
                audio.prop("src", nowmusic.mp3url)
                musicimg.prop("src", nowmusic.picUrl)
                auther.text(nowmusic.auther)
                song.text(nowmusic.name)
            }
        })
    } else {
        nowmusic = musicInfo[nowloca]
        // 设置信息
        audio.prop("src", nowmusic.mp3url)
        musicimg.prop("src", nowmusic.picUrl)
        auther.text(nowmusic.auther)
        song.text(nowmusic.name)
        // 定位参数
        nowloca = nowloca + 1
    }
}
// 修改音量
function changeVulme(e) {
    $(".vulmeBar").click(function (e) {
        let x = e.offsetX
        let y = e.offsetY

        // 在指定位置计算音量
        if (x >= 0 && x <= 5 || y <= 0) {
            volume = x / 100
            audio.prop("volume", volume)
            
            $(".vulmeBar1").css("width", volume * 100)
        } 

    });

}
// 修改歌曲进度
function changeProgress() {
    $(".running").click(function (e) {
        let x = e.offsetX
        let y = e.offsetY
        var duration = audio.prop("duration")

        // 在指定位置计算
        if (x >= 0 && x <= 258 || y <= 0) {
            let l = x / 258
            let time = l * duration

            document.getElementsByTagName("audio")[0].currentTime = time
            $(".running1").css("width", x)
        } 

    });
}
// 实时监测数据变化
function setTimer() {
    // 设置定时器 每秒执行一次
    setInterval(() => {
        ProgressBar()
      
        // 监测音量 volume 当vulme的宽度等于150时 设置宽度 否者为0 隐藏
        if ($(".vulme").css("width") === '150px') {
            $(".vulmeBar").css("width", 100)
            $(".vulmeBar1").css("width", volume * 100)
        } else {
            $(".vulmeBar").css("width", 0)
            $(".vulmeBar1").css("width",0)
        }
    }, 1000)
}
// <!--setInterval实时显示时间-->
function mytime(){
    var a = new Date();
    var b = a.toLocaleTimeString();
    var c = a.toLocaleDateString();
    document.getElementById("time").innerHTML = c+"&nbsp"+b;
    }
setInterval(function() {mytime()},1000);