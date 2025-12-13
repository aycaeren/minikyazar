document.addEventListener("DOMContentLoaded", () => {

    /* -------------------- GİZLİ İNPUT -------------------- */
    const hiddenInput = document.getElementById("hidden-input");
    hiddenInput.focus();
    document.addEventListener("touchstart", () => hiddenInput.focus());

    /* -------------------- OYUN ENTEGRASYONU -------------------- */
    let totalStars = Number(localStorage.getItem("totalStars")) || 0;
    let gameTickets = Number(localStorage.getItem("gameTickets")) || 0;

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

    function createStars(count) {
        const field = document.getElementById("starField");

        for (let i = 0; i < count; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.top = Math.random() * 100 + "vh";
            star.style.left = Math.random() * 100 + "vw";
            star.style.animationDelay = Math.random() * 4 + "s";

            field.appendChild(star);
        }
    }

    createStars(80);

    /* -------------------- TÜM CÜMLELER -------------------- */
    const allSentences = ["kedi", "elma", "araba", "top", "çanta", "ev", "balon", "masa",
        "kitap", "kalem", "defter", "sandalye", "bardak", "telefon", "çiçek", "bilgisayar",
        "uçak", "tren", "dolap", "pencere", "saat", "lamba", "kapı", "ayakkabı", "biberon",
        "domates", "portakal", "muz", "balık", "kuş", "köpek", "fare", "tavşan", "aslan",
        "kaplan", "fil", "zebra", "maymun", "ağaç", "çimen", "deniz", "göl", "nehir", "dağ",
        "tepe", "yol", "park", "bahçe", "mutfak", "top yuvarlandı", "Kedi uyuyor",
        "Ben elmayı yedim", "Okulda oyun oynuyoruz", "Ben resim çiziyorum", "Kuşlar uçar",
        "Tavşan zıplıyor", "Fil çok büyük", "Maymun ağaçta", "Deniz çok mavi",
        "Göl kenarında yürüyüş", "Nehir akar", "Dağ çok yüksek", "Tepe yeşil", "Yol uzundu",
        "Araba hızlı gidiyor", "Parkta oyun oynadık", "Bahçemize kedi girdi", "Domates kırmızı",
        "Portakal tatlı", "Muz sarı", "Balık yüzer", "Fare kaçtı", "Aslan kükredi", "Saat çalıyor",
        "Lamba yanıyor", "Çimen yeşil", "Ağaç büyüyor", "Kuş cıvıldıyor", "Deniz dalgalı",
        "Göl sakin", "Nehir temiz", "Diloş ve Deroş iyi ki var :)",
        "Diloş ve Deroş macerada", "Çaça'nın yeni oyuncağı", "Ayıcıklar dans ediyor",
        "Diloş ve Deroş şarkı söylüyor", "Çaça ile piknik zamanı", "Diloş'un sürprizi",
        "Deroş'un balonları", "Ayıcıkların doğum günü partisi", "Diloş ve Deroş ormanda keşif yapıyor",
        "Çaça'nın sihirli kitabı", "Ayıcıklar kış uykusuna hazırlanıyor",
        "Diloş ve Deroş deniz kenarında", "Çaça'nın yeni arkadaşı", "Ayıcıkların yaz tatili",
        "Diloş ve Deroş'un gizemli haritası", "Çaça ile uzay yolculuğu",
        "Ayıcıklar müzik grubu kuruyor", "Diloş ve Deroş'un sihirli macerası",
        "Çaça'nın renkli balonları", "Ayıcıklar bahar şenliğinde",
        "Diloş ve Deroş'un lezzetli tarifleri", "Çaça'nın eğlenceli oyunları",
        "Ayıcıklar karnavalda", "Diloş ve Deroş'un hayvanat bahçesi ziyareti",
        "Çaça ile denizaltı macerası", "Ayıcıkların kış festivali"
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
        starContainer.textContent = `⭐ ${totalStars} | 🎮 ${gameTickets}`;
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
                    applauseSound.play();

                    totalStars++; // ⭐ yıldız kazanıldı
                    localStorage.setItem("totalStars", totalStars);

                    updateCount();

                    // ⭐ HER YILDIZDA SOR
                    gameModal.classList.remove("hidden");
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

    /* -------------------- MODAL -------------------- */
    const gameModal = document.getElementById("gameModal");
    const playNowBtn = document.getElementById("playNowBtn");
    const laterBtn = document.getElementById("laterBtn");

    playNowBtn.onclick = () => {
        gameModal.classList.add("hidden");
        window.location.href = "oyun.html";
    };

    laterBtn.onclick = () => {
        gameModal.classList.add("hidden");
    };


    /* -------------------------------------------------------
              2. MOD – Sesle Kelime/Cümle Yazma
    ------------------------------------------------------- */
    let listenWord = "";

    const playSoundBtn = document.getElementById("playSoundBtn");
    const nextSoundBtn = document.getElementById("nextSoundBtn");
    const listenInput = document.getElementById("listenInput");
    const checkListenBtn = document.getElementById("checkListenBtn");
    const listenResult = document.getElementById("listenResult");


    /* --- DİNLE Butonu: Aynı şeyi tekrar okur --- */
    playSoundBtn.onclick = () => {
        if (!listenWord) {
            // Eğer daha önce kelime seçilmemişse yeni seç
            listenWord = allSentences[Math.floor(Math.random() * allSentences.length)];
        }

        listenResult.textContent = "";

        const utter = new SpeechSynthesisUtterance(listenWord);
        utter.lang = "tr-TR";

        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    };


    /* --- SONRAKİ Butonu: Yeni kelime seçip okur --- */
    nextSoundBtn.onclick = () => {
        listenInput.value = "";
        listenResult.textContent = "";

        // Yeni kelime/cümle seç
        listenWord = allSentences[Math.floor(Math.random() * allSentences.length)];

        const utter = new SpeechSynthesisUtterance(listenWord);
        utter.lang = "tr-TR";

        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    };


    /* --- CEVABI KONTROL ETME --- */
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
});