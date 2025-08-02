const fs = require('fs');
const path = require('path');
const request = require('request');

console.log('🚀 Building full Quran Platform for GitHub Pages...\n');

// Create docs directory for GitHub Pages
if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
    console.log('✅ Created docs directory');
}

// Copy all static assets to docs folder
const publicFiles = [
    'style.css',
    'bootstrap.min.css', 
    'bootstrap.min.js',
    'Al Qalam Quran.ttf',
    'Al Majeed Quranic Font_shiped.ttf'
];

publicFiles.forEach(file => {
    if (fs.existsSync(`public/${file}`)) {
        fs.copyFileSync(`public/${file}`, `docs/${file}`);
        console.log(`✅ Copied ${file}`);
    }
});

// Copy images folder
if (fs.existsSync('public/images')) {
    if (!fs.existsSync('docs/images')) {
        fs.mkdirSync('docs/images');
    }
    fs.readdirSync('public/images').forEach(file => {
        fs.copyFileSync(`public/images/${file}`, `docs/images/${file}`);
    });
    console.log('✅ Copied images folder');
}

// Create the main HTML template with all functionality
const createFullHTML = () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="منصة القرآن الكريم - تطبيق حديث لقراءة واستكشاف القرآن الكريم مع التلاوة الصوتية والبحث المتقدم">
    <meta name="keywords" content="القرآن, القرآن الكريم, قرآن, إسلام, تلاوة, تفسير, البحث في القرآن">
    <meta name="author" content="Yassin Moustafa">
    <title>القرآن الكريم - منصة حديثة لقراءة القرآن</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yassin287.github.io/quraan/">
    <meta property="og:title" content="القرآن الكريم - منصة حديثة لقراءة القرآن">
    <meta property="og:description" content="تطبيق حديث وجميل لقراءة واستكشاف القرآن الكريم مع التلاوة الصوتية والبحث المتقدم">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://yassin287.github.io/quraan/">
    <meta property="twitter:title" content="القرآن الكريم - منصة حديثة لقراءة القرآن">
    <meta property="twitter:description" content="تطبيق حديث وجميل لقراءة واستكشاف القرآن الكريم مع التلاوة الصوتية والبحث المتقدم">
    
    <!-- Stylesheets -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/hd-quran-book-black-icon-transparent-background-116370457481jmbswlvix-removebg-preview.png">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-xxl">
            <a class="navbar-brand d-flex" href="#" onclick="showHome()">
                <i class="fas fa-mosque" style="margin-left: 10px; font-size: 1.8rem;"></i>
                القرآن الكريم
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item me-3">
                        <a class="nav-link active" href="#" onclick="showHome()">الرئيسية</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link" href="#" onclick="showSurahs()">السور</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link" href="#" onclick="showSearch()">البحث</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link" href="#" onclick="showRecite()">التلاوة التفاعلية</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link" href="#" onclick="showPrayerTimes()">أوقات الصلاة</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content Container -->
    <div id="mainContent">
        <!-- Home Page Content will be loaded here -->
    </div>

    <!-- Footer -->
    <footer class="py-3 mt-5">
        <div class="container text-center">
            <p>&copy; Yassin Moustafa 2025</p>
            <p style="color: #b8860b; font-family: 'Quranic'; font-size: 1.1rem; margin-top: 15px;">
                "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"
            </p>
            <p style="color: #ffffff; font-size: 0.9rem;">
                "And We send down of the Quran that which is healing and mercy for the believers" - Quran 17:82
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Global variables
        let allSurahs = [];
        let currentAyahAudio = null;
        
        // API base URL
        const API_BASE = 'https://api.alquran.cloud/v1';
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            loadSurahs();
            showHome();
        });
        
        // Load all surahs data
        async function loadSurahs() {
            try {
                const response = await fetch(\`\${API_BASE}/surah\`);
                const data = await response.json();
                allSurahs = data.data;
                console.log('✅ Loaded', allSurahs.length, 'surahs');
            } catch (error) {
                console.error('Error loading surahs:', error);
            }
        }
        
        // Navigation functions
        function showHome() {
            updateActiveNav('الرئيسية');
            loadRandomAyah();
        }
        
        function showSurahs() {
            updateActiveNav('السور');
            renderSurahsList();
        }
        
        function showSearch() {
            updateActiveNav('البحث');
            renderSearchPage();
        }
        
        function updateActiveNav(activeItem) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.textContent.includes(activeItem)) {
                    link.classList.add('active');
                }
            });
        }
        
        // Load random ayah for home page
        async function loadRandomAyah() {
            const randomAyah = Math.floor(Math.random() * 6236) + 1;
            
            const content = \`
            <div class="container my-5">
                <main class="container-fluid d-flex justify-content-center align-items-center mb-5">
                    <div class="container ayah-container d-flex justify-content-center flex-column">
                        <div class="text-center mb-4">
                            <h1 style="color: #b8860b; font-family: 'Quranic'; margin-bottom: 20px;">آية اليوم</h1>
                            <div id="ayahContent">
                                <div class="loading text-center">
                                    <i class="fas fa-spinner fa-spin fa-2x" style="color: #b8860b;"></i>
                                    <p style="color: #b8860b; margin-top: 15px;">جاري تحميل الآية...</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-4">
                            <button class="btn btn-lg" onclick="loadRandomAyah()" style="background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%); color: #000000; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; margin: 10px;">
                                <i class="fas fa-refresh"></i> آية جديدة
                            </button>
                            <button class="btn btn-lg" onclick="showSurahs()" style="background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #b8860b; border: 2px solid #b8860b; padding: 15px 30px; border-radius: 25px; font-weight: bold; margin: 10px;">
                                <i class="fas fa-book"></i> تصفح السور
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            
            try {
                const response = await fetch(\`\${API_BASE}/ayah/\${randomAyah}/editions/quran-uthmani,en.asad,ar.muyassar,ar.minshawi\`);
                const data = await response.json();
                
                const ayahText = data.data[0].text;
                const surahName = data.data[0].surah.name;
                const ayahNumber = data.data[0].numberInSurah;
                const juz = data.data[0].juz;
                const page = data.data[0].page;
                const translation = data.data[1].text;
                const tafsir = data.data[2].text;
                const audio = data.data[3].audio;
                
                const ayahHTML = \`
                    <div class="ayah-display text-center">
                        <p class="fs-1 mb-4" style="font-family: 'Quranic'; color: #ffffff; line-height: 2.2; cursor: pointer;" onclick="playAyah('\${audio}', this)">
                            \${ayahText}
                        </p>
                        <div class="ayah-info mb-4">
                            <span class="badge" style="background: #b8860b; color: #000; font-size: 1rem; margin: 5px; padding: 8px 15px;">
                                \${surahName}
                            </span>
                            <span class="badge" style="background: #2d2d2d; color: #b8860b; border: 1px solid #b8860b; font-size: 1rem; margin: 5px; padding: 8px 15px;">
                                آية \${ayahNumber}
                            </span>
                            <span class="badge" style="background: #2d2d2d; color: #b8860b; border: 1px solid #b8860b; font-size: 1rem; margin: 5px; padding: 8px 15px;">
                                جزء \${juz}
                            </span>
                            <span class="badge" style="background: #2d2d2d; color: #b8860b; border: 1px solid #b8860b; font-size: 1rem; margin: 5px; padding: 8px 15px;">
                                صفحة \${page}
                            </span>
                        </div>
                        <div class="translation mb-3">
                            <h5 style="color: #b8860b;">English Translation:</h5>
                            <p style="color: #ffffff; font-size: 1.1rem; font-style: italic;">"\${translation}"</p>
                        </div>
                        <div class="tafsir">
                            <h5 style="color: #b8860b;">التفسير المیسر:</h5>
                            <p style="color: #ffffff; font-size: 1rem; text-align: justify;">
                                \${tafsir}
                            </p>
                        </div>
                        <audio id="ayahAudio" style="display: none;"></audio>
                    </div>
                \`;
                
                document.getElementById('ayahContent').innerHTML = ayahHTML;
            } catch (error) {
                console.error('Error loading ayah:', error);
                document.getElementById('ayahContent').innerHTML = \`
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        حدث خطأ في تحميل الآية. يرجى المحاولة مرة أخرى.
                    </div>
                \`;
            }
        }
        
        // Play ayah audio
        function playAyah(audioUrl, element) {
            if (currentAyahAudio) {
                currentAyahAudio.pause();
            }
            
            const audio = document.getElementById('ayahAudio');
            audio.src = audioUrl;
            currentAyahAudio = audio;
            
            // Visual feedback
            document.querySelectorAll('.ayah-playing').forEach(el => el.classList.remove('ayah-playing'));
            element.classList.add('ayah-playing');
            
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            
            audio.onended = () => {
                element.classList.remove('ayah-playing');
            };
        }
        
        // Render surahs list
        function renderSurahsList() {
            const content = \`
            <div class="container my-5">
                <div class="row justify-content-center">
                    <div class="col-12">
                        <h1 class="text-center mb-4" style="color: #ffd700; font-family: 'Quranic';">سور القرآن الكريم</h1>
                        
                        <!-- Search and Filter Controls -->
                        <div class="search-filter-controls mb-4">
                            <div class="row align-items-center">
                                <div class="col-lg-6 col-md-8 col-sm-12 mb-3">
                                    <div class="search-input-container">
                                        <input type="text" id="surahSearch" class="surah-search-box" placeholder="ابحث عن السورة..." autocomplete="off">
                                        <i class="fas fa-search search-icon"></i>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-4 col-sm-12 mb-3">
                                    <div class="filter-buttons">
                                        <button class="filter-btn active" data-filter="all">
                                            <i class="fas fa-list"></i> جميع السور
                                        </button>
                                        <button class="filter-btn" data-filter="Meccan">
                                            <i class="fas fa-kaaba"></i> مكية
                                        </button>
                                        <button class="filter-btn" data-filter="Medinan">
                                            <i class="fas fa-mosque"></i> مدنية
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="search-results-info">
                                <span id="resultsCount">عرض جميع السور (114)</span>
                            </div>
                        </div>
                        
                        <div class="surah-grid" id="surahGrid">
                            \${renderSurahCards()}
                        </div>
                        
                        <!-- No Results Message -->
                        <div id="noResults" class="no-results" style="display: none;">
                            <div class="text-center">
                                <i class="fas fa-search" style="font-size: 3rem; color: #b8860b; margin-bottom: 20px;"></i>
                                <h3 style="color: #b8860b;">لم يتم العثور على نتائج</h3>
                                <p style="color: #ffffff;">جرب البحث بكلمات مختلفة أو امسح مربع البحث لعرض جميع السور</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            initializeSurahSearch();
        }
        
        // Render surah cards
        function renderSurahCards() {
            return allSurahs.map(surah => \`
                <div class="surah-card" onclick="loadSurah(\${surah.number})" 
                     data-name="\${surah.name}" 
                     data-english="\${surah.englishName}" 
                     data-type="\${surah.revelationType}">
                    <div class="surah-number">\${surah.number}</div>
                    <div class="surah-name">\${surah.name}</div>
                    <div class="surah-info">
                        <span class="surah-type">
                            \${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                        </span>
                        <span class="surah-verses">\${surah.numberOfAyahs} آية</span>
                    </div>
                    <div class="surah-info">
                        <span style="color: #ffffff; font-size: 0.9rem;">
                            \${surah.englishName}
                        </span>
                    </div>
                </div>
            \`).join('');
        }
        
        // Initialize surah search functionality
        function initializeSurahSearch() {
            const searchInput = document.getElementById('surahSearch');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const resultsCount = document.getElementById('resultsCount');
            const noResults = document.getElementById('noResults');
            const surahGrid = document.getElementById('surahGrid');
            const allSurahCards = Array.from(document.querySelectorAll('.surah-card'));
            
            let currentFilter = 'all';
            let currentSearch = '';
            
            // Arabic normalization function
            function normalizeArabic(text) {
                return text.replace(/[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u06EF-\\u06FF]/g, '');
            }
            
            // Search functionality
            searchInput.addEventListener('input', function() {
                currentSearch = normalizeArabic(this.value.trim().toLowerCase());
                filterAndSearch();
            });
            
            // Filter functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.getAttribute('data-filter');
                    filterAndSearch();
                });
            });
            
            function filterAndSearch() {
                let visibleCount = 0;
                let filteredSurahs = allSurahCards;
                
                // Apply filter
                if (currentFilter !== 'all') {
                    filteredSurahs = allSurahCards.filter(surah => 
                        surah.getAttribute('data-type') === currentFilter
                    );
                }
                
                // Apply search
                if (currentSearch) {
                    filteredSurahs = filteredSurahs.filter(surah => {
                        const arabicName = normalizeArabic(surah.getAttribute('data-name').toLowerCase());
                        const englishName = surah.getAttribute('data-english').toLowerCase();
                        return arabicName.includes(currentSearch) || englishName.includes(currentSearch);
                    });
                }
                
                // Show/hide surahs
                allSurahCards.forEach(surah => {
                    if (filteredSurahs.includes(surah)) {
                        surah.style.display = 'block';
                        visibleCount++;
                    } else {
                        surah.style.display = 'none';
                    }
                });
                
                // Update results count
                updateResultsCount(visibleCount);
                
                // Show/hide no results message
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                    surahGrid.style.display = 'none';
                } else {
                    noResults.style.display = 'none';
                    surahGrid.style.display = 'grid';
                }
            }
            
            function updateResultsCount(count) {
                let message = '';
                
                if (currentFilter === 'all' && !currentSearch) {
                    message = 'عرض جميع السور (114)';
                } else if (currentFilter !== 'all' && !currentSearch) {
                    const filterName = currentFilter === 'Meccan' ? 'المكية' : 'المدنية';
                    message = \`عرض السور \${filterName} (\${count})\`;
                } else if (currentSearch && currentFilter === 'all') {
                    message = \`نتائج البحث: \${count} سورة\`;
                } else {
                    const filterName = currentFilter === 'Meccan' ? 'المكية' : 'المدنية';
                    message = \`نتائج البحث في السور \${filterName}: \${count} سورة\`;
                }
                
                resultsCount.textContent = message;
            }
        }
        
        // Load individual surah
        async function loadSurah(surahNumber) {
            updateActiveNav('');
            
            const content = \`
            <div class="container my-5">
                <main class="container-fluid d-flex justify-content-center align-items-center mb-5">
                    <div class="container ayah-container d-flex justify-content-center flex-column">
                        <div class="loading text-center">
                            <i class="fas fa-spinner fa-spin fa-2x" style="color: #b8860b;"></i>
                            <p style="color: #b8860b; margin-top: 15px;">جاري تحميل السورة...</p>
                        </div>
                    </div>
                </main>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            
            try {
                const response = await fetch(\`\${API_BASE}/surah/\${surahNumber}/editions/quran-uthmani,ar.muyassar,ar.minshawi\`);
                const data = await response.json();
                
                const surahData = data.data[0];
                const tafsirData = data.data[1];
                const audioData = data.data[2];
                
                renderSurahContent(surahData, tafsirData, audioData);
            } catch (error) {
                console.error('Error loading surah:', error);
                document.getElementById('mainContent').innerHTML = \`
                    <div class="container my-5">
                        <div class="alert alert-danger text-center">
                            <i class="fas fa-exclamation-triangle"></i>
                            حدث خطأ في تحميل السورة. يرجى المحاولة مرة أخرى.
                            <br><br>
                            <button class="btn btn-primary" onclick="showSurahs()">العودة إلى قائمة السور</button>
                        </div>
                    </div>
                \`;
            }
        }
        
        // Render surah content
        function renderSurahContent(surahData, tafsirData, audioData) {
            // Check if surah is Al-Fatiha (1) or At-Tawbah (9) - different Bismillah handling
            const showBismillah = surahData.number !== 9; // At-Tawbah doesn't have Bismillah
            
            const content = \`
            <div class="container my-5">
                <main class="container-fluid d-flex justify-content-center align-items-center mb-5">
                    <div class="container ayah-container d-flex justify-content-center flex-column">
                        <div class="text-center mb-4">
                            <button class="btn btn-outline-warning mb-3" onclick="showSurahs()">
                                <i class="fas fa-arrow-right"></i> العودة إلى قائمة السور
                            </button>
                        </div>
                        
                        <div class="top-container d-flex justify-content-between align-items-center mb-4">
                            <p class="fs-3">القارئ الشيخ: محمد صديق المنشاوي</p>
                            <div class="btns d-flex">
                                <i id="pause" class="fa-solid fa-pause" onclick="pauseAudio()"></i>
                                <i id="player" class="fa-solid fa-play" onclick="playAudio()"></i>
                            </div>
                        </div>
                        
                        <audio id="surahAudio" class="d-none" controls></audio>
                        
                        \${showBismillah ? \`
                        <p class="fs-1 text-center ayat mb-4" onclick="playBasmala()" id="ayah-0">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                        \` : ''}
                        
                        <div class="ayah-content fs-1" style="line-height: 2.5;">
                            \${renderAyahs(surahData.ayahs, audioData.ayahs, surahData.number)}
                        </div>
                        
                        <div class="ayah-prop fs-4 text-center mt-4">
                            <span>\${surahData.name}</span> 
                            <span>الجزء \${surahData.ayahs[0].juz}</span>
                            <span>سورة رقم \${surahData.number}</span>
                            <span>عدد آياتها \${surahData.numberOfAyahs}</span>
                        </div>
                        
                        <span class="tafseer-btn btn mt-3 py-2" onclick="toggleTafsir()">عرض التفسير</span>
                        <div class="tafsir-container" id="tafsirContainer">
                            \${renderTafsir(tafsirData.ayahs)}
                            <span>التفسير المیسر</span>
                        </div>
                    </div>
                </main>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            initializeSurahAudio(audioData.ayahs, surahData.number);
        }
        
        // Render ayahs
        function renderAyahs(ayahs, audioAyahs, surahNumber) {
            return ayahs.map((ayah, index) => {
                let ayahText = ayah.text;
                
                // Remove Bismillah from the first ayah if it's not Al-Fatiha or At-Tawbah
                if (index === 0 && surahNumber !== 1 && surahNumber !== 9) {
                    ayahText = ayahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                }
                
                const audioUrl = audioAyahs[index]?.audio || '';
                
                return \`
                    <span class="ayat" onclick="playAyahInSurah('\${audioUrl}', this)" id="ayah-\${ayah.numberInSurah}">
                        \${ayahText}
                    </span>
                    <span class="fs-4" style="color: #b8860b; margin: 0 10px;"> (\${ayah.numberInSurah}) </span>
                \`;
            }).join('');
        }
        
        // Render tafsir
        function renderTafsir(tafsirAyahs) {
            return tafsirAyahs.map((ayah, index) => 
                \`<p class="">\${ayah.text} (\${index + 1})</p>\`
            ).join('');
        }
        
        // Initialize surah audio functionality
        function initializeSurahAudio(audioAyahs, surahNumber) {
            window.currentAudioArray = audioAyahs.map(ayah => ayah.audio);
            window.currentAudioIndex = -1; // Start before first ayah
            window.isPlaying = false;
            window.currentSurahNumber = surahNumber;
            
            const audio = document.getElementById('surahAudio');
            audio.src = "https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3";
            
            audio.onended = function() {
                // Remove active class from current ayah
                if (window.currentAudioIndex === -1) {
                    const bismillah = document.getElementById('ayah-0');
                    if (bismillah) bismillah.classList.remove('active');
                } else {
                    const currentAyah = document.getElementById(\`ayah-\${window.currentAudioIndex + 1}\`);
                    if (currentAyah) currentAyah.classList.remove('active');
                }
                
                // Move to next ayah
                window.currentAudioIndex++;
                
                // Check if there are more ayahs to play
                if (window.currentAudioIndex < window.currentAudioArray.length) {
                    audio.src = window.currentAudioArray[window.currentAudioIndex];
                    audio.play();
                    
                    // Highlight next ayah
                    const nextAyah = document.getElementById(\`ayah-\${window.currentAudioIndex + 1}\`);
                    if (nextAyah) nextAyah.classList.add('active');
                } else {
                    // End of surah reached
                    window.isPlaying = false;
                    const playBtn = document.getElementById('player');
                    playBtn.classList.remove('fa-stop');
                    playBtn.classList.add('fa-play');
                }
            };
        }
        
        // Audio control functions
        function playBasmala() {
            if (window.currentSurahNumber === 9) return; // At-Tawbah has no Bismillah
            
            const audio = document.getElementById('surahAudio');
            window.currentAudioIndex = -1;
            window.isPlaying = true;
            audio.src = "https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3";
            audio.play();
            
            document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
            document.getElementById('ayah-0').classList.add('active');
            
            const playBtn = document.getElementById('player');
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-stop');
        }
        
        function playAyahInSurah(audioUrl, element) {
            const audio = document.getElementById('surahAudio');
            const ayahId = element.id;
            const ayahNumber = parseInt(ayahId.replace('ayah-', ''));
            
            window.currentAudioIndex = ayahNumber - 2; // Adjust for array indexing
            window.isPlaying = true;
            audio.src = audioUrl;
            audio.play();
            
            document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
            document.getElementById('ayah-0').classList.remove('active');
            element.classList.add('active');
            
            const playBtn = document.getElementById('player');
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-stop');
        }
        
        function playAudio() {
            const audio = document.getElementById('surahAudio');
            const playBtn = document.getElementById('player');
            
            if (!window.isPlaying) {
                // Start playing
                window.isPlaying = true;
                
                // Check if this surah has Bismillah (all except At-Tawbah)
                if (window.currentSurahNumber === 9) {
                    // At-Tawbah - start directly with first ayah
                    window.currentAudioIndex = -1;
                    audio.src = window.currentAudioArray[0];
                    audio.play();
                    window.currentAudioIndex = 0;
                    const firstAyah = document.getElementById('ayah-1');
                    if (firstAyah) firstAyah.classList.add('active');
                } else {
                    // Other surahs - start with Bismillah
                    window.currentAudioIndex = -1;
                    audio.src = "https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3";
                    audio.play();
                    const bismillah = document.getElementById('ayah-0');
                    if (bismillah) bismillah.classList.add('active');
                }
                
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-stop');
            } else {
                // Stop playing and reset
                window.isPlaying = false;
                playBtn.classList.remove('fa-stop');
                playBtn.classList.add('fa-play');
                audio.pause();
                audio.currentTime = 0;
                window.currentAudioIndex = -1;
                document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
                const bismillah = document.getElementById('ayah-0');
                if (bismillah) bismillah.classList.remove('active');
            }
        }
        
        function pauseAudio() {
            const audio = document.getElementById('surahAudio');
            const pauseBtn = document.getElementById('pause');
            
            if (!window.isPlaying) return;
            
            if (audio.paused) {
                audio.play();
                pauseBtn.classList.remove('fa-play');
                pauseBtn.classList.add('fa-pause');
            } else {
                audio.pause();
                pauseBtn.classList.remove('fa-pause');
                pauseBtn.classList.add('fa-play');
            }
        }
        
        function toggleTafsir() {
            document.getElementById('tafsirContainer').classList.toggle('active');
        }
        
        // Search page functionality
        function renderSearchPage() {
            const content = \`
            <div class="container my-5">
                <div class="search-container">
                    <h1 class="text-center mb-4" style="color: #ffd700; font-family: 'Quranic';">البحث في القرآن الكريم</h1>
                    
                    <div class="search-input-container mb-4">
                        <input type="text" id="quranSearch" class="search-box" 
                               placeholder="ابحث في القرآن الكريم..." autocomplete="off">
                        <button class="btn btn-primary" onclick="searchQuran()" 
                                style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #b8860b; border: none;">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    
                    <div class="text-center mb-4">
                        <small style="color: #b8860b;">
                            <i class="fas fa-info-circle"></i>
                            يمكنك البحث بالكلمات العربية أو الإنجليزية - لا حاجة للتشكيل
                        </small>
                    </div>
                    
                    <div id="searchResults" class="search-results"></div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            
            // Add enter key functionality
            document.getElementById('quranSearch').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchQuran();
                }
            });
        }
        
        // Search in Quran
        async function searchQuran() {
            const searchTerm = document.getElementById('quranSearch').value.trim();
            const resultsDiv = document.getElementById('searchResults');
            
            if (!searchTerm) {
                resultsDiv.innerHTML = \`
                    <div class="alert alert-warning text-center">
                        <i class="fas fa-exclamation-triangle"></i>
                        يرجى إدخال كلمة للبحث
                    </div>
                \`;
                return;
            }
            
            resultsDiv.innerHTML = \`
                <div class="loading text-center">
                    <i class="fas fa-spinner fa-spin fa-2x" style="color: #b8860b;"></i>
                    <p style="color: #b8860b; margin-top: 15px;">جاري البحث في القرآن الكريم...</p>
                </div>
            \`;
            
            try {
                // Normalize search term
                const normalizeArabic = (text) => {
                    return text.replace(/[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u06EF-\\u06FF]/g, '');
                };
                
                const normalizedSearch = normalizeArabic(searchTerm.toLowerCase());
                let allResults = [];
                
                // Search through first 10 surahs for demo (to avoid rate limiting)
                const searchPromises = [];
                for (let i = 1; i <= 10; i++) {
                    const promise = fetch(\`\${API_BASE}/surah/\${i}/ar.muyassar\`)
                        .then(response => response.json())
                        .then(data => {
                            const surahData = data.data;
                            const surahResults = [];
                            surahData.ayahs.forEach(ayah => {
                                const normalizedAyah = normalizeArabic(ayah.text.toLowerCase());
                                if (normalizedAyah.includes(normalizedSearch)) {
                                    surahResults.push({
                                        text: ayah.text,
                                        surahName: surahData.name,
                                        surahNumber: surahData.number,
                                        ayahNumber: ayah.numberInSurah,
                                        juz: ayah.juz,
                                        page: ayah.page
                                    });
                                }
                            });
                            return surahResults;
                        })
                        .catch(() => []);
                    
                    searchPromises.push(promise);
                }
                
                const results = await Promise.all(searchPromises);
                allResults = results.flat();
                
                if (allResults.length === 0) {
                    resultsDiv.innerHTML = \`
                        <div class="alert alert-info text-center">
                            <i class="fas fa-search"></i>
                            لم يتم العثور على نتائج لـ "\${searchTerm}"
                            <br><small>جرب كلمات مختلفة أو تأكد من الإملاء</small>
                        </div>
                    \`;
                } else {
                    const resultsHTML = allResults.slice(0, 20).map(result => \`
                        <div class="search-result-item">
                            <div class="search-result-text">\${result.text}</div>
                            <div class="search-result-info">
                                <span><i class="fas fa-book"></i> \${result.surahName}</span>
                                <span><i class="fas fa-verse"></i> آية \${result.ayahNumber}</span>
                                <span><i class="fas fa-bookmark"></i> جزء \${result.juz}</span>
                                <span><i class="fas fa-file"></i> صفحة \${result.page}</span>
                            </div>
                        </div>
                    \`).join('');
                    
                    resultsDiv.innerHTML = \`
                        <div class="mb-3 text-center" style="color: #b8860b;">
                            <i class="fas fa-check-circle"></i>
                            تم العثور على \${allResults.length} نتيجة (عرض أول 20)
                        </div>
                        \${resultsHTML}
                    \`;
                }
            } catch (error) {
                console.error('Search error:', error);
                resultsDiv.innerHTML = \`
                    <div class="alert alert-danger text-center">
                        <i class="fas fa-exclamation-triangle"></i>                            حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.
                    </div>
                \`;
            }
        }
        
        // Qibla Compass functionality
        function showQibla() {
            updateActiveNav('اتجاه القبلة');
            renderQiblaPage();
        }
        
        function renderQiblaPage() {
            const content = \`
            <div class="container my-5">
                <div class="text-center mb-4">
                    <h1 style="color: #b8860b; font-family: 'Quranic';">اتجاه القبلة</h1>
                    <p style="color: #ffffff;">استخدم البوصلة لتحديد اتجاه القبلة من موقعك</p>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div style="background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%); border: 2px solid #b8860b; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(184, 134, 11, 0.3);">
                            <div id="location-info" class="mb-4 text-center">
                                <h5 style="color: #b8860b;">الموقع الحالي</h5>
                                <p id="coordinates" style="color: #ffffff;">جاري تحديد الموقع...</p>
                            </div>

                            <div class="compass-container d-flex justify-content-center align-items-center mb-4">
                                <div class="compass-outer">
                                    <div class="compass-inner" id="compass">
                                        <div class="compass-face">
                                            <div class="direction north">ش</div>
                                            <div class="direction east">ق</div>
                                            <div class="direction south">ج</div>
                                            <div class="direction west">غ</div>
                                            
                                            <div class="qibla-needle" id="qibla-needle">
                                                <div class="needle-pointer">
                                                    <i class="fas fa-location-arrow"></i>
                                                </div>
                                            </div>
                                            
                                            <div class="device-needle" id="device-needle">
                                                <div class="needle-head"></div>
                                                <div class="needle-tail"></div>
                                            </div>
                                            
                                            <div class="compass-center"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="compass-info">
                                <div class="row text-center">
                                    <div class="col-md-4 mb-3">
                                        <div style="background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%); border: 1px solid #555555; border-radius: 15px; padding: 20px;">
                                            <h6 style="color: #b8860b; margin-bottom: 10px;">اتجاه القبلة</h6>
                                            <span id="qibla-direction" style="color: #ffffff; font-size: 1.5rem; font-weight: bold;">--°</span>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div style="background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%); border: 1px solid #555555; border-radius: 15px; padding: 20px;">
                                            <h6 style="color: #b8860b; margin-bottom: 10px;">المسافة إلى مكة</h6>
                                            <span id="distance-to-mecca" style="color: #ffffff; font-size: 1.5rem; font-weight: bold;">-- كم</span>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div id="direction-status" style="background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%); border: 1px solid #555555; border-radius: 15px; padding: 20px;">
                                            <h6 style="color: #b8860b; margin-bottom: 10px;">حالة الاتجاه</h6>
                                            <span id="accuracy-indicator" style="color: #ffffff; font-size: 1.5rem; font-weight: bold;">--</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 text-center">
                                <button id="recalibrate-btn" style="background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%); color: #000000; border: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; margin: 10px;" onclick="compass.calibrateCompass()">
                                    <i class="fas fa-sync-alt"></i> إعادة المعايرة
                                </button>
                                <button id="get-location-btn" style="background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #b8860b; border: 2px solid #b8860b; padding: 12px 25px; border-radius: 25px; font-weight: bold; margin: 10px;" onclick="compass.getUserLocation()">
                                    <i class="fas fa-map-marker-alt"></i> تحديث الموقع
                                </button>
                            </div>

                            <div style="background: #0d4377; border: 1px solid #b8860b; border-radius: 10px; padding: 15px; margin-top: 20px;">
                                <small style="color: #ffffff;">
                                    <i class="fas fa-info-circle" style="color: #b8860b;"></i>
                                    تأكد من تمكين الموقع والبوصلة في متصفحك للحصول على أفضل النتائج
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            initializeQiblaCompass();
        }
        
        
        // Recitation functionality
        function showRecite() {
            updateActiveNav('التلاوة التفاعلية');
            renderReciteSelectPage();
        }
        
        function renderReciteSelectPage() {
            const content = \`
            <div class="container my-5">
                <div class="text-center mb-5">
                    <h1 style="color: #b8860b; font-family: 'Quranic'; font-size: 3rem; margin-bottom: 20px;">
                        <i class="fas fa-microphone-alt me-3"></i>
                        التلاوة التفاعلية
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 1.2rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                        اختر السورة التي تريد تلاوتها واستخدم المايكروفون للتدرب على النطق الصحيح
                    </p>
                </div>

                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="search-container mb-4">
                            <div class="input-group">
                                <input type="text" 
                                       id="recite-search" 
                                       class="form-control search-input" 
                                       placeholder="ابحث عن السورة..."
                                       onkeyup="filterReciteSurahs()">
                                <button class="btn search-btn" type="button">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>

                        <div id="recite-surahs-grid" class="surahs-grid">
                            <!-- Surahs will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            loadReciteSurahs();
        }
        
        function loadReciteSurahs() {
            if (allSurahs.length === 0) {
                // If surahs not loaded yet, wait and try again
                setTimeout(loadReciteSurahs, 500);
                return;
            }
            
            const grid = document.getElementById('recite-surahs-grid');
            grid.innerHTML = allSurahs.map(surah => \`
                <div class="surah-card-recite" onclick="startRecitation(\${surah.number})">
                    <div class="surah-number">\${surah.number}</div>
                    <div class="surah-info">
                        <h3 class="surah-name">\${surah.name}</h3>
                        <p class="surah-english">\${surah.englishName}</p>
                        <div class="surah-details">
                            <span class="ayah-count">
                                <i class="fas fa-list-ol me-1"></i>
                                \${surah.numberOfAyahs} آية
                            </span>
                            <span class="revelation-type \${surah.revelationType === 'Meccan' ? 'meccan' : 'medinan'}">
                                \${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                            </span>
                        </div>
                    </div>
                    <div class="recite-icon">
                        <i class="fas fa-microphone"></i>
                    </div>
                </div>
            \`).join('');
        }
        
        function filterReciteSurahs() {
            const searchTerm = document.getElementById('recite-search').value.toLowerCase();
            const cards = document.querySelectorAll('.surah-card-recite');
            
            cards.forEach(card => {
                const surahName = card.querySelector('.surah-name').textContent.toLowerCase();
                const englishName = card.querySelector('.surah-english').textContent.toLowerCase();
                
                if (surahName.includes(searchTerm) || englishName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        async function startRecitation(surahNumber) {
            try {
                const response = await fetch(\`\${API_BASE}/surah/\${surahNumber}/quran-uthmani\`);
                const data = await response.json();
                if (data.data) {
                    renderRecitationPage(data.data);
                }
            } catch (error) {
                console.error('Error loading surah for recitation:', error);
            }
        }
        
        function renderRecitationPage(surah) {
            const content = \`
            <div class="container-fluid vh-100 d-flex flex-column recitation-page">
                <!-- Header -->
                <div class="row py-3 recitation-header">
                    <div class="col-12 text-center">
                        <h2 class="mb-0 surah-title">
                            \${surah.name} 
                            <small class="surah-english">(\${surah.englishName})</small>
                        </h2>
                        <p class="mb-0 ayah-progress">
                            آية <span id="current-ayah-number">1</span> من \${surah.numberOfAyahs}
                        </p>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="row flex-grow-1">
                    <div class="col-12 d-flex flex-column justify-content-center align-items-center text-center p-4">
                        <!-- Progress Bar -->
                        <div class="w-100 mb-4 progress-container">
                            <div class="progress mb-2">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: 0%;" 
                                     id="progress-bar">
                                </div>
                            </div>
                            <small class="progress-label">التقدم في السورة</small>
                        </div>

                        <!-- Current Ayah Display -->
                        <div class="ayah-container mb-4">
                            <div id="ayah-text" class="ayah-text">
                                <!-- Words will be populated here -->
                            </div>
                            <div class="ayah-number">
                                <span class="ayah-badge" id="ayah-badge">1</span>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="controls-container mb-4">
                            <button id="start-btn" class="btn-custom btn-success me-3">
                                <i class="fas fa-microphone"></i>
                                ابدأ التلاوة
                            </button>
                            <button id="stop-btn" class="btn-custom btn-danger me-3" disabled>
                                <i class="fas fa-stop"></i>
                                إيقاف
                            </button>
                            <button id="skip-btn" class="btn-custom btn-secondary me-2">
                                <i class="fas fa-forward"></i>
                                تخطي الآية
                            </button>
                            <button id="multi-verse-btn" class="btn-custom btn-multi me-2">
                                <i class="fas fa-layer-group"></i>
                                <span id="multi-verse-text">تلاوة متعددة</span>
                            </button>
                            <button id="complete-btn" class="btn-custom btn-smart" style="display: none;">
                                <i class="fas fa-check-circle"></i>
                                إكمال ذكي
                            </button>
                        </div>

                        <!-- Status Messages -->
                        <div id="status-message" class="status-alert" style="display: none;"></div>

                        <!-- Microphone Status -->
                        <div id="mic-status" class="text-center" style="display: none;">
                            <div class="microphone-animation">
                                <i class="fas fa-microphone fa-3x pulse"></i>
                            </div>
                            <p class="mt-2 mic-listening">جاري الاستماع...</p>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="row">
                    <div class="col-12 text-center pb-3">
                        <button onclick="showRecite()" class="btn-custom btn-back">
                            <i class="fas fa-arrow-right me-2"></i>
                            العودة لاختيار السورة
                        </button>
                    </div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            initializeReciter(surah);
        }
        
        function initializeReciter(surah) {
            new QuranReciter(surah.ayahs);
        }
        
        // Prayer Times functionality
        function showPrayerTimes() {
            updateActiveNav('أوقات الصلاة');
            renderPrayerTimesPage();
        }
        
        function renderPrayerTimesPage() {
            const content = \`
            <div class="container my-5">
                <div class="text-center mb-4">
                    <h1 class="prayer-title">أوقات الصلاة</h1>
                    <p class="prayer-subtitle">اعرف أوقات الصلوات الخمس حسب موقعك</p>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-10">
                        <div class="prayer-times-container">
                            <div class="prayer-header">
                                <div id="location-info" class="mb-4">
                                    <h5 class="location-title">
                                        <i class="fas fa-globe-americas me-2"></i>
                                        الموقع الحالي
                                    </h5>
                                    <p id="coordinates" class="location-text">جاري تحديد الموقع...</p>
                                </div>
                                <div id="current-date" class="date-display">
                                    <div class="date-item">
                                        <i class="fas fa-calendar-islamic me-2"></i>
                                        <span id="hijri-date"></span>
                                    </div>
                                    <div class="date-separator">•</div>
                                    <div class="date-item">
                                        <i class="fas fa-calendar-alt me-2"></i>
                                        <span id="gregorian-date"></span>
                                    </div>
                                </div>
                            </div>

                            <div id="prayer-times-loading" class="text-center loading-section">
                                <div class="custom-spinner">
                                    <div class="spinner-circle"></div>
                                </div>
                                <p class="loading-text">جاري تحميل أوقات الصلاة...</p>
                            </div>

                            <div id="prayer-times-container" class="d-none">
                                <div class="row" id="prayer-times"></div>
                            </div>

                            <div class="location-controls mt-4 text-center">
                                <button id="get-location-btn" class="custom-btn me-3 mb-2">
                                    <i class="fas fa-map-marker-alt"></i> تحديث الموقع
                                </button>
                                <button id="manual-location-btn" class="custom-btn secondary mb-2">
                                    <i class="fas fa-edit"></i> إدخال الموقع يدوياً
                                </button>
                                
                                <div id="manual-location-form" class="manual-location-form mt-3 d-none">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <input type="text" id="city-input" class="form-control location-input" placeholder="اسم المدينة (مثل: القاهرة)">
                                        </div>
                                        <div class="col-md-6">
                                            <input type="text" id="country-input" class="form-control location-input" placeholder="اسم البلد (مثل: مصر)">
                                        </div>
                                    </div>
                                    <div class="row mt-2">
                                        <div class="col-12">
                                            <button id="search-location-btn" class="custom-btn">
                                                <i class="fas fa-search"></i> البحث عن الموقع
                                            </button>
                                            <button id="cancel-manual-btn" class="custom-btn secondary ms-2">
                                                <i class="fas fa-times"></i> إلغاء
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="prayer-info mt-4">
                                <div class="info-card">
                                    <h6 class="info-title">
                                        <i class="fas fa-info-circle"></i>
                                        معلومات مهمة
                                    </h6>
                                    <ul class="info-list">
                                        <li>الأوقات محسوبة حسب موقعك الجغرافي</li>
                                        <li>يُنصح بالتأكد من الأوقات مع المسجد المحلي</li>
                                        <li>تأكد من تمكين الموقع في المتصفح</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            \`;
            
            document.getElementById('mainContent').innerHTML = content;
            initializePrayerTimes();
        }
        
        // Initialize Qibla Compass
        function initializeQiblaCompass() {
            window.compass = new QiblaCompass();
        }
        
        // Prayer Times Handler - Class-based implementation
        class PrayerTimes {
            constructor() {
                this.userLocation = null;
                this.init();
            }

            init() {
                this.displayCurrentDate();
                this.getUserLocation();
                this.setupEventListeners();
            }

            setupEventListeners() {
                document.getElementById('get-location-btn').addEventListener('click', () => {
                    this.getUserLocation();
                });
                
                document.getElementById('manual-location-btn').addEventListener('click', () => {
                    this.toggleManualLocationForm();
                });
                
                document.getElementById('search-location-btn').addEventListener('click', () => {
                    this.searchManualLocation();
                });
                
                document.getElementById('cancel-manual-btn').addEventListener('click', () => {
                    this.hideManualLocationForm();
                });
            }

            displayCurrentDate() {
                const today = new Date();
                
                // Gregorian date in Arabic with proper formatting
                const gregorianDate = today.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
                
                // Get proper Hijri date
                const hijriDate = this.getHijriDate(today);
                
                document.getElementById('gregorian-date').textContent = gregorianDate;
                document.getElementById('hijri-date').textContent = hijriDate;
            }

            getHijriDate(date) {
                // More accurate Hijri date calculation
                // Islamic calendar epoch: July 16, 622 CE (1 Muharram 1 AH)
                const islamicEpoch = new Date(622, 6, 16); // Month is 0-indexed, so 6 = July
                const diffTime = date.getTime() - islamicEpoch.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // Islamic year is approximately 354.367 days
                const daysPerYear = 354.367;
                const hijriYear = Math.floor(diffDays / daysPerYear) + 1;
                const dayOfYear = Math.floor(diffDays % daysPerYear);
                
                const hijriMonths = [
                    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
                    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
                ];
                
                // Calculate month and day more accurately
                let remainingDays = dayOfYear;
                let monthIndex = 0;
                
                // Islamic months alternate between 30 and 29 days, with adjustments
                const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
                
                for (let i = 0; i < 12; i++) {
                    if (remainingDays < monthLengths[i]) {
                        monthIndex = i;
                        break;
                    }
                    remainingDays -= monthLengths[i];
                }
                
                const dayOfMonth = Math.max(1, Math.min(30, remainingDays + 1));
                
                return \`\${Math.floor(dayOfMonth)} \${hijriMonths[monthIndex]} \${hijriYear} هـ\`;
            }

            getUserLocation() {
                if (!navigator.geolocation) {
                    this.showError('الجهاز لا يدعم تحديد الموقع');
                    return;
                }

                // Show improved loading state
                document.getElementById('coordinates').innerHTML = \`
                    <div class="location-loading">
                        <div class="mini-spinner"></div>
                        جاري تحديد الموقع...
                    </div>
                \`;

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.updateLocationDisplay();
                        this.loadPrayerTimes();
                    },
                    (error) => {
                        let errorMessage = 'فشل في تحديد الموقع';
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = 'تم رفض الإذن لتحديد الموقع';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = 'الموقع غير متاح';
                                break;
                            case error.TIMEOUT:
                                errorMessage = 'انتهت مهلة تحديد الموقع';
                                break;
                        }
                        this.showError(errorMessage);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 300000
                    }
                );
            }

            updateLocationDisplay() {
                const coords = document.getElementById('coordinates');
                coords.innerHTML = \`
                    <i class="fas fa-map-marker-alt"></i>
                    جاري تحديد اسم المنطقة...
                \`;
                
                // Get location name using reverse geocoding
                this.getLocationName();
            }

            async getLocationName() {
                if (!this.userLocation) return;
                
                try {
                    // Try multiple geocoding services for better results
                    let locationData = null;
                    
                    // First try: OpenStreetMap Nominatim with Arabic language preference
                    try {
                        const nominatimResponse = await fetch(
                            \`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${this.userLocation.lat}&lon=\${this.userLocation.lng}&accept-language=ar,en&addressdetails=1&zoom=18\`
                        );
                        
                        if (nominatimResponse.ok) {
                            locationData = await nominatimResponse.json();
                        }
                    } catch (e) {
                        console.log('Nominatim failed, trying alternative...');
                    }
                    
                    // Second try: BigDataCloud (backup service)
                    if (!locationData || !locationData.address) {
                        try {
                            const bigDataResponse = await fetch(
                                \`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=\${this.userLocation.lat}&longitude=\${this.userLocation.lng}&localityLanguage=ar\`
                            );
                            
                            if (bigDataResponse.ok) {
                                const bigDataResult = await bigDataResponse.json();
                                // Convert BigDataCloud format to Nominatim-like format
                                locationData = {
                                    address: {
                                        city: bigDataResult.city,
                                        state: bigDataResult.principalSubdivision,
                                        country: bigDataResult.countryName,
                                        suburb: bigDataResult.locality
                                    }
                                };
                            }
                        } catch (e) {
                            console.log('BigDataCloud also failed');
                        }
                    }
                    
                    const coords = document.getElementById('coordinates');
                    
                    if (locationData && locationData.address) {
                        // Extract area and city information with improved logic
                        const address = locationData.address;
                        const city = address.city || address.town || address.village || address.municipality || '';
                        const state = address.state || address.governorate || address.province || address.region || '';
                        const suburb = address.suburb || address.neighbourhood || address.quarter || address.district || '';
                        const country = address.country || '';
                        
                        // Create a formatted location string similar to "حدايق الاهرام / الجيزة"
                        let locationText = '';
                        
                        if (suburb && city && suburb !== city) {
                            locationText = \`\${suburb} / \${city}\`;
                        } else if (city) {
                            locationText = city;
                        } else if (suburb) {
                            locationText = suburb;
                        } else if (state) {
                            locationText = state;
                        } else if (country) {
                            locationText = country;
                        } else {
                            locationText = 'منطقة غير محددة';
                        }
                        
                        // Add state/governorate if it's different from city and we have space
                        if (state && city && state !== city && !locationText.includes(state)) {
                            locationText += \` - \${state}\`;
                        }
                        
                        coords.innerHTML = \`
                            <i class="fas fa-map-marker-alt"></i>
                            \${locationText}
                        \`;
                        
                    } else {
                        throw new Error('No address data available');
                    }
                    
                } catch (error) {
                    console.error('Error getting location name:', error);
                    const coords = document.getElementById('coordinates');
                    coords.innerHTML = \`
                        <i class="fas fa-map-marker-alt"></i>
                        \${this.userLocation.lat.toFixed(4)}°, \${this.userLocation.lng.toFixed(4)}°
                    \`;
                }
            }

            loadPrayerTimes() {
                if (!this.userLocation) return;

                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const day = today.getDate();

                fetch(\`https://api.aladhan.com/v1/timings/\${day}-\${month}-\${year}?latitude=\${this.userLocation.lat}&longitude=\${this.userLocation.lng}&method=4\`)
                    .then(response => response.json())
                    .then(data => {
                        this.displayPrayerTimes(data.data.timings);
                    })
                    .catch(error => {
                        console.error('Error loading prayer times:', error);
                        document.getElementById('prayer-times-loading').innerHTML = 
                            '<p class="error-text">فشل في تحميل أوقات الصلاة</p>';
                    });
            }

            displayPrayerTimes(timings) {
                const prayers = [
                    { key: 'Fajr', name: 'الفجر', icon: 'fas fa-sun' },
                    { key: 'Dhuhr', name: 'الظهر', icon: 'fas fa-sun' },
                    { key: 'Asr', name: 'العصر', icon: 'fas fa-cloud-sun' },
                    { key: 'Maghrib', name: 'المغرب', icon: 'fas fa-moon' },
                    { key: 'Isha', name: 'العشاء', icon: 'fas fa-moon' }
                ];

                const currentTime = new Date();
                const currentTimeString = currentTime.toTimeString().slice(0, 5);

                let html = '';
                prayers.forEach(prayer => {
                    const isNext = this.isNextPrayer(currentTimeString, timings[prayer.key]);
                    const timeLeft = this.calculateTimeLeft(currentTimeString, timings[prayer.key]);
                    
                    html += \`
                        <div class="col-md-4 col-lg-2 mb-4">
                            <div class="prayer-card \${isNext ? 'next-prayer' : ''}">
                                <div class="prayer-icon">
                                    <i class="\${prayer.icon}"></i>
                                </div>
                                <h6 class="prayer-name">\${prayer.name}</h6>
                                <div class="prayer-time">\${timings[prayer.key]}</div>
                                \${isNext ? \`<div class="time-remaining">\${timeLeft}</div>\` : ''}
                            </div>
                        </div>
                    \`;
                });

                document.getElementById('prayer-times').innerHTML = html;
                document.getElementById('prayer-times-loading').classList.add('d-none');
                document.getElementById('prayer-times-container').classList.remove('d-none');
            }

            isNextPrayer(currentTime, prayerTime) {
                const current = this.timeToMinutes(currentTime);
                const prayer = this.timeToMinutes(prayerTime);
                return prayer > current;
            }

            calculateTimeLeft(currentTime, prayerTime) {
                const current = this.timeToMinutes(currentTime);
                const prayer = this.timeToMinutes(prayerTime);
                
                if (prayer <= current) return '';
                
                const diff = prayer - current;
                const hours = Math.floor(diff / 60);
                const minutes = diff % 60;
                
                if (hours > 0) {
                    return \`\${hours}:\${minutes.toString().padStart(2, '0')} ساعة\`;
                } else {
                    return \`\${minutes} دقيقة\`;
                }
            }

            timeToMinutes(timeString) {
                const [hours, minutes] = timeString.split(':').map(Number);
                return hours * 60 + minutes;
            }

            showError(message) {
                document.getElementById('coordinates').innerHTML = 
                    \`<i class="fas fa-exclamation-triangle"></i> \${message}\`;
            }
            
            toggleManualLocationForm() {
                const form = document.getElementById('manual-location-form');
                form.classList.toggle('d-none');
                
                if (!form.classList.contains('d-none')) {
                    document.getElementById('city-input').focus();
                }
            }
            
            hideManualLocationForm() {
                document.getElementById('manual-location-form').classList.add('d-none');
                document.getElementById('city-input').value = '';
                document.getElementById('country-input').value = '';
            }
            
            async searchManualLocation() {
                const city = document.getElementById('city-input').value.trim();
                const country = document.getElementById('country-input').value.trim();
                
                if (!city) {
                    alert('يرجى إدخال اسم المدينة');
                    return;
                }
                
                const coords = document.getElementById('coordinates');
                coords.innerHTML = \`
                    <i class="fas fa-search"></i>
                    جاري البحث عن \${city}...
                \`;
                
                try {
                    // Search for the location using Nominatim
                    const query = country ? \`\${city}, \${country}\` : city;
                    const response = await fetch(
                        \`https://nominatim.openstreetmap.org/search?format=json&q=\${encodeURIComponent(query)}&limit=1&accept-language=ar,en\`
                    );
                    
                    if (!response.ok) {
                        throw new Error('فشل في البحث عن الموقع');
                    }
                    
                    const data = await response.json();
                    
                    if (data.length === 0) {
                        throw new Error('لم يتم العثور على الموقع المطلوب');
                    }
                    
                    // Set the location from search results
                    this.userLocation = {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    };
                    
                    // Display the found location name
                    coords.innerHTML = \`
                        <i class="fas fa-map-marker-alt"></i>
                        \${data[0].display_name || city}
                    \`;
                    
                    // Hide the manual form and load prayer times
                    this.hideManualLocationForm();
                    this.loadPrayerTimes();
                    
                } catch (error) {
                    console.error('Error searching location:', error);
                    coords.innerHTML = \`
                        <i class="fas fa-exclamation-triangle"></i>
                        \${error.message}
                    \`;
                }
            }
        }
        
        // Initialize Prayer Times - updated function
        function initializePrayerTimes() {
            window.prayerTimesApp = new PrayerTimes();
        }
        
        // Qibla Compass Class
        class QiblaCompass {
            constructor() {
                this.userLocation = null;
                this.qiblaDirection = null;
                this.deviceHeading = 0;
                this.meccaCoords = { lat: 21.4225, lng: 39.8262 };
                
                this.init();
            }

            init() {
                this.getUserLocation();
                this.startCompass();
            }

            getUserLocation() {
                if (!navigator.geolocation) {
                    this.showError('الجهاز لا يدعم تحديد الموقع');
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.updateLocationDisplay();
                        this.calculateQiblaDirection();
                        this.calculateDistanceToMecca();
                    },
                    (error) => {
                        this.showError('فشل في تحديد الموقع: ' + error.message);
                    }
                );
            }

            updateLocationDisplay() {
                document.getElementById('coordinates').innerHTML = \`
                    <i class="fas fa-map-marker-alt" style="color: #28a745;"></i>
                    \${this.userLocation.lat.toFixed(4)}°, \${this.userLocation.lng.toFixed(4)}°
                \`;
            }

            calculateQiblaDirection() {
                if (!this.userLocation) return;

                const userLat = this.toRadians(this.userLocation.lat);
                const userLng = this.toRadians(this.userLocation.lng);
                const meccaLat = this.toRadians(this.meccaCoords.lat);
                const meccaLng = this.toRadians(this.meccaCoords.lng);

                const dLng = meccaLng - userLng;
                const y = Math.sin(dLng) * Math.cos(meccaLat);
                const x = Math.cos(userLat) * Math.sin(meccaLat) - 
                          Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(dLng);

                let bearing = Math.atan2(y, x);
                bearing = this.toDegrees(bearing);
                bearing = (bearing + 360) % 360;

                this.qiblaDirection = bearing;
                document.getElementById('qibla-direction').textContent = Math.round(bearing) + '°';
                
                this.updateNeedles();
            }

            calculateDistanceToMecca() {
                if (!this.userLocation) return;

                const R = 6371;
                const dLat = this.toRadians(this.meccaCoords.lat - this.userLocation.lat);
                const dLng = this.toRadians(this.meccaCoords.lng - this.userLocation.lng);
                
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(this.toRadians(this.userLocation.lat)) * Math.cos(this.toRadians(this.meccaCoords.lat)) *
                          Math.sin(dLng/2) * Math.sin(dLng/2);
                
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;

                document.getElementById('distance-to-mecca').textContent = Math.round(distance) + ' كم';
            }

            startCompass() {
                if ('DeviceOrientationEvent' in window) {
                    window.addEventListener('deviceorientation', (event) => {
                        let heading = event.alpha;
                        if (heading !== null) {
                            if (event.webkitCompassHeading) {
                                heading = event.webkitCompassHeading;
                            }
                            this.deviceHeading = heading;
                            this.updateNeedles();
                        }
                    });
                }
            }

            updateNeedles() {
                const deviceNeedle = document.getElementById('device-needle');
                const qiblaNeedle = document.getElementById('qibla-needle');
                
                if (deviceNeedle) {
                    deviceNeedle.style.transform = \`rotate(\${-this.deviceHeading}deg)\`;
                }
                
                if (qiblaNeedle && this.qiblaDirection !== null) {
                    const rotation = this.qiblaDirection - this.deviceHeading;
                    qiblaNeedle.style.transform = \`rotate(\${rotation}deg)\`;
                    this.updateAccuracyIndicator();
                }
            }

            updateAccuracyIndicator() {
                if (this.qiblaDirection === null) return;
                
                const indicator = document.getElementById('accuracy-indicator');
                const statusBox = document.getElementById('direction-status');
                
                if (!indicator || !statusBox) return;
                
                let diff = Math.abs(this.deviceHeading - this.qiblaDirection);
                if (diff > 180) {
                    diff = 360 - diff;
                }
                
                if (diff <= 5) {
                    indicator.textContent = 'دقيق جداً ✓';
                    indicator.style.color = '#28a745';
                    statusBox.style.borderColor = '#28a745';
                } else if (diff <= 15) {
                    indicator.textContent = 'دقيق';
                    indicator.style.color = '#ffc107';
                    statusBox.style.borderColor = '#ffc107';
                } else if (diff <= 30) {
                    indicator.textContent = 'قريب';
                    indicator.style.color = '#fd7e14';
                    statusBox.style.borderColor = '#fd7e14';
                } else {
                    indicator.textContent = 'بعيد';
                    indicator.style.color = '#dc3545';
                    statusBox.style.borderColor = '#dc3545';
                }
            }

            calibrateCompass() {
                this.deviceHeading = 0;
                if (this.userLocation) {
                    this.calculateQiblaDirection();
                }
            }

            toRadians(degrees) {
                return degrees * (Math.PI / 180);
            }

            toDegrees(radians) {
                return radians * (180 / Math.PI);
            }

            showError(message) {
                document.getElementById('coordinates').innerHTML = \`
                    <i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i> \${message}
                \`;
            }
        }
    </script>
    
    <!-- Custom styles for better UX -->
    <style>
        .ayah-playing {
            background-color: #b8860b !important;
            color: #000000 !important;
        }
        
        .search-input-container {
            position: relative;
        }
        
        .loading {
            padding: 40px;
        }
        
        /* Prayer Times Styles - Updated from template */
        .prayer-title {
            color: #b8860b;
            font-family: "Quranic";
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .prayer-subtitle {
            color: #ffffff;
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .prayer-times-container {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border: 2px solid #b8860b;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0px 7px 15px 1px rgba(184, 134, 11, 0.3);
        }

        .prayer-header {
            text-align: center;
            border-bottom: 1px solid #b8860b;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }

        .location-title {
            color: #b8860b;
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .location-text {
            color: #ffffff;
            font-size: 1.1rem;
            opacity: 0.9;
            background: rgba(184, 134, 11, 0.1);
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            border: 1px solid rgba(184, 134, 11, 0.3);
            display: inline-block;
            min-width: 200px;
        }

        .date-display {
            color: #ffffff;
            font-size: 1.1rem;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .date-item {
            display: flex;
            align-items: center;
            background: rgba(184, 134, 11, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            border: 1px solid rgba(184, 134, 11, 0.3);
        }

        .date-separator {
            color: #b8860b;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .loading-section {
            padding: 3rem 0;
        }

        .custom-spinner {
            display: inline-block;
            position: relative;
            width: 50px;
            height: 50px;
            margin-bottom: 1rem;
        }

        .spinner-circle {
            width: 50px;
            height: 50px;
            border: 4px solid #333333;
            border-top: 4px solid #b8860b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: #ffffff;
            font-size: 1.1rem;
        }

        .prayer-card {
            background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%);
            border: 1px solid #555555;
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
            height: 100%;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .prayer-card:hover {
            transform: translateY(-5px);
            border-color: #b8860b;
            box-shadow: 0 8px 20px rgba(184, 134, 11, 0.3);
        }

        .prayer-card.next-prayer {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            border-color: #d4af37;
            animation: pulse 2s ease-in-out infinite;
        }

        .prayer-card.next-prayer .prayer-name,
        .prayer-card.next-prayer .prayer-time {
            color: #000000;
        }

        @keyframes pulse {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(184, 134, 11, 0.3);
            }
            50% { 
                box-shadow: 0 0 30px rgba(184, 134, 11, 0.6);
            }
        }

        .prayer-icon {
            font-size: 2rem;
            color: #b8860b;
            margin-bottom: 1rem;
        }

        .prayer-card.next-prayer .prayer-icon {
            color: #000000;
        }

        .prayer-name {
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.8rem;
            font-family: "Quranic";
        }

        .prayer-time {
            color: #b8860b;
            font-size: 1.4rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .time-remaining {
            color: #000000;
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 0.8;
        }

        .location-controls {
            border-top: 1px solid #555555;
            padding-top: 1.5rem;
        }

        .custom-btn {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .custom-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
        }

        .custom-btn.secondary {
            background: linear-gradient(135deg, #555555 0%, #666666 100%);
            color: #ffffff;
        }

        .custom-btn.secondary:hover {
            background: linear-gradient(135deg, #666666 0%, #555555 100%);
            box-shadow: 0 5px 15px rgba(85, 85, 85, 0.4);
        }

        .manual-location-form {
            background: rgba(184, 134, 11, 0.1);
            border: 1px solid rgba(184, 134, 11, 0.3);
            border-radius: 15px;
            padding: 1.5rem;
            margin-top: 1rem;
        }

        .location-input {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(184, 134, 11, 0.3);
            border-radius: 10px;
            color: #ffffff;
            padding: 0.8rem 1rem;
            margin-bottom: 1rem;
        }

        .location-input:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: #b8860b;
            box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
            outline: none;
            color: #ffffff;
        }

        .location-input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .location-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .mini-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(184, 134, 11, 0.3);
            border-top: 2px solid #b8860b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .info-card {
            background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%);
            border: 1px solid #555555;
            border-radius: 15px;
            padding: 1.5rem;
        }

        .info-title {
            color: #b8860b;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .info-list {
            color: #ffffff;
            opacity: 0.9;
            margin: 0;
            padding-left: 1rem;
        }

        .info-list li {
            margin-bottom: 0.5rem;
        }

        .error-text {
            color: #dc3545;
            font-size: 1.1rem;
        }
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
            height: 100%;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .prayer-card:hover {
            transform: translateY(-5px);
            border-color: #b8860b;
            box-shadow: 0 8px 20px rgba(184, 134, 11, 0.3);
        }

        .prayer-card.next-prayer {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            border-color: #d4af37;
            animation: pulse 2s ease-in-out infinite;
        }

        .prayer-card.next-prayer .prayer-name,
        .prayer-card.next-prayer .prayer-time {
            color: #000000;
        }

        @keyframes pulse {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(184, 134, 11, 0.3);
            }
            50% { 
                box-shadow: 0 0 30px rgba(184, 134, 11, 0.6);
            }
        }

        .prayer-icon {
            font-size: 2rem;
            color: #b8860b;
            margin-bottom: 10px;
        }

        .prayer-card.next-prayer .prayer-icon {
            color: #000000;
        }

        .prayer-name {
            color: #b8860b;
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .prayer-time {
            color: #ffffff;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }

        .next-indicator {
            background: rgba(0, 0, 0, 0.2);
            color: #000000;
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 0.8rem;
            margin-top: 8px;
            font-weight: bold;
        }

        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: #b8860b;
            border: 2px solid #b8860b;
        }

        .btn-secondary:hover {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
            transform: translateY(-2px);
        }

        .manual-form {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border: 1px solid #b8860b;
            border-radius: 15px;
            padding: 25px;
            margin-top: 25px;
            display: none;
        }

        .manual-form h6 {
            color: #b8860b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-row {
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            color: #b8860b;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            background: #333333;
            border: 2px solid #555555;
            border-radius: 10px;
            color: #ffffff;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: #b8860b;
            box-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
        }

        .form-group input::placeholder {
            color: #888888;
        }

        .form-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .error-message {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: #ffffff;
            padding: 15px 20px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .mini-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #555555;
            border-top: 2px solid #b8860b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
            .ayah-container {
                width: 100% !important;
                padding: 15px !important;
            }
            
            .fs-1 {
                font-size: 1.5rem !important;
            }
            
            .surah-grid {
                grid-template-columns: 1fr !important;
            }
            
            /* Prayer Times Mobile Styles - Updated from template */
            .prayer-times-container {
                margin: 0 1rem;
                padding: 1.5rem;
            }
            
            .prayer-title {
                font-size: 2rem;
            }
            
            .prayer-card {
                min-height: 150px;
                margin-bottom: 1rem;
            }
            
            .prayer-icon {
                font-size: 1.5rem;
            }
            
            .prayer-time {
                font-size: 1.2rem;
            }
            
            .date-display {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .date-separator {
                display: none;
            }
            
            .location-text {
                min-width: auto;
                font-size: 1rem;
                padding: 0.6rem 1rem;
            }
            
            .location-title {
                font-size: 1.2rem;
            }
        }
        
        @media (max-width: 576px) {
            .prayer-card {
                min-height: 120px;
            }
            
            .prayer-times-container {
                padding: 1rem;
            }
            
            .date-item {
                padding: 0.4rem 0.8rem;
                font-size: 0.95rem;
            }
        }
        }
        
        /* Compass Styles */
        .compass-container {
            margin: 2rem 0;
        }

        .compass-outer {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
            box-shadow: 
                inset 0 0 20px rgba(0,0,0,0.1),
                0 0 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .compass-inner {
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background: radial-gradient(circle, #ffffff, #f8f9fa);
            border: 3px solid #b8860b;
            position: relative;
            overflow: hidden;
        }

        .compass-face {
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 50%;
        }

        .direction {
            position: absolute;
            font-weight: bold;
            font-size: 1.5rem;
            color: #b8860b;
        }

        .direction.north {
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: #dc3545;
        }

        .direction.east {
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
        }

        .direction.south {
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .direction.west {
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
        }

        .qibla-needle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 100px;
            background: linear-gradient(to top, transparent 40%, #b8860b);
            transform-origin: bottom center;
            transform: translate(-50%, -100%);
            transition: transform 0.1s ease-out;
            z-index: 3;
            border-radius: 3px;
        }

        .qibla-needle .needle-pointer {
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            color: #b8860b;
            font-size: 1.4rem;
            text-shadow: 0 0 5px rgba(184, 134, 11, 0.8);
        }

        .device-needle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 120px;
            transform-origin: bottom center;
            transform: translate(-50%, -100%);
            transition: transform 0.05s ease-out;
            z-index: 2;
        }

        .needle-head {
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 60px solid #dc3545;
            margin: 0 auto;
            filter: drop-shadow(0 0 3px rgba(220, 53, 69, 0.5));
        }

        .needle-tail {
            width: 4px;
            height: 60px;
            background: linear-gradient(to bottom, #6c757d, #495057);
            margin: 0 auto;
            border-radius: 2px;
        }

        .compass-center {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 16px;
            height: 16px;
            background: #b8860b;
            border: 3px solid #ffffff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 4;
            box-shadow: 0 0 10px rgba(184, 134, 11, 0.5);
        }
        
        .col-md-2-4 {
            flex: 0 0 auto;
            width: 20%;
        }

        @media (max-width: 768px) {
            .compass-outer {
                width: 250px;
                height: 250px;
            }
            
            .compass-inner {
                width: 230px;
                height: 230px;
            }
            
            .qibla-needle {
                height: 80px;
            }
            
            .device-needle {
                height: 100px;
            }
            
            .needle-head {
                border-bottom: 50px solid #dc3545;
            }
            
            .needle-tail {
                height: 50px;
            }
            
            .col-md-2-4 {
                width: 100%;
                margin-bottom: 15px;
            }
        }
        
        // Recitation Styles
        .recitation-page {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        
        .recitation-header {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-bottom: 2px solid #b8860b;
        }
        
        .surah-title {
            font-family: 'Quranic';
            color: #b8860b;
        }
        
        .surah-english {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .ayah-progress {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .progress-container {
            max-width: 600px;
        }
        
        .progress {
            height: 8px;
            background-color: #1a1a1a;
            border: 1px solid #b8860b;
            border-radius: 10px;
        }
        
        .progress-bar {
            background: linear-gradient(90deg, #b8860b 0%, #d4af37 100%);
            border-radius: 8px;
        }
        
        .progress-label {
            color: #b8860b;
            font-family: 'Quranic';
        }
        
        .ayah-container {
            min-height: 200px;
            max-width: 800px;
        }
        
        .ayah-text {
            font-family: 'Quranic';
            font-size: 2.5rem;
            line-height: 1.8;
            direction: rtl;
            color: #ffffff;
            margin-bottom: 20px;
        }
        
        .ayah-badge {
            background-color: #b8860b;
            color: #000000;
            padding: 8px 12px;
            border-radius: 50%;
            font-size: 1.1rem;
            font-weight: bold;
        }
        
        .controls-container {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            padding: 2rem;
            border-radius: 20px;
            border: 2px solid #b8860b;
            box-shadow: 0px 7px 15px 1px rgba(184, 134, 11, 0.2);
        }
        
        .btn-custom {
            padding: 15px 25px;
            font-size: 1.1rem;
            font-family: 'Quranic', serif;
            border: 2px solid #b8860b;
            border-radius: 25px;
            transition: all 0.3s ease;
            cursor: pointer;
            min-width: 150px;
            font-weight: 500;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: #b8860b;
        }
        
        .btn-success:hover:not(:disabled) {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
            border-color: #b8860b;
        }
        
        .btn-danger:hover:not(:disabled) {
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: rgba(255, 255, 255, 0.8);
            border-color: rgba(184, 134, 11, 0.5);
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #b8860b;
            border-color: #b8860b;
            transform: translateY(-2px);
        }
        
        .btn-back {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: #b8860b;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 20px;
            border: 2px solid #b8860b;
            transition: all 0.3s ease;
            display: inline-block;
            font-family: 'Quranic', serif;
        }
        
        .btn-smart {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: #ffffff;
            border-color: #17a2b8;
        }
        
        .btn-smart:hover {
            background: linear-gradient(135deg, #138496 0%, #0c5460 100%);
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(23, 162, 184, 0.4);
        }
        
        .btn-multi {
            background: linear-gradient(135deg, #6f42c1 0%, #5a2a9b 100%);
            color: #ffffff;
            border-color: #6f42c1;
        }
        
        .btn-multi:hover {
            background: linear-gradient(135deg, #5a2a9b 0%, #4a1e7a 100%);
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(111, 66, 193, 0.4);
        }
        
        .btn-multi.active {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border-color: #28a745;
            box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        }
        
        .btn-back:hover {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            color: #000000;
            text-decoration: none;
            transform: translateY(-2px);
        }
        
        .btn-custom:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
        
        .word {
            transition: all 0.5s ease;
            padding: 2px 4px;
            border-radius: 4px;
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8);
        }
        
        .word.revealed {
            opacity: 1 !important;
            visibility: visible !important;
            transform: scale(1);
            color: #ffffff !important;
        }
        
        .word:hover {
            background-color: rgba(184, 134, 11, 0.1);
        }
        
        .pulse {
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .microphone-animation {
            position: relative;
            color: #b8860b;
        }
        
        .microphone-animation::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px solid rgba(184, 134, 11, 0.3);
            animation: ripple 1.5s infinite;
        }
        
        @keyframes ripple {
            0% {
                width: 80px;
                height: 80px;
                opacity: 0.8;
            }
            100% {
                width: 120px;
                height: 120px;
                opacity: 0;
            }
        }
        
        .mic-listening {
            color: rgba(255, 255, 255, 0.8);
            font-family: 'Quranic';
        }
        
        .status-alert {
            padding: 15px 25px;
            border-radius: 15px;
            font-family: 'Quranic', serif;
            font-size: 1.1rem;
            border: 2px solid;
            margin: 10px 0;
            max-width: 600px;
        }
        
        .status-alert.alert-info {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: #b8860b;
            border-color: #b8860b;
        }
        
        .status-alert.alert-success {
            background: linear-gradient(135deg, #1a4a1a 0%, #2d4a2d 100%);
            color: #90EE90;
            border-color: #90EE90;
        }
        
        .status-alert.alert-warning {
            background: linear-gradient(135deg, #4a3d1a 0%, #4a4a2d 100%);
            color: #FFD700;
            border-color: #FFD700;
        }
        
        .status-alert.alert-danger {
            background: linear-gradient(135deg, #4a1a1a 0%, #4a2d2d 100%);
            color: #FF6B6B;
            border-color: #FF6B6B;
        }
        
        .status-alert.alert-secondary {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: rgba(255, 255, 255, 0.8);
            border-color: rgba(184, 134, 11, 0.5);
        }
        
        .surahs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }
        
        .surah-card-recite {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border: 2px solid rgba(184, 134, 11, 0.3);
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .surah-card-recite:hover {
            border-color: #b8860b;
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(184, 134, 11, 0.2);
        }
        
        .surah-card-recite .surah-number {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #b8860b;
            color: #000000;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .surah-card-recite .surah-name {
            color: #b8860b;
            font-family: 'Quranic';
            font-size: 1.5rem;
            margin-bottom: 5px;
            margin-right: 50px;
        }
        
        .surah-card-recite .surah-english {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            margin-bottom: 15px;
        }
        
        .surah-card-recite .surah-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .surah-card-recite .ayah-count {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
        }
        
        .surah-card-recite .revelation-type {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .surah-card-recite .revelation-type.meccan {
            background: rgba(220, 53, 69, 0.2);
            color: #dc3545;
            border: 1px solid rgba(220, 53, 69, 0.3);
        }
        
        .surah-card-recite .revelation-type.medinan {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.3);
        }
        
        .surah-card-recite .recite-icon {
            position: absolute;
            bottom: 15px;
            left: 15px;
            color: rgba(184, 134, 11, 0.6);
            font-size: 1.2rem;
        }
        
        .search-input {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border: 2px solid rgba(184, 134, 11, 0.3);
            color: #ffffff;
            padding: 15px 20px;
            font-size: 1.1rem;
            border-radius: 25px 0 0 25px;
        }
        
        .search-input:focus {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-color: #b8860b;
            color: #ffffff;
            box-shadow: 0 0 15px rgba(184, 134, 11, 0.3);
        }
        
        .search-btn {
            background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%);
            border: 2px solid #b8860b;
            color: #000000;
            padding: 15px 25px;
            border-radius: 0 25px 25px 0;
            border-left: none;
        }
        
        .search-btn:hover {
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            color: #000000;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .btn-custom {
                padding: 12px 20px;
                font-size: 1rem;
                min-width: 120px;
                margin-bottom: 10px;
            }
            
            .controls-container {
                padding: 1.5rem;
            }
            
            .ayah-text {
                font-size: 2rem !important;
            }
            
            .surahs-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
        }
        
        @media (max-width: 576px) {
            .btn-custom {
                padding: 10px 15px;
                font-size: 0.9rem;
                min-width: 100px;
            }
            
            .ayah-text {
                font-size: 1.8rem !important;
            }
        }
        
    </style>
    
    <script>
        // QuranReciter Class for Interactive Recitation
        class QuranReciter {
            constructor(ayahs) {
                this.ayahs = ayahs;
                this.currentAyahIndex = 0;
                this.currentWordIndex = 0;
                this.recognition = null;
                this.isListening = false;
                this.isMultiVerseMode = false;
                this.multiVerseBuffer = [];
                
                this.initElements();
                this.initSpeechRecognition();
                this.loadCurrentAyah();
                this.bindEvents();
            }

            initElements() {
                this.startBtn = document.getElementById('start-btn');
                this.stopBtn = document.getElementById('stop-btn');
                this.skipBtn = document.getElementById('skip-btn');
                this.completeBtn = document.getElementById('complete-btn');
                this.multiVerseBtn = document.getElementById('multi-verse-btn');
                this.multiVerseText = document.getElementById('multi-verse-text');
                this.ayahText = document.getElementById('ayah-text');
                this.statusMessage = document.getElementById('status-message');
                this.micStatus = document.getElementById('mic-status');
                this.progressBar = document.getElementById('progress-bar');
                this.currentAyahNumber = document.getElementById('current-ayah-number');
                this.ayahBadge = document.getElementById('ayah-badge');
            }

            initSpeechRecognition() {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    this.showStatus('المعذرة، المتصفح لا يدعم التعرف على الصوت. يرجى استخدام متصفح Chrome أو Edge.', 'warning');
                    this.startBtn.disabled = true;
                    return;
                }

                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                this.recognition.lang = 'ar-SA';
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.maxAlternatives = 3;

                this.recognition.onstart = () => {
                    this.isListening = true;
                    this.micStatus.style.display = 'block';
                    this.showStatus('ابدأ بتلاوة الآية كاملة...', 'info');
                };

                this.recognition.onresult = (event) => {
                    let finalTranscript = '';
                    
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        console.log('Full speech recognition result:', finalTranscript);
                        this.processFullRecitation(finalTranscript.trim());
                    }
                };

                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    if (event.error === 'no-speech') {
                        this.showStatus('لم يتم سماع صوت. حاول مرة أخرى.', 'warning');
                    } else {
                        this.showStatus('حدث خطأ في التعرف على الصوت. حاول مرة أخرى.', 'danger');
                    }
                    
                    if (this.isListening) {
                        setTimeout(() => {
                            if (this.isListening) {
                                this.recognition.start();
                            }
                        }, 1000);
                    }
                };

                this.recognition.onend = () => {
                    if (this.isListening) {
                        setTimeout(() => {
                            if (this.isListening) {
                                this.recognition.start();
                            }
                        }, 100);
                    }
                };
            }

            bindEvents() {
                this.startBtn.addEventListener('click', () => this.startListening());
                this.stopBtn.addEventListener('click', () => this.stopListening());
                this.skipBtn.addEventListener('click', () => this.skipAyah());
                this.completeBtn.addEventListener('click', () => this.smartComplete());
                this.multiVerseBtn.addEventListener('click', () => this.toggleMultiVerseMode());
            }

            loadCurrentAyah() {
                if (this.currentAyahIndex >= this.ayahs.length) {
                    this.completeSurah();
                    return;
                }

                if (this.isMultiVerseMode) {
                    this.loadMultipleAyahs();
                } else {
                    this.loadSingleAyah();
                }
                
                this.updateProgress();
                this.completeBtn.style.display = 'none';
            }

            loadSingleAyah() {
                const currentAyah = this.ayahs[this.currentAyahIndex];
                this.currentWordIndex = 0;
                
                const words = currentAyah.text.split(' ');
                this.ayahText.innerHTML = words.map((word, index) => 
                    \`<span class="word" data-index="\${index}" data-ayah="\${this.currentAyahIndex}" data-original="\${word}" style="opacity: 0; visibility: hidden; transform: scale(0.8);">\${word}</span>\`
                ).join(' ');

                this.currentAyahNumber.textContent = currentAyah.numberInSurah;
                this.ayahBadge.textContent = currentAyah.numberInSurah;
                
                this.showStatus(\`الآية \${currentAyah.numberInSurah} - اقرأ الآية كاملة وستظهر الكلمات الصحيحة تدريجياً\`, 'info');
            }

            loadMultipleAyahs() {
                const versesToLoad = Math.min(5, this.ayahs.length - this.currentAyahIndex);
                let combinedHTML = '';
                let totalWords = 0;
                
                for (let i = 0; i < versesToLoad; i++) {
                    const ayahIndex = this.currentAyahIndex + i;
                    if (ayahIndex >= this.ayahs.length) break;
                    
                    const ayah = this.ayahs[ayahIndex];
                    const words = ayah.text.split(' ');
                    
                    if (i > 0) combinedHTML += '<br><br>';
                    
                    combinedHTML += \`<span class="ayah-number-inline" style="color: #b8860b; font-size: 0.8em; margin-left: 10px;">(\${ayah.numberInSurah})</span> \`;
                    combinedHTML += words.map((word, wordIndex) => 
                        \`<span class="word" data-index="\${totalWords + wordIndex}" data-ayah="\${ayahIndex}" data-original="\${word}" style="opacity: 0; visibility: hidden; transform: scale(0.8);">\${word}</span>\`
                    ).join(' ');
                    
                    totalWords += words.length;
                }
                
                this.ayahText.innerHTML = combinedHTML;
                this.currentWordIndex = 0;
                
                const endAyah = Math.min(this.currentAyahIndex + versesToLoad - 1, this.ayahs.length - 1);
                this.currentAyahNumber.textContent = \`\${this.ayahs[this.currentAyahIndex].numberInSurah}-\${this.ayahs[endAyah].numberInSurah}\`;
                this.ayahBadge.textContent = \`\${this.ayahs[this.currentAyahIndex].numberInSurah}-\${this.ayahs[endAyah].numberInSurah}\`;
                
                this.showStatus(\`الآيات \${this.ayahs[this.currentAyahIndex].numberInSurah}-\${this.ayahs[endAyah].numberInSurah} - اقرأ عدة آيات متتالية وستظهر الكلمات تدريجياً\`, 'info');
            }

            startListening() {
                if (!this.recognition) return;

                try {
                    this.recognition.start();
                    this.startBtn.disabled = true;
                    this.stopBtn.disabled = false;
                } catch (error) {
                    console.error('Error starting recognition:', error);
                    this.showStatus('خطأ في بدء التعرف على الصوت', 'danger');
                }
            }

            stopListening() {
                this.isListening = false;
                if (this.recognition) {
                    this.recognition.stop();
                }
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
                this.micStatus.style.display = 'none';
                this.showStatus('تم إيقاف الاستماع', 'secondary');
            }

            toggleMultiVerseMode() {
                this.isMultiVerseMode = !this.isMultiVerseMode;
                
                if (this.isMultiVerseMode) {
                    this.multiVerseBtn.classList.add('active');
                    this.multiVerseText.textContent = 'وضع واحد';
                    this.showStatus('تم تفعيل وضع التلاوة المتعددة - يمكنك تلاوة عدة آيات متتالية', 'success');
                } else {
                    this.multiVerseBtn.classList.remove('active');
                    this.multiVerseText.textContent = 'تلاوة متعددة';
                    this.showStatus('تم تفعيل وضع الآية الواحدة', 'info');
                }
                
                this.loadCurrentAyah();
            }

            processFullRecitation(transcript) {
                if (this.isMultiVerseMode) {
                    this.processMultiVerseRecitation(transcript);
                } else {
                    this.processSingleVerseRecitation(transcript);
                }
            }

            processSingleVerseRecitation(transcript) {
                const currentAyah = this.ayahs[this.currentAyahIndex];
                const expectedWords = currentAyah.text.split(' ');
                const spokenWords = transcript.split(' ');
                
                console.log('Expected ayah:', currentAyah.text);
                console.log('Spoken text:', transcript);
                
                let correctWordsCount = 0;
                let firstIncorrectWord = null;
                let totalMatchScore = 0;
                
                for (let i = this.currentWordIndex; i < expectedWords.length; i++) {
                    const expectedWord = this.normalizeArabic(expectedWords[i]);
                    let wordFound = false;
                    let bestMatchScore = 0;
                    
                    for (let j = 0; j < spokenWords.length; j++) {
                        const spokenWord = this.normalizeArabic(spokenWords[j]);
                        
                        if (this.wordsMatch(spokenWord, expectedWord)) {
                            wordFound = true;
                            bestMatchScore = this.calculateSimilarity(spokenWord, expectedWord);
                            break;
                        } else {
                            const similarity = this.calculateSimilarity(spokenWord, expectedWord);
                            bestMatchScore = Math.max(bestMatchScore, similarity);
                        }
                    }
                    
                    if (wordFound || bestMatchScore > 0.65) {
                        this.revealWord(i);
                        correctWordsCount++;
                        totalMatchScore += bestMatchScore;
                        this.currentWordIndex = i + 1;
                    } else {
                        if (bestMatchScore > 0.4) {
                            this.revealWord(i);
                            correctWordsCount++;
                            totalMatchScore += bestMatchScore;
                            this.currentWordIndex = i + 1;
                            this.showStatus(\`كلمة قريبة مقبولة: "\${expectedWords[i]}" (\${Math.round(bestMatchScore * 100)}%)\`, 'warning');
                        } else {
                            firstIncorrectWord = expectedWords[i];
                            break;
                        }
                    }
                }
                
                const averageMatch = correctWordsCount > 0 ? (totalMatchScore / correctWordsCount) * 100 : 0;
                
                if (correctWordsCount > 0) {
                    if (firstIncorrectWord) {
                        this.showStatus(\`ممتاز! \${correctWordsCount} كلمة صحيحة (\${Math.round(averageMatch)}%). الكلمة التالية: "\${firstIncorrectWord}"\`, 'warning');
                        if (correctWordsCount / expectedWords.length > 0.5) {
                            this.completeBtn.style.display = 'inline-block';
                        }
                    } else if (this.currentWordIndex >= expectedWords.length) {
                        this.completeBtn.style.display = 'none';
                        if (averageMatch >= 65) {
                            setTimeout(() => this.completeAyah(), 1000);
                        } else {
                            this.showStatus(\`تم إكمال الآية بنسبة \${Math.round(averageMatch)}%. أعد المحاولة للحصول على دقة أعلى.\`, 'success');
                            setTimeout(() => this.completeAyah(), 2000);
                        }
                    } else {
                        this.showStatus(\`رائع! \${correctWordsCount} كلمة صحيحة (\${Math.round(averageMatch)}%). تابع التلاوة...\`, 'success');
                        this.completeBtn.style.display = 'none';
                    }
                } else {
                    const nextExpectedWord = expectedWords[this.currentWordIndex];
                    this.showStatus(\`ابدأ بالكلمة: "\${nextExpectedWord}"\`, 'info');
                    this.completeBtn.style.display = 'none';
                }
            }

            processMultiVerseRecitation(transcript) {
                const allWordElements = document.querySelectorAll('.word');
                const totalWords = allWordElements.length;
                const spokenWords = transcript.split(' ');
                
                console.log('Multi-verse recitation - Total words:', totalWords);
                console.log('Spoken text:', transcript);
                
                let correctWordsCount = 0;
                let totalMatchScore = 0;
                let versesCompleted = 0;
                
                for (let i = this.currentWordIndex; i < totalWords; i++) {
                    const wordElement = allWordElements[i];
                    const expectedWord = this.normalizeArabic(wordElement.getAttribute('data-original'));
                    const ayahIndex = parseInt(wordElement.getAttribute('data-ayah'));
                    
                    let wordFound = false;
                    let bestMatchScore = 0;
                    
                    for (let j = 0; j < spokenWords.length; j++) {
                        const spokenWord = this.normalizeArabic(spokenWords[j]);
                        
                        if (this.wordsMatch(spokenWord, expectedWord)) {
                            wordFound = true;
                            bestMatchScore = this.calculateSimilarity(spokenWord, expectedWord);
                            break;
                        } else {
                            const similarity = this.calculateSimilarity(spokenWord, expectedWord);
                            bestMatchScore = Math.max(bestMatchScore, similarity);
                        }
                    }
                    
                    if (wordFound || bestMatchScore > 0.65) {
                        this.revealWordByElement(wordElement);
                        correctWordsCount++;
                        totalMatchScore += bestMatchScore;
                        this.currentWordIndex = i + 1;
                        
                        if (i === totalWords - 1 || parseInt(allWordElements[i + 1]?.getAttribute('data-ayah')) !== ayahIndex) {
                            versesCompleted++;
                        }
                    } else if (bestMatchScore > 0.4) {
                        this.revealWordByElement(wordElement);
                        correctWordsCount++;
                        totalMatchScore += bestMatchScore;
                        this.currentWordIndex = i + 1;
                    } else {
                        break;
                    }
                }
                
                const averageMatch = correctWordsCount > 0 ? (totalMatchScore / correctWordsCount) * 100 : 0;
                
                if (correctWordsCount > 0) {
                    if (versesCompleted > 0) {
                        this.showStatus(\`ممتاز! تم إكمال \${versesCompleted} آية كاملة و \${correctWordsCount} كلمة (\${Math.round(averageMatch)}%)\`, 'success');
                        setTimeout(() => {
                            this.currentAyahIndex += versesCompleted;
                            this.loadCurrentAyah();
                        }, 2000);
                    } else {
                        this.showStatus(\`رائع! \${correctWordsCount} كلمة صحيحة (\${Math.round(averageMatch)}%). تابع التلاوة...\`, 'success');
                        
                        if (correctWordsCount / totalWords > 0.3) {
                            this.completeBtn.style.display = 'inline-block';
                        }
                    }
                } else {
                    const nextWord = allWordElements[this.currentWordIndex]?.getAttribute('data-original');
                    this.showStatus(\`ابدأ بالكلمة: "\${nextWord}"\`, 'info');
                }
            }

            wordsMatch(spoken, expected) {
                if (spoken === expected) return true;
                if (spoken.includes(expected) || expected.includes(spoken)) return true;
                
                if (spoken.length >= 3 && expected.length >= 3) {
                    const minLength = Math.min(spoken.length, expected.length);
                    
                    if (minLength <= 4) {
                        return this.fuzzyMatch(spoken, expected);
                    }
                    
                    const firstCharsMatch = spoken.substring(0, 3) === expected.substring(0, 3);
                    if (firstCharsMatch) return true;
                    
                    const lastCharsMatch = spoken.slice(-2) === expected.slice(-2);
                    if (lastCharsMatch && this.fuzzyMatch(spoken, expected)) return true;
                }
                
                return this.fuzzyMatch(spoken, expected);
            }

            revealWord(wordIndex) {
                const wordSpan = document.querySelector(\`[data-index="\${wordIndex}"]\`);
                if (wordSpan) {
                    this.revealWordByElement(wordSpan);
                }
            }

            revealWordByElement(wordElement) {
                if (wordElement) {
                    wordElement.style.visibility = 'visible';
                    wordElement.style.opacity = '1';
                    wordElement.style.color = '#b8860b';
                    wordElement.classList.add('revealed');
                    
                    wordElement.style.transform = 'scale(1.2)';
                    wordElement.style.textShadow = '0 0 10px rgba(184, 134, 11, 0.5)';
                    
                    setTimeout(() => {
                        wordElement.style.transform = 'scale(1)';
                        wordElement.style.textShadow = 'none';
                        wordElement.style.color = '#ffffff';
                    }, 500);
                }
            }

            completeAyah() {
                this.showStatus('أحسنت! تم إكمال الآية بنجاح', 'success');
                
                const words = document.querySelectorAll('.word');
                words.forEach(word => {
                    word.style.visibility = 'visible';
                    word.style.opacity = '1';
                    word.style.backgroundColor = 'rgba(184, 134, 11, 0.3)';
                    word.style.color = '#b8860b';
                    word.classList.add('revealed');
                });

                setTimeout(() => {
                    this.currentAyahIndex++;
                    this.loadCurrentAyah();
                    
                    if (this.currentAyahIndex < this.ayahs.length) {
                        this.showStatus('الآية التالية جاهزة للتلاوة', 'info');
                    }
                }, 3000);
            }

            skipAyah() {
                this.currentAyahIndex++;
                this.loadCurrentAyah();
                this.showStatus('تم تخطي الآية', 'warning');
            }

            smartComplete() {
                if (this.isMultiVerseMode) {
                    this.smartCompleteMultiVerse();
                } else {
                    this.smartCompleteSingleVerse();
                }
            }

            smartCompleteSingleVerse() {
                const currentAyah = this.ayahs[this.currentAyahIndex];
                const expectedWords = currentAyah.text.split(' ');
                
                for (let i = this.currentWordIndex; i < expectedWords.length; i++) {
                    this.revealWord(i);
                }
                
                this.completeBtn.style.display = 'none';
                this.showStatus('تم الإكمال الذكي للآية! 🎉', 'success');
                
                setTimeout(() => {
                    this.currentAyahIndex++;
                    this.loadCurrentAyah();
                    
                    if (this.currentAyahIndex < this.ayahs.length) {
                        this.showStatus('الآية التالية جاهزة للتلاوة', 'info');
                    }
                }, 2000);
            }

            smartCompleteMultiVerse() {
                const allWordElements = document.querySelectorAll('.word');
                
                for (let i = this.currentWordIndex; i < allWordElements.length; i++) {
                    this.revealWordByElement(allWordElements[i]);
                }
                
                this.completeBtn.style.display = 'none';
                this.showStatus('تم الإكمال الذكي للآيات! 🎉', 'success');
                
                const lastWordAyah = parseInt(allWordElements[allWordElements.length - 1]?.getAttribute('data-ayah'));
                const versesCompleted = lastWordAyah - this.currentAyahIndex + 1;
                
                setTimeout(() => {
                    this.currentAyahIndex += versesCompleted;
                    this.loadCurrentAyah();
                    
                    if (this.currentAyahIndex < this.ayahs.length) {
                        this.showStatus('الآيات التالية جاهزة للتلاوة', 'info');
                    }
                }, 2000);
            }

            completeSurah() {
                this.stopListening();
                this.ayahText.innerHTML = \`
                    <div class="text-center">
                        <i class="fas fa-trophy fa-3x mb-3" style="color: #b8860b;"></i>
                        <h3 style="color: #b8860b; font-family: 'Quranic';">مبارك! تم إكمال السورة</h3>
                        <p style="color: rgba(255, 255, 255, 0.8); font-family: 'Quranic';">أحسنت في تلاوة السورة</p>
                    </div>
                \`;
                this.showStatus('تم إكمال السورة بنجاح!', 'success');
            }

            updateProgress() {
                const progress = ((this.currentAyahIndex) / this.ayahs.length) * 100;
                this.progressBar.style.width = progress + '%';
                this.progressBar.setAttribute('aria-valuenow', progress);
            }

            normalizeArabic(text) {
                return text
                    .replace(/[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]/g, '')
                    .replace(/[أإآا]/g, 'ا')
                    .replace(/[ةه]/g, 'ه')
                    .replace(/[يى]/g, 'ى')
                    .replace(/[وؤ]/g, 'و')
                    .replace(/[ئء]/g, 'ا')
                    .replace(/[^\\u0600-\\u06FF\\s]/g, '')
                    .replace(/\\s+/g, ' ')
                    .trim()
                    .toLowerCase();
            }

            fuzzyMatch(spoken, expected) {
                const spokenClean = spoken.replace(/\\s+/g, '');
                const expectedClean = expected.replace(/\\s+/g, '');
                
                if (spokenClean.includes(expectedClean) || expectedClean.includes(spokenClean)) return true;
                
                const similarity = this.calculateSimilarity(spokenClean, expectedClean);
                return similarity > 0.30;
            }

            calculateSimilarity(a, b) {
                const matrix = [];
                const lenA = a.length;
                const lenB = b.length;

                for (let i = 0; i <= lenA; i++) {
                    matrix[i] = [i];
                }
                for (let j = 0; j <= lenB; j++) {
                    matrix[0][j] = j;
                }

                for (let i = 1; i <= lenA; i++) {
                    for (let j = 1; j <= lenB; j++) {
                        if (a[i - 1] === b[j - 1]) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(
                                matrix[i - 1][j - 1] + 1,
                                matrix[i][j - 1] + 1,
                                matrix[i - 1][j] + 1
                            );
                        }
                    }
                }

                const maxLen = Math.max(lenA, lenB);
                return maxLen === 0 ? 1 : 1 - matrix[lenA][lenB] / maxLen;
            }

            showStatus(message, type = 'info') {
                this.statusMessage.className = \`status-alert alert-\${type}\`;
                this.statusMessage.textContent = message;
                this.statusMessage.style.display = 'block';
                
                setTimeout(() => {
                    this.statusMessage.style.display = 'none';
                }, 5000);
            }
        }
    </script>
    </style>
</body>
</html>`;
};

// Write the full HTML file
fs.writeFileSync('docs/index.html', createFullHTML());
console.log('✅ Created complete index.html for GitHub Pages');

console.log('\n🎉 Build complete!');
console.log('📁 All files are ready in the docs/ folder');
console.log('🌐 Your full Quran Platform will be available at: https://yassin287.github.io/quraan');
console.log('\n📋 Next steps:');
console.log('1. Push to GitHub: git add . && git commit -m "Complete Quran Platform" && git push');
console.log('2. Enable GitHub Pages from docs/ folder in repository settings');
console.log('3. Wait 5-10 minutes for deployment');
