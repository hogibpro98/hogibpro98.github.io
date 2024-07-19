let zIndex = 1000;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".row-title").forEach(function (title) {
    title.addEventListener("click", function () {
      zIndex++;
      let  target = document.querySelector(title.getAttribute("data-target"));
      let idName = '#'+target.getAttribute("id");
      target.style.display =

      target.style.display === "none" || target.style.display === ""
          ? "block"
          : "none";

      target.style.zIndex =
        target.style.display === "none" || target.style.display === ""
          ? zIndex
          : 0;

      title.style.color  =
        target.style.display === "none" || target.style.display === ""
          ? 'whitesmoke'
          : '#ff0000';

      resetTabState(idName);
    });
  });
});

function resetTabState(idName) {
  document.querySelectorAll(".row-title").forEach(function (title) {
    let  target = document.querySelector(title.getAttribute("data-target"));
    if (idName != title.getAttribute("data-target")) {
      target.style.display = "none";
      target.style.zIndex = 0;
      title.style.color  = 'whitesmoke';
    }   
  });
}

const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let allMusicFull = showAllMusic();
let allMusic = showAllMusic(true);
let musicIndex = 1;//Math.floor((Math.random() * allMusic.length) + 1);// with random
isMusicPaused = true;

function generateCheckboxes(checkboxName, className) {
  allMusicFull.forEach((item) => {
    const checkboxItem = document.createElement("div");
    checkboxItem.classList.add(className);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${item.id}`;
    checkbox.value = `${item.audioSrc}cutinhere${item.title}`;

    const label = document.createElement("label");
    label.htmlFor = `${item.id}`;
    label.textContent = `${item.title}`;

    checkboxItem.appendChild(checkbox);
    checkboxItem.appendChild(label);
    checkboxName.appendChild(checkboxItem);
  });
}

const checkboxList = document.querySelector("#headset .checkbox-list");
checkboxList.addEventListener("click", (e) => {
  pauseMusic();
  loadMusic(1);
});
// generate 40 checkboxes
generateCheckboxes(checkboxList, "checkbox-item");

function showAllMusic(isCustom = false) {
  let pathname = window.location.pathname;
  let hash = window.location.hash;
  let result = pathname.split("/").pop() + hash;

  const actions = {
    "index.html#!": allMusic3,
    "index.html": allMusic3,
    "listening-practice-through-dictation-1.html#!": allMusic1,
    "listening-practice-through-dictation-1.html": allMusic1,
    "listening-practice-through-dictation-2.html#!": allMusic2,
    "listening-practice-through-dictation-2.html": allMusic2,
    "listening-practice-through-dictation-3.html#!": allMusic3,
    "listening-practice-through-dictation-3.html": allMusic3,
    "listening-practice-through-dictation-4.html#!": allMusic4,
    "listening-practice-through-dictation-4.html": allMusic4,
  };

  if (!isCustom) {
    return actions[result] ?? allMusic3;
  }

  return playAudio();
}

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].title;
  musicArtist.innerText = allMusic[indexNumb - 1].text;
  musicImg.src = "images/heatwaves.jpg";
  mainAudio.src = `${allMusic[indexNumb - 1].audioSrc}`;
}

function resetTitleText() {
  musicName.innerText = allMusic[0].title;
  musicArtist.innerText = allMusic[0].text;
}

function playMusic() {
  allMusic = playAudio();
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  allMusic = playAudio();
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  resetTabState('playingSong');
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

function nextMusic() {
  resetTabState('playingSong');
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

function playAudio() {
  const selectedCheckboxes = document.querySelectorAll(
    ".checkbox-item input:checked"
  );

  if (!selectedCheckboxes.length) {
    return allMusicFull;
  }
  
  return Array.from(selectedCheckboxes).map((item) => {
    return (
      allMusicFull.find((music) => music.id === item.id) ?? {
        id: "no data",
        title: "no data",
        text: "no data",
        audioSrc: "no data",
      }
    );
  });
}

playPauseBtn.addEventListener("click", () => {
  allMusic = playAudio();
  reLoadMusicList();
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
reLoadMusicList();
function reLoadMusicList() {
  ulTag.innerHTML = "";
  for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].title}</span>
                    <p>${allMusic[i].id}
                  </div>
                  <span id="${
                    allMusic[i].id
                  }" class="audio-duration">3:40</span>
                  <audio class="${allMusic[i].id}" src="${
      allMusic[i].audioSrc
    }"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].id}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].id}`);
    liAudioTag.addEventListener("loadeddata", () => {
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if (totalSec < 10) {
        totalSec = `0${totalSec}`;
      }
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
  }
}

function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  resetTabState('playingSong');
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
