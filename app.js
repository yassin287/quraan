const express = require("express");
const { write } = require("fs");
const https = require("https");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const app = express();
const fs = require("fs");
const request = require("request");
var path = require("path");
const { url } = require("inspector");

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, "public"))); //  "public" off of current is root

app.get("/", function (req, res) {
	const randomAyah = Math.floor(Math.random() * 6232) + 1;
	const url = "https://api.alquran.cloud/v1/ayah/" + randomAyah + "/editions/quran-uthmani,en.asad,en.pickthall,ar.muyassar,ar.alafasy";
	let options = { json: true };
	request(url, options, (error, response, body) => {
		if (error) {
			return console.log(error);
		}

		if (!error && res.statusCode == 200) {
			// do something with JSON, using the 'body' variable
			const ayahText = body.data[0].text;
			const ayahNum = body.data[1].numberInSurah;
			const surah = body.data[1].surah.name;
			const juz = body.data[1].juz;
			const pageNum = body.data[1].page;
			const tafsirText = body.data[3].text;
			const audio = body.data[4].audio;
			request("http://api.alquran.cloud/v1/surah", options, (err, response, surahLinks) => {
				res.render("home", {
					ayahText: ayahText,
					ayahNumber: ayahNum,
					surah: surah,
					juz: juz,
					pageNumber: pageNum,
					tafsir: tafsirText,
					audio: audio,
					surahLinks: surahLinks.data,
				});
			});
		}
	});
});

// New route for surah list
app.get("/surahs", (req, res) => {
	let options = { json: true };
	request("http://api.alquran.cloud/v1/surah", options, (error, response, body) => {
		if (error) {
			return console.log(error);
		}
		if (!error && response.statusCode == 200) {
			res.render("surahs", {
				surahs: body.data
			});
		}
	});
});

// New route for search
app.get("/search", (req, res) => {
	let options = { json: true };
	request("http://api.alquran.cloud/v1/surah", options, (error, response, body) => {
		if (error) {
			return console.log(error);
		}
		if (!error && response.statusCode == 200) {
			res.render("search", {
				surahLinks: body.data
			});
		}
	});
});

// Search API endpoint
app.post("/api/search", async (req, res) => {
	const searchTerm = req.body.searchTerm;
	if (!searchTerm || searchTerm.trim() === '') {
		return res.json({ results: [] });
	}

	// Normalize Arabic text by removing diacritics
	const normalizeArabic = (text) => {
		return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
	};

	const normalizedSearch = normalizeArabic(searchTerm.trim());
	let allResults = [];

	try {
		// Search through all surahs
		const searchPromises = [];
		for (let i = 1; i <= 114; i++) {
			const url = `https://api.alquran.cloud/v1/surah/${i}/ar.muyassar`;
			const promise = new Promise((resolve) => {
				request(url, { json: true }, (error, response, body) => {
					if (!error && response && response.statusCode == 200) {
						const surahData = body.data;
						const surahResults = [];
						surahData.ayahs.forEach(ayah => {
							const normalizedAyah = normalizeArabic(ayah.text);
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
						resolve(surahResults);
					} else {
						resolve([]);
					}
				});
			});
			searchPromises.push(promise);
		}

		// Wait for all requests to complete
		const results = await Promise.all(searchPromises);
		allResults = results.flat();
		
		res.json({ results: allResults.slice(0, 50) }); // Limit to 50 results
	} catch (error) {
		console.error('Search error:', error);
		res.status(500).json({ error: 'حدث خطأ أثناء البحث' });
	}
});

app.get("/surah/:choosenSurah", (req, res) => {
	let choosenSurah = req.params.choosenSurah.trim();
	let url = `https://api.alquran.cloud/v1/surah/${choosenSurah}/editions/quran-uthmani,ar.muyassar,ar.alafasy`;
	let options = { json: true };
	request(url, options, (error, response, body) => {
		if (error) {
			return console.log(error);
		}
		if (!error && res.statusCode == 200) {
			const surahArray = body.data[0].ayahs;
			const surahText = surahArray?.map((i) => {
				return i.text;
			});
			const surah = body.data[0].name;
			const juz = body.data[0].ayahs[0].juz;
			const numberInQuran = body.data[0].number;
			const tafsirArray = body.data[1].ayahs;
			const tafsirText = tafsirArray?.map(function (i) {
				return i.text;
			});
			const numberOfAyahs = body.data[2].numberOfAyahs;
			const audioObject = body.data[2].ayahs;
			const audioArray = audioObject?.map((i) => {
				return i.audio;
			});
			request("http://api.alquran.cloud/v1/surah", options, (err, response, surahLinks) => {
				res.render("surah", {
					surahText: surahText,
					surah: surah,
					juz: juz,
					numberInQuran: numberInQuran,
					tafsir: tafsirText,
					audioArray: audioArray,
					surahLinks: surahLinks.data,
					numberOfAyahs: numberOfAyahs,
				});
			});
		}
	});
});
app.listen(process.env.PORT || 3000, function () {
	console.log("server is running ON Port 3000");
});
