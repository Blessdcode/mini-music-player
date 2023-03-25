const wrapper = document.querySelector(".wrapper")
const musicImg = document.querySelector(".img-area img")
const musicName = document.querySelector(".song-details .name")
const musicArtist = document.querySelector(".song-details .artist")
const mainAudio = document.querySelector("#main-audio")
const playPauseBtn = document.querySelector(".play-pause")
const nextBtn = document.querySelector("#next")
const prevBtn = document.querySelector("#prev")
const progressBar = document.querySelector(".progress-bar")
const progressArea = document.querySelector(".progress-area")
const showMoreBtn = document.querySelector("#queue")
const hideMoreBtn = document.querySelector("#close")
const musicList = document.querySelector(".music-list")
const expandMore = document.querySelector("#expand")
const expandLess = document.querySelector("#expand-less")


expandMore.addEventListener("click", () => {
    wrapper.classList.add("compressed")
})

expandLess.addEventListener("click", () => {
    wrapper.classList.remove("compressed")
})



let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)
window.addEventListener("load", () => {
    //calling load music function once window load
    loadMusic(musicIndex)
})

// load music function
function loadMusic(indexNum) {
    musicName.innerText = allMusic[indexNum - 1].name
    musicArtist.innerText = allMusic[indexNum - 1].artist
    musicImg.src = `img/${allMusic[indexNum - 1].img}.jpg`
    mainAudio.src = `music/${allMusic[indexNum - 1].src}.mp3`
}

// play music function
function playMusic() {
    wrapper.classList.add("paused")
    playPauseBtn.querySelector("span").innerText = "pause"
    mainAudio.play()
}

// pause music function
function pauseMusic() {
    wrapper.classList.remove("paused")
    playPauseBtn.querySelector("span").innerText = "play"
    mainAudio.pause()
}

// next music function
function nextMusic() {
    // increment by 1
    musicIndex++
    // if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    pauseMusic()
}

// prev music function
function prevMusic() {
    // increment by 1
    musicIndex--
    // if musicIndex is less 1 than musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    pauseMusic()
}

// play or music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused")

    // if ismusicPasued is True then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic()
})

nextBtn.addEventListener("click", () => {

    // calling next music function
    nextMusic();
    playMusic()
})

prevBtn.addEventListener("click", () => {

    // calling next music function

    prevMusic();
    playMusic()
})


// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    // getting current time of song
    const currentTime = e.target.currentTime

    // getting total duration of song
    const duration = e.target.duration

    let progressWidth = (currentTime / duration) * 100
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = wrapper.querySelector(".current")
    let musicDuration = wrapper.querySelector(".duration")
    mainAudio.addEventListener("loadeddata", () => {

        //update duration
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    })

    //update currentTime
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

// update current time with progress bar
progressArea.addEventListener("click", (e) => {
    // getting width of the progress bar
    let progressWidthInterval = progressArea.clientWidth
    // getting offset x value
    let clickedOffSetX = e.offsetX
    // getting song total duration
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthInterval) * songDuration
    playMusic()
})


// shuffle songs  and repeat songs
const repeatBtn = document.querySelector("#repeat")
repeatBtn.addEventListener("click", () => {

    //first we get the innerText of th icon then we'll change accordingly
    let getText = repeatBtn.innerText // getting innerText of icon

    // different changes on different icon click using switch
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title", "song looped")
            break

        case "repeat_one": // if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title", "Playback shuffle")
            break

        case "shuffle": // if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist looped")
            break

    }

})

//let work on what will happen when the icons changes on line 132, 137, 142

mainAudio.addEventListener("ended", () => {
    // if user set icon on loop song then we'll repeat the current song and will do further accordingly

    let getText = repeatBtn.innerText

    // different changes on different icon click using switch
    switch (getText) {
        // if ths icon is repeat then simply we call the nextMusic function so the next song will play
        case "repeat":
            nextMusic()
            playMusic() //calling playMusic function
            break

        // if icon is repeat_one then change we'll change the current playing song current time to 0 so song will play from start
        case "repeat_one":
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic() //calling playMusic function
            break

        case "shuffle": // if icon is shuffle then change it to repeat and generating random index between the max rang of array length

            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1)
            } while (musicIndex == randomIndex)  //  this loop run until the next random number won't be the same of the current music index
            musicIndex = randomIndex  //  passing randomIndex to musicIndx so the random song will play
            loadMusic(musicIndex) //calling loadMusic function
            playMusic() //calling playMusic function
            break

    }

})


// toggle music-list
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show")
})
hideMoreBtn.addEventListener("click", () => {
    showMoreBtn.click()
})


const ulTag = document.querySelector("ul")

//let crete li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    // let pass the song, artist from the array to li
    let liTag = `<li li-index="${i}>
                        <div class="row">
                            <span>${allMusic[i].name}</span>
                            <p>${allMusic[i].artist}</p>
                        </div>
                        
                            <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>

                            <span id="${allMusic[i].src}" class="audio-duration">4:39</span>
                    </li>`

    ulTag.insertAdjacentHTML("beforeend", liTag)

    let liAudioDuration = document.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = document.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener("loadeddata", () => {
        //update duration
        let audioDuration = liAudioTag.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`
    })
}

// let work on play particular song on click
const allLiTags = document.querySelector("li")
for (let i = 0; i < allLiTags.length; i++) {



    // adding onClick attribute in all li tags
    allLiTags[i].setAttribute("onclick", "clicked(this")
}