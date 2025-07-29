// scripts/updateJson.js

const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, '../config.json'));

const API_URL = config.API_URL;
const UNCOUNTED_PEOPLE = config.UNCOUNTED_PEOPLE;

async function fetchCompetitions() {
	try {
		const OUTPUT_PATH = path.join(__dirname, '../api/competitions.json');
		console.log('Fetching data from API...');

		const response = await fetch(`${API_URL}/competitions/VN.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		console.log('Fetched data, saving to file...');

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

		console.log(`Data updated at: ${OUTPUT_PATH}`);
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

async function fetchChampionships() {
	try {
		const OUTPUT_PATH = path.join(__dirname, '../api/championships.json');
		console.log('Fetching data from API...');

		const response = await fetch(`${API_URL}/championships/VN.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		console.log('Fetched data, saving to file...');

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

		console.log(`Data updated at: ${OUTPUT_PATH}`);
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}









async function fetchData() {
	try {
		fetchCompetitions();
		fetchChampionships();
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

fetchData();