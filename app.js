/* -------------------- GİZLİ İNPUT -------------------- */
const hiddenInput = document.getElementById("hidden-input");
hiddenInput.focus();
document.addEventListener("touchstart", () => hiddenInput.focus());


/* -------------------- MOD SEÇİMİ -------------------- */
const mode1Btn = document.getElementById("mode1Btn");
const mode2Btn = document.getElementById("mode2Btn");

const mode1 = document.getElementById("mode1");
const mode2 = document.getElementById("mode2");

mode1Btn.onclick = () => {
    mode1.classList.remove("hidden");
    mode2.classList.add("hidden");
    hiddenInput.focus();
};

mode2Btn.onclick = () => {
    mode2.classList.remove("hidden");
    mode1.classList.add("hidden");
    document.getElementById("listenInput").focus();
};



/* -------------------- TÜM CÜMLELER -------------------- */
const allSentences = [ "kedi","elma","araba","top","çanta","ev","balon","masa",
"kitap","kalem","defter","sandalye","bardak","telefon","çiçek","bilgisayar",
"uçak","tren","dolap","pencere","saat","lamba","kapı","ayakkabı","biberon",
"domates","portakal","muz","balık","kuş","köpek","fare","tavşan","aslan",
"kaplan","fil","zebra","maymun","ağaç","çimen","deniz","göl","nehir","dağ",
"tepe","yol","park","bahçe","mutfak","top yuvarlandı","Kedi uyuyor",
"Ben elmayı yedim","Okulda oyun oynuyoruz","Ben resim çiziyorum","Kuşlar uçar",
"Tavşan zıplıyor","Fil çok büyük","Maymun ağaçta","Deniz çok mavi",
"Göl kenarında yürüyüş","Nehir akar","Dağ çok yüksek","Tepe yeşil","Yol uzundu",
"Araba hızlı gidiyor","Parkta oyun oynadık","Bahçemize kedi girdi","Domates kırmızı",
"Portakal tatlı","Muz sarı","Balık yüzer","Fare kaçtı","Aslan kükredi","Saat çalıyor",
"Lamba yanıyor","Çimen yeşil","Ağaç büyüyor","Kuş cıvıldıyor","Deniz dalgalı",
"Göl sakin","Nehir temiz","Diloş ve Deroş iyi ki var :)",
"Diloş ve Deroş macerada","Çaça'nın yeni oyuncağı","Ayıcıklar dans ediyor",
"Diloş ve Deroş şarkı söylüyor","Çaça ile piknik zamanı","Diloş'un sürprizi",
"Deroş'un balonları","Ayıcıkların doğum günü partisi","Diloş ve Deroş ormanda keşif yapıyor",
"Çaça'nın sihirli kitabı","Ayıcıklar kış uykusuna hazırlanıyor",
"Diloş ve Deroş deniz kenarında","Çaça'nın yeni arkadaşı","Ayıcıkların yaz tatili",
"Diloş ve Deroş'un gizemli haritası","Çaça ile uzay yolculuğu",
"Ayıcıklar müzik grubu kuruyor","Diloş ve Deroş'un sihirli macerası",
"Çaça'nın renkli balonları","Ayıcıklar bahar şenliğinde",
"Diloş ve Deroş'un lezzetli tarifleri","Çaça'nın eğlenceli oyunları",
"Ayıcıklar karnavalda","Diloş ve Deroş'un hayvanat bahçesi ziyareti",
"Çaça ile denizaltı macerası","Ayıcıkların kış festivali"
];


/* -------------------------------------------------------
                 1. MOD – Yazma Oyunu
------------------------------------------------------- */
const wordContainer = document.getElementById("word-container");
const sentenceList = document.getElementById("sentence-list");
const starContainer = document.getElementById("star-container");
const countContainer = document.getElementById("count-container");

const wrongSound = new Audio('assets/wrong.mp3'); wrongSound.volume = 0.4;
const applauseSound = new Audio('assets/applause.mp3'); applauseSound.volume = 0.6;
const correctSound = new Audio('assets/correct.mp3'); correctSound.volume = 0.4;


let currentSentence = "";
let letterIndex = 0;
let completedCount = 0;
let stars = 0;

allSentences.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    li.onclick = () => { currentSentence = s; loadSentence(); };
    sentenceList.appendChild(li);
});

currentSentence = allSentences[0];
loadSentence();
updateCount();

function loadSentence() {
    wordContainer.innerHTML = "";

    for (let char of currentSentence) {

        // BOŞLUK ÖZEL SPAN OLARAK EKLENİYOR
        if (char === " ") {
            const sp = document.createElement("span");
            sp.classList.add("space");
            sp.textContent = " "; 
            wordContainer.appendChild(sp);
            continue;
        }

        // NORMAL HARFLER
        const span = document.createElement("span");
        span.textContent = char;
        wordContainer.appendChild(span);
    }

    letterIndex = 0;
}


function updateCount() {
    countContainer.textContent = `Tamamlanan: ${completedCount}`;
    starContainer.textContent = `⭐: ${stars}`;
}

document.addEventListener("keydown", e => {
    if (mode1.classList.contains("hidden")) return;

    const spans = wordContainer.querySelectorAll("span");
    const key = e.key;

    if (letterIndex >= currentSentence.length) return;

    // SPACE
    if (currentSentence[letterIndex] === " " && key === " ") {
        spans[letterIndex].classList.add("correct");
        letterIndex++;
        e.preventDefault();
        return;
    }

    // DOĞRU HARF
    if (key.toLowerCase() === currentSentence[letterIndex].toLowerCase()) {
        spans[letterIndex].classList.add("correct");
        letterIndex++;

        if (letterIndex === currentSentence.length) {
            const utter = new SpeechSynthesisUtterance(currentSentence);
            utter.lang = "tr-TR";
            speechSynthesis.speak(utter);

            completedCount++;

            if (completedCount % 5 === 0) {
                stars++;
                applauseSound.play();
            }

            updateCount();

            const nextIndex = Math.floor(Math.random() * allSentences.length);
            currentSentence = allSentences[nextIndex];
            loadSentence();
        }
    } 
    else {
        wrongSound.play();
    }
});



/* -------------------------------------------------------
          2. MOD – Sesle Kelime/Cümle Yazma
------------------------------------------------------- */
let listenWord = "";

const playSoundBtn = document.getElementById("playSoundBtn");
const listenInput = document.getElementById("listenInput");
const checkListenBtn = document.getElementById("checkListenBtn");
const listenResult = document.getElementById("listenResult");

playSoundBtn.onclick = () => {
    listenInput.value = "";
    listenResult.textContent = "";

    listenWord = allSentences[Math.floor(Math.random() * allSentences.length)];

    const utter = new SpeechSynthesisUtterance(listenWord);
    utter.lang = "tr-TR";
    speechSynthesis.speak(utter);
};

checkListenBtn.onclick = () => {
    const user = listenInput.value.trim().toLowerCase();

    if (user === listenWord.toLowerCase()) {
        listenResult.style.color = "green";
        listenResult.textContent = "✔ Harikasınn :)";
        correctSound.play();
    } else {
        listenResult.style.color = "red";
        listenResult.textContent = "❌ Doğrusu: " + listenWord;
        wrongSound.play();
    }
};
