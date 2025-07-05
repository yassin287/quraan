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
                        <a class="nav-link" href="#" onclick="showPrayerTimes()">أوقات الصلاة</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link" href="https://github.com/yassin287/quraan" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
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
            <p>&copy; Yassin Moustafa 2025 - <a href="https://github.com/yassin287" target="_blank" class="github-link">GitHub</a></p>
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
                const response = await fetch(\`\${API_BASE}/ayah/\${randomAyah}/editions/quran-uthmani,en.asad,ar.muyassar,ar.alafasy\`);
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
                const response = await fetch(\`\${API_BASE}/surah/\${surahNumber}/editions/quran-uthmani,ar.muyassar,ar.alafasy\`);
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
                            <p class="fs-3">القارئ الشيخ: مشاري راشد العفاسي</p>
                            <div class="btns d-flex">
                                <i id="pause" class="fa-solid fa-pause" onclick="pauseAudio()"></i>
                                <i id="player" class="fa-solid fa-play" onclick="playAudio()"></i>
                            </div>
                        </div>
                        
                        <audio id="surahAudio" class="d-none" controls></audio>
                        
                        <p class="fs-1 text-center ayat mb-4" onclick="playBasmala()" id="ayah-0">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                        
                        <div class="ayah-content fs-1" style="line-height: 2.5;">
                            \${renderAyahs(surahData.ayahs, audioData.ayahs)}
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
            initializeSurahAudio(audioData.ayahs);
        }
        
        // Render ayahs
        function renderAyahs(ayahs, audioAyahs) {
            return ayahs.map((ayah, index) => {
                const ayahText = index === 0 ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '') : ayah.text;
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
        function initializeSurahAudio(audioAyahs) {
            window.currentAudioArray = audioAyahs.map(ayah => ayah.audio);
            window.currentAudioIndex = 0;
            
            const audio = document.getElementById('surahAudio');
            audio.src = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
            
            audio.onended = function() {
                const currentAyah = document.getElementById(\`ayah-\${window.currentAudioIndex}\`);
                if (currentAyah) currentAyah.classList.remove('active');
                
                if (window.currentAudioIndex < window.currentAudioArray.length) {
                    if (window.currentAudioArray[window.currentAudioIndex] !== "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3") {
                        window.currentAudioIndex++;
                    }
                    if (window.currentAudioIndex < window.currentAudioArray.length) {
                        audio.src = window.currentAudioArray[window.currentAudioIndex];
                        audio.play();
                        window.currentAudioIndex++;
                        
                        const nextAyah = document.getElementById(\`ayah-\${window.currentAudioIndex}\`);
                        if (nextAyah) nextAyah.classList.add('active');
                    }
                }
            };
        }
        
        // Audio control functions
        function playBasmala() {
            const audio = document.getElementById('surahAudio');
            audio.src = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
            audio.play();
            
            document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
            document.getElementById('ayah-0').classList.add('active');
        }
        
        function playAyahInSurah(audioUrl, element) {
            const audio = document.getElementById('surahAudio');
            audio.src = audioUrl;
            audio.play();
            
            document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
            element.classList.add('active');
        }
        
        function playAudio() {
            const audio = document.getElementById('surahAudio');
            const playBtn = document.getElementById('player');
            const pauseBtn = document.getElementById('pause');
            
            if (audio.currentTime === 0) {
                audio.play();
                document.getElementById('ayah-0').classList.add('active');
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-stop');
            } else {
                playBtn.classList.remove('fa-stop');
                playBtn.classList.add('fa-play');
                audio.pause();
                audio.src = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
                window.currentAudioIndex = 0;
                audio.currentTime = 0;
                document.querySelectorAll('.ayat').forEach(ayah => ayah.classList.remove('active'));
            }
        }
        
        function pauseAudio() {
            const audio = document.getElementById('surahAudio');
            const pauseBtn = document.getElementById('pause');
            
            if (audio.currentTime === 0) return;
            
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
        
        // Prayer Times functionality
        function showPrayerTimes() {
            updateActiveNav('أوقات الصلاة');
            renderPrayerTimesPage();
        }
        
        function renderPrayerTimesPage() {
            const content = \`
            <div class="container my-5">
                <div class="text-center mb-4">
                    <h1 style="color: #b8860b; font-family: 'Quranic';">أوقات الصلاة</h1>
                    <p style="color: #ffffff;">اعرف أوقات الصلاة الخمس في موقعك</p>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-10">
                        <div class="prayer-times-card">
                            
                            <div class="location-header">
                                <div class="location-info">
                                    <h5 class="location-title">
                                        <i class="fas fa-map-marker-alt"></i>
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
                                
                                <div class="text-center mt-4">
                                    <div class="action-buttons">
                                        <button onclick="prayerTimesHandler.getUserLocation()" class="btn-primary">
                                            <i class="fas fa-sync-alt"></i> تحديث الأوقات
                                        </button>
                                        <button onclick="prayerTimesHandler.showManualLocationForm()" class="btn-secondary">
                                            <i class="fas fa-edit"></i> إدخال الموقع يدوياً
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Manual Location Form -->
                                <div id="manual-location-form" class="manual-form">
                                    <h6><i class="fas fa-map-marker-alt"></i> إدخال الموقع يدوياً</h6>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="manual-city">اسم المدينة:</label>
                                            <input type="text" id="manual-city" placeholder="مثال: القاهرة، الرياض، دبي">
                                        </div>
                                    </div>
                                    <div class="form-buttons">
                                        <button onclick="prayerTimesHandler.loadPrayerTimesByCity()" class="btn-primary">
                                            <i class="fas fa-search"></i> البحث عن الأوقات
                                        </button>
                                        <button onclick="prayerTimesHandler.hideManualLocationForm()" class="btn-secondary">
                                            <i class="fas fa-times"></i> إلغاء
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="prayer-error" class="error-message d-none">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span id="error-text"></span>
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
        
        // Prayer Times Handler
        const prayerTimesHandler = {
            userLocation: null,
            
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
                        console.error('Geolocation error:', error);
                        this.showError('فشل في تحديد الموقع تلقائياً. يرجى إدخال المدينة يدوياً.');
                        this.showManualLocationForm();
                    }
                );
            },

            async updateLocationDisplay() {
                if (!this.userLocation) return;

                try {
                    // Try Nominatim first
                    const nominatimUrl = \`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${this.userLocation.lat}&lon=\${this.userLocation.lng}&accept-language=ar\`;
                    const nominatimResponse = await fetch(nominatimUrl);
                    const nominatimData = await nominatimResponse.json();

                    if (nominatimData && nominatimData.address) {
                        const address = nominatimData.address;
                        let locationText = '';
                        
                        if (address.neighbourhood || address.suburb || address.district) {
                            locationText += (address.neighbourhood || address.suburb || address.district) + ' / ';
                        }
                        if (address.city || address.town || address.village) {
                            locationText += (address.city || address.town || address.village);
                        } else if (address.county) {
                            locationText += address.county;
                        } else if (address.state) {
                            locationText += address.state;
                        }

                        if (locationText) {
                            document.getElementById('coordinates').innerHTML = \`
                                <i class="fas fa-map-marker-alt location-icon"></i>
                                <span class="location-name">\${locationText}</span>
                            \`;
                            return;
                        }
                    }
                } catch (error) {
                    console.warn('Nominatim failed, trying BigDataCloud:', error);
                }

                try {
                    // Fallback to BigDataCloud
                    const bigDataUrl = \`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=\${this.userLocation.lat}&longitude=\${this.userLocation.lng}&localityLanguage=ar\`;
                    const bigDataResponse = await fetch(bigDataUrl);
                    const bigDataData = await bigDataResponse.json();

                    if (bigDataData) {
                        let locationText = '';
                        if (bigDataData.locality) {
                            locationText += bigDataData.locality + ' / ';
                        }
                        if (bigDataData.city) {
                            locationText += bigDataData.city;
                        } else if (bigDataData.principalSubdivision) {
                            locationText += bigDataData.principalSubdivision;
                        }

                        if (locationText) {
                            document.getElementById('coordinates').innerHTML = \`
                                <i class="fas fa-map-marker-alt location-icon"></i>
                                <span class="location-name">\${locationText}</span>
                            \`;
                            return;
                        }
                    }
                } catch (error) {
                    console.warn('BigDataCloud also failed:', error);
                }

                // Fallback to coordinates
                document.getElementById('coordinates').innerHTML = \`
                    <i class="fas fa-map-marker-alt location-icon"></i>
                    <span class="location-coords">\${this.userLocation.lat.toFixed(4)}°, \${this.userLocation.lng.toFixed(4)}°</span>
                \`;
            },

            async loadPrayerTimes() {
                if (!this.userLocation) {
                    this.showError('لم يتم تحديد الموقع بعد');
                    return;
                }

                try {
                    const today = new Date();
                    const response = await fetch(\`https://api.aladhan.com/v1/timings/\${today.getDate()}-\${today.getMonth() + 1}-\${today.getFullYear()}?latitude=\${this.userLocation.lat}&longitude=\${this.userLocation.lng}&method=4\`);
                    const data = await response.json();
                    
                    if (data.code === 200) {
                        this.displayPrayerTimes(data.data.timings);
                    } else {
                        throw new Error('API returned error');
                    }
                } catch (error) {
                    console.error('Prayer times error:', error);
                    this.showError('فشل في تحميل أوقات الصلاة. يرجى المحاولة مرة أخرى.');
                }
            },

            async loadPrayerTimesByCity() {
                const cityName = document.getElementById('manual-city').value.trim();
                if (!cityName) {
                    this.showError('يرجى إدخال اسم المدينة');
                    return;
                }

                try {
                    // Show loading
                    document.getElementById('coordinates').innerHTML = \`
                        <div class="location-loading">
                            <div class="mini-spinner"></div>
                            جاري البحث عن \${cityName}...
                        </div>
                    \`;

                    const today = new Date();
                    const response = await fetch(\`https://api.aladhan.com/v1/timingsByCity/\${today.getDate()}-\${today.getMonth() + 1}-\${today.getFullYear()}?city=\${encodeURIComponent(cityName)}&method=4\`);
                    const data = await response.json();
                    
                    if (data.code === 200) {
                        // Update location display with city name
                        document.getElementById('coordinates').innerHTML = \`
                            <i class="fas fa-map-marker-alt location-icon"></i>
                            <span class="location-name">\${cityName}</span>
                        \`;
                        
                        this.displayPrayerTimes(data.data.timings);
                        this.hideManualLocationForm();
                    } else {
                        throw new Error('City not found');
                    }
                } catch (error) {
                    console.error('City search error:', error);
                    this.showError('لم يتم العثور على المدينة. تأكد من اسم المدينة وحاول مرة أخرى.');
                }
            },

            displayPrayerTimes(timings) {
                const prayerNames = {
                    'Fajr': { ar: 'الفجر', icon: 'fa-sun' },
                    'Dhuhr': { ar: 'الظهر', icon: 'fa-sun' }, 
                    'Asr': { ar: 'العصر', icon: 'fa-sun' },
                    'Maghrib': { ar: 'المغرب', icon: 'fa-moon' },
                    'Isha': { ar: 'العشاء', icon: 'fa-moon' }
                };

                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                let nextPrayer = null;
                let minDiff = Infinity;

                let html = '';
                Object.keys(prayerNames).forEach(prayer => {
                    const time = timings[prayer];
                    const [hours, minutes] = time.split(':').map(Number);
                    const prayerTime = hours * 60 + minutes;
                    
                    let timeDiff = prayerTime - currentTime;
                    if (timeDiff < 0) timeDiff += 24 * 60; // Next day
                    
                    if (timeDiff < minDiff) {
                        minDiff = timeDiff;
                        nextPrayer = prayer;
                    }

                    const isNext = prayer === nextPrayer;
                    const cardClass = isNext ? 'prayer-card next-prayer' : 'prayer-card';

                    html += \`
                        <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
                            <div class="\${cardClass}">
                                <div class="prayer-icon">
                                    <i class="fas \${prayerNames[prayer].icon}"></i>
                                </div>
                                <h5 class="prayer-name">\${prayerNames[prayer].ar}</h5>
                                <div class="prayer-time">\${time}</div>
                                \${isNext ? '<div class="next-indicator">القادمة</div>' : ''}
                            </div>
                        </div>
                    \`;
                });

                document.getElementById('prayer-times').innerHTML = html;
                document.getElementById('prayer-times-loading').classList.add('d-none');
                document.getElementById('prayer-times-container').classList.remove('d-none');
                document.getElementById('prayer-error').classList.add('d-none');
            },

            showManualLocationForm() {
                document.getElementById('manual-location-form').style.display = 'block';
            },

            hideManualLocationForm() {
                document.getElementById('manual-location-form').style.display = 'none';
                document.getElementById('manual-city').value = '';
            },

            showError(message) {
                document.getElementById('error-text').textContent = message;
                document.getElementById('prayer-error').classList.remove('d-none');
                document.getElementById('prayer-times-loading').classList.add('d-none');
            },

            displayCurrentDate() {
                const today = new Date();
                
                // Gregorian date in Arabic
                const gregorianDate = today.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
                
                // Get proper Hijri date using improved calculation
                const hijriDate = this.getHijriDate(today);
                
                // Display both dates correctly
                document.getElementById('gregorian-date').textContent = gregorianDate;
                document.getElementById('hijri-date').textContent = hijriDate;
            },

            getHijriDate(date) {
                // Improved Hijri date calculation
                // Islamic calendar epoch: July 16, 622 CE (1 Muharram 1 AH)
                const islamicEpoch = new Date(622, 6, 16);
                const diffTime = date.getTime() - islamicEpoch.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // More accurate Islamic year calculation (354.367 days per year)
                const daysPerYear = 354.367;
                const hijriYear = Math.floor(diffDays / daysPerYear) + 1;
                const dayOfYear = Math.floor(diffDays % daysPerYear);
                
                const hijriMonths = [
                    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
                    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
                ];
                
                // Calculate month and day (alternating 30/29 days per month)
                let remainingDays = dayOfYear;
                let monthIndex = 0;
                const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Basic pattern
                
                for (let i = 0; i < 12; i++) {
                    if (remainingDays < monthLengths[i]) {
                        monthIndex = i;
                        break;
                    }
                    remainingDays -= monthLengths[i];
                }
                
                const dayOfMonth = remainingDays + 1;
                
                return \`\${Math.floor(dayOfMonth)} \${hijriMonths[monthIndex]} \${hijriYear}\`;
            }
        };
        
        // Initialize Prayer Times
        function initializePrayerTimes() {
            prayerTimesHandler.displayCurrentDate();
            prayerTimesHandler.getUserLocation();
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
        
        /* Prayer Times Styles */
        .prayer-times-card {
            background: linear-gradient(135deg, #333333 0%, #2d2d2d 100%);
            border: 2px solid #b8860b;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(184, 134, 11, 0.3);
        }

        .location-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #555555;
        }

        .location-info {
            margin-bottom: 15px;
        }

        .location-title {
            color: #b8860b;
            font-size: 1.3rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .location-text {
            color: #ffffff;
            font-size: 1.1rem;
            margin: 0;
        }

        .location-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #b8860b;
        }

        .location-icon {
            color: #28a745;
            margin-left: 8px;
        }

        .location-name {
            color: #ffffff;
            font-weight: 500;
        }

        .location-coords {
            color: #b8860b;
            font-family: monospace;
        }

        .date-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            color: #b8860b;
            font-size: 1.1rem;
            flex-wrap: wrap;
        }

        .date-item {
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
        }

        .date-separator {
            color: #b8860b;
            font-weight: bold;
        }

        .loading-section {
            padding: 40px 20px;
        }

        .custom-spinner {
            margin: 0 auto 20px;
            width: 50px;
            height: 50px;
            position: relative;
        }

        .spinner-circle {
            width: 100%;
            height: 100%;
            border: 4px solid #555555;
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
            
            /* Prayer Times Mobile Styles */
            .prayer-times-card {
                padding: 20px;
                margin: 0 10px;
            }
            
            .date-display {
                flex-direction: column;
                gap: 10px;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn-primary, .btn-secondary {
                width: 100%;
                max-width: 300px;
                justify-content: center;
            }
            
            .prayer-card {
                min-height: 140px;
                padding: 1rem;
            }
            
            .prayer-name {
                font-size: 1.1rem;
            }
            
            .prayer-time {
                font-size: 1.3rem;
            }
            
            .prayer-icon {
                font-size: 1.5rem;
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
