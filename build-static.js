const fs = require('fs');
const path = require('path');
const request = require('request');

// Create docs directory for GitHub Pages
if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
}

// Copy static assets to docs folder
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
        console.log(`Copied ${file}`);
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
    console.log('Copied images folder');
}

// Create a simple index.html for GitHub Pages
const indexHTML = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>القرآن الكريم - Quran Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-xxl">
            <a class="navbar-brand d-flex" href="/">
                <i class="fas fa-mosque" style="margin-left: 10px; font-size: 1.8rem;"></i>
                القرآن الكريم
            </a>
        </div>
    </nav>

    <div class="container my-5">
        <main class="container-fluid d-flex justify-content-center align-items-center mb-5">
            <div class="container ayah-container d-flex justify-content-center flex-column">
                <div class="text-center">
                    <h1 style="color: #b8860b; font-family: 'Quranic'; margin-bottom: 30px;">مرحباً بكم في منصة القرآن الكريم</h1>
                    <p style="font-size: 1.5rem; color: #ffffff; margin-bottom: 30px;">
                        تطبيق حديث وجميل لقراءة واستكشاف القرآن الكريم
                    </p>
                    <div style="margin-bottom: 30px;">
                        <p style="font-family: 'Quranic'; font-size: 2rem; color: #d4af37;">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-md-4 mb-3">
                            <div class="card h-100" style="background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border: 2px solid #b8860b;">
                                <div class="card-body text-center">
                                    <i class="fas fa-book-open fa-3x mb-3" style="color: #b8860b;"></i>
                                    <h5 style="color: #b8860b;">قراءة القرآن</h5>
                                    <p style="color: #ffffff;">جميع السور بالنص العربي الأصيل</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card h-100" style="background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border: 2px solid #b8860b;">
                                <div class="card-body text-center">
                                    <i class="fas fa-volume-up fa-3x mb-3" style="color: #b8860b;"></i>
                                    <h5 style="color: #b8860b;">التلاوة الصوتية</h5>
                                    <p style="color: #ffffff;">بصوت الشيخ مشاري راشد العفاسي</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card h-100" style="background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border: 2px solid #b8860b;">
                                <div class="card-body text-center">
                                    <i class="fas fa-search fa-3x mb-3" style="color: #b8860b;"></i>
                                    <h5 style="color: #b8860b;">البحث المتقدم</h5>
                                    <p style="color: #ffffff;">بحث ذكي في القرآن الكريم</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <a href="https://github.com/yassin287/quraan" class="btn btn-lg" style="background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%); color: #000000; border: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">
                            <i class="fab fa-github"></i> عرض المشروع على GitHub
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <footer class="py-3 mt-5">
        <div class="container text-center">
            <p>&copy; Yassin Moustafa 2025 - <a href="https://github.com/yassin287" target="_blank" class="github-link">GitHub</a></p>
            <p style="color: #b8860b; font-family: 'Quranic';">
                "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"
            </p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

fs.writeFileSync('docs/index.html', indexHTML);
console.log('Created index.html for GitHub Pages');
console.log('\\nBuild complete! Upload the docs folder to GitHub Pages.');
console.log('Your site will be available at: https://yassin287.github.io/quraan');
