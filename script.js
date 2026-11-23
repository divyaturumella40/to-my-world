const songs = [
 {language:"English",title:"Until I Found You",artist:"Stephen Sanchez",file:"until-i-found-you.mp3"},
 {language:"English",title:"Heather",artist:"Conan Gray",file:"heather.mp3"},
 {language:"English",title:"Those Eyes",artist:"New West",file:"those-eyes.mp3"},
 {language:"Hindi",title:"Alvida Alvida",artist:"",file:"alvida-alvida.mp3"},
 {language:"Hindi",title:"Alfaaz",artist:"",file:"alfaaz.mp3"},
 {language:"Malayalam",title:"Yavanakathayil",artist:"",file:"yavanakathayil.mp3"},
 {language:"Malayalam",title:"Aaradhike",artist:"",file:"aaradhike.mp3"},
 {language:"Hindi",title:"Bol Na Halke Halke",artist:"",file:"bol-na-halke-halke.mp3"},
 {language:"Hindi",title:"Maula Mere",artist:"",file:"maula-mere.mp3"},
 {language:"Hindi",title:"Tose Naina Lage",artist:"",file:"tose-naina-lage.mp3"},
 {language:"English",title:"Young and Beautiful",artist:"Lana Del Rey",file:"young-and-beautiful.mp3"},
 {language:"English",title:"Say Yes to Heaven",artist:"Lana Del Rey",file:"say-yes-to-heaven.mp3"}
];

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const tabs = document.querySelectorAll(".filter-tabs button");
let filter = "All";
let current = 0;

function shownSongs() {
  return songs.map((song, index) => ({...song, index}))
    .filter(song => filter === "All" || song.language === filter);
}
function renderPlaylist() {
  playlist.innerHTML = "";
  shownSongs().forEach(song => {
    const row = document.createElement("button");
    row.className = "track" + (song.index === current ? " active" : "");
    row.type = "button";
    const name = document.createElement("span");
    name.textContent = song.title;
    const tag = document.createElement("small");
    tag.textContent = song.language.toUpperCase();
    row.append(name, tag);
    row.addEventListener("click", () => selectSong(song.index, true));
    playlist.appendChild(row);
  });
  document.getElementById("track-count").textContent = `${shownSongs().length} SONGS`;
}
function renderTabs() {
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.language === filter));
}
function selectSong(index, autoplay = false) {
  current = (index + songs.length) % songs.length;
  const song = songs[current];
  document.getElementById("song-title").textContent = song.title;
  document.getElementById("song-artist").textContent = song.artist || song.language;
  audio.pause();
  audio.src = `assets/music/${song.file}`;
  audio.load();
  playBtn.textContent = "▶";
  document.getElementById("seek").value = 0;
  document.getElementById("elapsed").textContent = "0:00";
  document.getElementById("duration").textContent = "0:00";
  if (filter !== "All" && filter !== song.language) filter = song.language;
  renderTabs();
  renderPlaylist();
  if (autoplay) audio.play().catch(() => {});
}
function togglePlay() {
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}
function formatTime(value) {
  return Number.isFinite(value)
    ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`
    : "0:00";
}

playBtn.addEventListener("click", togglePlay);
document.getElementById("next").addEventListener("click", () => selectSong(current + 1, true));
document.getElementById("prev").addEventListener("click", () => selectSong(current - 1, true));
tabs.forEach(tab => tab.addEventListener("click", () => {
  filter = tab.dataset.language;
  renderTabs();
  renderPlaylist();
  const first = songs.findIndex(song => filter === "All" || song.language === filter);
  if (first >= 0) selectSong(first, false);
}));
document.getElementById("volume").addEventListener("input", event => audio.volume = Number(event.target.value));
document.getElementById("seek").addEventListener("input", event => {
  if (audio.duration) audio.currentTime = Number(event.target.value) / 100 * audio.duration;
});
audio.volume = 0.7;
audio.addEventListener("play", () => playBtn.textContent = "Ⅱ");
audio.addEventListener("pause", () => playBtn.textContent = "▶");
audio.addEventListener("ended", () => selectSong(current + 1, true));
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  document.getElementById("seek").value = audio.currentTime / audio.duration * 100;
  document.getElementById("elapsed").textContent = formatTime(audio.currentTime);
  document.getElementById("duration").textContent = formatTime(audio.duration);
});
document.querySelectorAll(".thought-card").forEach(card => card.addEventListener("click", () => {
  const open = card.classList.contains("open");
  document.querySelectorAll(".thought-card").forEach(item => {
    item.classList.remove("open");
    item.querySelector("b").textContent = "＋";
  });
  if (!open) {
    card.classList.add("open");
    card.querySelector("b").textContent = "−";
  }
}));
const gate = document.getElementById("entry-gate");
const feedback = document.getElementById("gate-feedback");
document.querySelectorAll(".emoji-choice").forEach(choice => choice.addEventListener("click", () => {
 if (choice.dataset.answer === "💗") {
  feedback.textContent = "You got it! Welcome to my world ♡";
  gate.classList.add("gate-open");
  window.setTimeout(() => gate.remove(), 850);
 } else {
  feedback.textContent = "Not that one… try again ♡";
  choice.classList.add("wrong");
  window.setTimeout(() => choice.classList.remove("wrong"), 400);
 }
}));
renderTabs();
renderPlaylist();
selectSong(0, false);
