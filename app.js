const hiddenInput = document.getElementById("hidden-input");
hiddenInput.focus();

document.addEventListener("touchstart", () => {
    hiddenInput.focus();
});

const allSentences = [
    "kedi", "elma", "araba", "top", "çanta", "ev", "balon", "masa", "kitap", "kalem",
    "defter", "sandalye", "bardak", "telefon", "çiçek", "bilgisayar", "uçak", "tren", "dolap", "pencere",
    "saat", "lamba", "kapı", "ayakkabı", "biberon", "domates", "portakal", "muz", "balık", "kuş",
    "köpek", "fare", "tavşan", "aslan", "kaplan", "fil", "zebra", "maymun", "ağaç", "çimen",
    "deniz", "göl", "nehir", "dağ", "tepe", "yol", "park", "bahçe", "mutfak", "top yuvarlandı",
    "Kedi uyuyor", "Ben elmayı yedim", "Okulda oyun oynuyoruz",
    "Ben resim çiziyorum", "Kuşlar uçar",
    "Tavşan zıplıyor", "Fil çok büyük", "Maymun ağaçta", "Deniz çok mavi",
    "Göl kenarında yürüyüş", "Nehir akar", "Dağ çok yüksek", "Tepe yeşil", "Yol uzundu",
    "Araba hızlı gidiyor", "Parkta oyun oynadık", "Bahçemize kedi girdi",
    "Domates kırmızı", "Portakal tatlı",
    "Muz sarı", "Balık yüzer", "Fare kaçtı", "Aslan kükredi", "Saat çalıyor", "Lamba yanıyor",
    "Top yuvarlandı", "Çimen yeşil", "Ağaç büyüyor", "Kuş cıvıldıyor", "Deniz dalgalı",
    "Göl sakin", "Nehir temiz", "Diloş ve Deroş iyi ki var :)",
    "Diloş ve Deroş macerada", "Çaça'nın yeni oyuncağı", "Ayıcıklar dans ediyor", "Diloş ve Deroş şarkı söylüyor",
    "Çaça ile piknik zamanı", "Diloş'un sürprizi", "Deroş'un balonları", "Ayıcıkların doğum günü partisi",
    "Diloş ve Deroş ormanda keşif yapıyor", "Çaça'nın sihirli kitabı", "Ayıcıklar kış uykusuna hazırlanıyor",
    "Diloş ve Deroş deniz kenarında", "Çaça'nın yeni arkadaşı", "Ayıcıkların yaz tatili",
    "Diloş ve Deroş'un gizemli haritası",
    "Çaça ile uzay yolculuğu", "Ayıcıklar müzik grubu kuruyor", "Diloş ve Deroş'un sihirli macerası",
    "Çaça'nın renkli balonları", "Ayıcıklar bahar şenliğinde", "Diloş ve Deroş'un lezzetli tarifleri",
    "Çaça'nın eğlenceli oyunları", "Ayıcıklar karnavalda", "Diloş ve Deroş'un hayvanat bahçesi ziyareti",
    "Çaça ile denizaltı macerası", "Ayıcıkların kış festivali"
];

const wordContainer = document.getElementById("word-container");
const sentenceList = document.getElementById("sentence-list");
const starContainer = document.getElementById("star-container");
const countContainer = document.getElementById("count-container");

const wrongSound = new Audio('assets/wrong.mp3'); wrongSound.volume = 0.4;
const applauseSound = new Audio('assets/applause.mp3'); applauseSound.volume = 0.6;

let currentSentence = ""; // Şu anki kelime/cümle
let letterIndex = 0; // Şu anki harfin indexi
let completedCount = 0; // Tamamlanan kelime/cümle sayısı
let stars = 0; // Toplanan yıldız sayısı

// Listeyi doldur
allSentences.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    li.addEventListener("click", () => {
        currentSentence = s;
        loadSentence();
    });
    sentenceList.appendChild(li);
});

// Başlangıçta ilk kelime
currentSentence = allSentences[0];
loadSentence();
updateCount();

function loadSentence() {
    wordContainer.innerHTML = "";
    for (let char of currentSentence) {
        const span = document.createElement("span");
        span.textContent = char;
        if (char === " ") span.classList.add("space");
        wordContainer.appendChild(span);
    }
    letterIndex = 0;
}

function updateCount() {
    countContainer.textContent = `Tamamlanan: ${completedCount}`;
    starContainer.textContent = `⭐: ${stars}`;
}

document.addEventListener("keydown", e => {
    const spans = wordContainer.querySelectorAll("span");
    const key = e.key;

    if (letterIndex >= currentSentence.length) return;

    // Space tuşu scrollu engellemek için preventDefault
    if (currentSentence[letterIndex] === " " && key === " ") {
        spans[letterIndex].classList.add("correct");
        letterIndex++;
        e.preventDefault();
        return;
    }

    if (key.toLowerCase() === currentSentence[letterIndex].toLowerCase()) {
        spans[letterIndex].classList.add("correct");
        letterIndex++;

        if (letterIndex === currentSentence.length) {
            // Doğru kelime/cümle sesli okunuyor
            const utter = new SpeechSynthesisUtterance(currentSentence);
            utter.lang = "tr-TR";
            window.speechSynthesis.speak(utter);

            completedCount++;

            // Her 5 kelime/cümlede yıldız + applause.mp3
            if (completedCount % 5 === 0) {
                stars++;
                applauseSound.play();
            }

            updateCount();

            // Yeni kelime/cümle rastgele
            const nextIndex = Math.floor(Math.random() * allSentences.length);
            currentSentence = allSentences[nextIndex];
            loadSentence();
        }
    } else {
        wrongSound.play();
    }
});
