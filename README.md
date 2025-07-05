# 🕌 القرآن الكريم - Quran Platform

A beautiful, modern web application for reading and exploring the Holy Quran with advanced features including search, audio playback, and Arabic text normalization.

![Quran Platform](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?style=for-the-badge&logo=express)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Complete Quran Text**: All 114 Surahs with authentic Arabic text
- **Audio Playback**: High-quality recitation by Sheikh Mishary Rashid Alafasy
- **Interactive Reading**: Click-to-play individual verses
- **Tafsir Integration**: Arabic commentary (Tafsir Muyassar) for better understanding

### 🔍 Advanced Search
- **Smart Search**: Find verses across the entire Quran
- **Arabic Normalization**: Search without diacritics (تشكيل)
- **Surah Search**: Filter and find specific Surahs instantly
- **Revelation Type Filter**: Filter by Meccan (مكية) or Medinan (مدنية) Surahs

### 🎨 User Interface
- **Islamic Design**: Beautiful gold and dark theme inspired by traditional Islamic art
- **Responsive Layout**: Perfect on desktop, tablet, and mobile devices
- **Arabic Typography**: Custom Quranic fonts for authentic reading experience
- **Smooth Animations**: Elegant transitions and hover effects

### 🎵 Audio Features
- **Verse-by-Verse Playback**: Click any verse to hear its recitation
- **Continuous Playback**: Auto-advance to next verse
- **Audio Controls**: Play, pause, and stop functionality
- **High-Quality Audio**: Crystal clear recitation from Islamic Network API

## 🚀 Live Demo

Visit the live application: [Quran Platform](https://yassin287.github.io/quraan)

## 📸 Screenshots

### Home Page - Random Verse
![Home Page](./public/images/home-screenshot.png)

### Surahs List with Search
![Surahs Page](./public/images/surahs-screenshot.png)

### Surah Reading View
![Surah View](./public/images/surah-screenshot.png)

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **EJS** - Templating engine
- **Request** - HTTP client for API calls

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with gradients and animations
- **JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5** - Responsive grid system
- **Font Awesome** - Beautiful icons

### APIs
- **Al Quran Cloud API** - Quran text, audio, and metadata
- **Islamic Network** - Audio recitations

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yassin287/quraan.git
   cd quraan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🗂️ Project Structure

```
quran-platform/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── Procfile              # Heroku deployment configuration
├── public/               # Static assets
│   ├── style.css         # Main stylesheet
│   ├── bootstrap.min.css # Bootstrap framework
│   ├── bootstrap.min.js  # Bootstrap JavaScript
│   ├── Al Qalam Quran.ttf # Arabic font
│   └── images/           # Image assets
├── views/                # EJS templates
│   ├── layout.ejs        # Main layout
│   ├── home.ejs          # Homepage
│   ├── surahs.ejs        # Surahs listing
│   ├── surah.ejs         # Individual Surah view
│   └── search.ejs        # Search page
└── README.md             # Project documentation
```

## 🎯 API Endpoints

### Main Routes
- `GET /` - Homepage with random verse
- `GET /surahs` - List all Surahs with search and filters
- `GET /surah/:id` - Individual Surah reading view
- `GET /search` - Advanced search interface
- `POST /api/search` - Search API endpoint

### External APIs Used
- **Al Quran Cloud API**: `https://api.alquran.cloud/v1/`
- **Audio Files**: `https://cdn.islamic.network/quran/audio/`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=production
```

### Audio Configuration
The application uses high-quality 128kbps audio files from Islamic Network. Audio files are streamed directly from CDN for optimal performance.

## 🌟 Key Features Explained

### Arabic Text Normalization
The search functionality includes advanced Arabic text normalization that removes diacritics (harakat/tashkeel), making search more user-friendly:

```javascript
function normalizeArabic(text) {
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u06EF-\u06FF]/g, '');
}
```

### Responsive Design
The application is fully responsive with breakpoints for:
- Mobile devices (< 576px)
- Tablets (576px - 768px)
- Desktop (> 768px)

### Audio Management
Smart audio management with:
- Background loading
- Error handling
- Smooth transitions between verses
- Visual feedback for currently playing verse

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from main branch

### GitHub Pages (Static Version)
For a static version, you can use GitHub Pages with a simple HTTP server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Test your changes thoroughly
3. Update documentation as needed
4. Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Al Quran Cloud API** for providing comprehensive Quran data
- **Islamic Network** for high-quality audio recitations
- **Sheikh Mishary Rashid Alafasy** for the beautiful recitation
- **Open Source Community** for the amazing tools and libraries

## 📞 Contact

**Yassin Moustafa**
- GitHub: [@yassin287](https://github.com/yassin287)
- Project Link: [https://github.com/yassin287/quraan](https://github.com/yassin287/quraan)

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Complete Quran text display
  - Audio playback functionality
  - Search and filter capabilities
  - Responsive design
  - Arabic text normalization

---

<div align="center">

**Made with ❤️ for the Muslim Community**

*"وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"*

*"And We send down of the Quran that which is healing and mercy for the believers"*

**[Quran 17:82]**

</div>
