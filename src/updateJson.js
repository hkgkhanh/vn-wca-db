// scripts/updateJson.js

const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, './config.json'));

const API_URL = config.API_URL;
const UNCOUNTED_PEOPLE = config.UNCOUNTED_PEOPLE.map(person => person.personId);
const PAGE_ITEMS_LIMIT = config.PAGE_ITEMS_LIMIT;
const TYPES = config.TYPES;
const SHOWS = config.SHOWS;
const EVENT_CATEGORIES = config.EVENT_CATEGORIES;

async function fetchEvents() {
	try {
		const OUTPUT_PATH = path.join(__dirname, '../api/events.json');
		console.log('Fetching events from API...');

		const response = await fetch(`${API_URL}/events.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();
		console.log('Fetched comps, saving to file...');

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

		console.log(`Data updated at: ${OUTPUT_PATH}`);
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

async function fetchCompetitions() {
	try {
		const OUTPUT_PATH = path.join(__dirname, '../api/competitions.json');
		console.log('Fetching comps from API...');

		const response = await fetch(`${API_URL}/competitions/VN.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		for (let i = 0; i < data.items.length; i++) {
			const compResponse = await fetch(`${API_URL}/competitions/${data.items[i].id}.json`);
			if (!compResponse.ok) {
				throw new Error(`API returned status ${compResponse.status}`);
			}

			const compData = await compResponse.json();
			fs.writeFileSync(path.join(__dirname, `../api/competitions/${compData.id}.json`), JSON.stringify(compData, null, 2), 'utf-8');
		}

		console.log('Fetched comps, saving to file...');

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
		console.log('Fetching championships from API...');

		const response = await fetch(`${API_URL}/championships/VN.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		for (let i = 0; i < data.items.length; i++) {
			const compResponse = await fetch(`${API_URL}/championships/${data.items[i].id}.json`);
			if (!compResponse.ok) {
				throw new Error(`API returned status ${compResponse.status}`);
			}

			const compData = await compResponse.json();
			fs.writeFileSync(path.join(__dirname, `../api/championships/${compData.id}.json`), JSON.stringify(compData, null, 2), 'utf-8');
		}

		console.log('Fetched championships, saving to file...');

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

		console.log(`Data updated at: ${OUTPUT_PATH}`);
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

async function fetchPersons() {
	try {
		let persons = [];
		let events_paricipants = {
			"222": {
				"single": 0,
				"average": 0
			},
			"333": {
				"single": 0,
				"average": 0
			},
			"444": {
				"single": 0,
				"average": 0
			},
			"555": {
				"single": 0,
				"average": 0
			},
			"666": {
				"single": 0,
				"average": 0
			},
			"777": {
				"single": 0,
				"average": 0
			},
			"333oh": {
				"single": 0,
				"average": 0
			},
			"333bf": {
				"single": 0,
				"average": 0
			},
			"333fm": {
				"single": 0,
				"average": 0
			},
			"333mbf": {
				"single": 0,
				"average": 0
			},
			"444bf": {
				"single": 0,
				"average": 0
			},
			"555bf": {
				"single": 0,
				"average": 0
			},
			"clock": {
				"single": 0,
				"average": 0
			},
			"minx": {
				"single": 0,
				"average": 0
			},
			"pyram": {
				"single": 0,
				"average": 0
			},
			"skewb": {
				"single": 0,
				"average": 0
			},
			"sq1": {
				"single": 0,
				"average": 0
			}
		}
		console.log('Fetching persons from API...');

		const response = await fetch(`${API_URL}/persons-page-1.json`);
		if (!response.ok) {
			throw new Error(`API returned status ${response.status}`);
		}

		const data = await response.json();

		for (let i = 0; i < data.items.length; i++) {
			let person = data.items[i];
			if (person.country == "VN" && !UNCOUNTED_PEOPLE.includes(person.id)) {
				persons.push(person);
				fs.writeFileSync(path.join(__dirname, `../api/persons/${person.id}.json`), JSON.stringify(person, null, 2), 'utf-8');

				// update event participants count
				let rankSingle = person.rank.singles;
				let rankAvg = person.rank.averages;

				for (let j = 0; j < rankSingle.length; j++) {
					if (rankSingle[j].eventId in events_paricipants) events_paricipants[rankSingle[j].eventId]['single']++;
				}
				for (let j = 0; j < rankAvg.length; j++) {
					if (rankAvg[j].eventId in events_paricipants) events_paricipants[rankAvg[j].eventId]['average']++;
				}
			}
		}

		console.log("persons page 1 done");

		const fetchCount = Math.floor(data.total / data.pagination.size) - 1;

		for (let i = 0; i < fetchCount; i++) {
			const nextResponse = await fetch(`${API_URL}/persons-page-${i+2}.json`);
			if (!nextResponse.ok) {
				throw new Error(`API returned status ${nextResponse.status}`);
			}

			const nextData = await nextResponse.json();
			for (let j = 0; j < nextData.items.length; j++) {
				let person = nextData.items[j];
				if (person.country == "VN" && !UNCOUNTED_PEOPLE.includes(person.id)) {
					persons.push(person);
					fs.writeFileSync(path.join(__dirname, `../api/persons/${person.id}.json`), JSON.stringify(person, null, 2), 'utf-8');
				
					// update event participants count
					let rankSingle = person.rank.singles;
					let rankAvg = person.rank.averages;

					for (let k = 0; k < rankSingle.length; k++) {
						if (rankSingle[k].eventId in events_paricipants) events_paricipants[rankSingle[k].eventId]['single']++;
					}
					for (let k = 0; k < rankAvg.length; k++) {
						if (rankAvg[k].eventId in events_paricipants) events_paricipants[rankAvg[k].eventId]['average']++;
					}
				}
			}

			console.log(`persons page ${i+2} done`);
		}

		for (let i = 0; i < UNCOUNTED_PEOPLE.length; i++) {
			const ucPersonId = UNCOUNTED_PEOPLE[i];

			const response = await fetch(`${API_URL}/persons/${ucPersonId}.json`);
			if (!response.ok) {
				throw new Error(`API returned status ${response.status}`);
			}

			const data = await response.json();
			const singles = data.rank.singles;
			const averages = data.rank.averages;

			for (let j = 0; j < singles.length; j++) {
				if (singles[j].eventId in events_paricipants) events_paricipants[singles[j].eventId]['single']++;
			}

			for (let j = 0; j < averages.length; j++) {
				if (averages[j].eventId in events_paricipants) events_paricipants[averages[j].eventId]['average']++;
			}
		}

		console.log('Fetched persons, saving to file...');

		fs.writeFileSync(path.join(__dirname, `../data/events_participants.json`), JSON.stringify(events_paricipants, null, 2), 'utf-8');

		let index = 0;
		let pageCount = 1;
		let personsInPage = [];
		
		while (index < persons.length) {
			if (index != 0 && index % PAGE_ITEMS_LIMIT == 0) {
				fs.writeFileSync(path.join(__dirname, `../api/persons-page-${pageCount}.json`), JSON.stringify(personsInPage, null, 2), 'utf-8');

				personsInPage = [];
				pageCount++;
			}

			let person = persons[index];
			personsInPage.push(person);

			if (index == persons.length - 1) {
				fs.writeFileSync(path.join(__dirname, `../api/persons-page-${pageCount}.json`), JSON.stringify(personsInPage, null, 2), 'utf-8');

				personsInPage = [];
				pageCount++;
			}

			index++;
		}

	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

async function fetchRankings() {
	try {
		const eventsData = require(path.join(__dirname, '../api/events.json'));
		const events = eventsData.items;
		const types = TYPES;
		const shows = SHOWS;

		for (let p = 0; p < shows.length; p++) {
			let person_or_result = shows[p];

			for (let i = 0; i < events.length; i++) {
				let event = events[i].id;

				for (let j = 0; j < types.length; j++) {
					let type = types[j];

					// 1. get ranking
					const rankResponse = await fetch(`${API_URL}/rank/VN/${type}/${event}.json`);
					if (!rankResponse.ok) {
						console.log(`no result for ${event} ${type} ${person_or_result}`);
						fs.writeFileSync(path.join(__dirname, `../api/rank/${event}_${type}_100_${person_or_result}.json`), JSON.stringify([], null, 2), 'utf-8');
						continue; // probably because there is no result
					}

					const rankData = await rankResponse.json();
					let rankItems = rankData.items;

					if (rankItems.length > 100 + UNCOUNTED_PEOPLE.length) rankItems = rankItems.slice(0, 100 + UNCOUNTED_PEOPLE.length); // for now, only get the top 100 person

					// 2. get all results of these 100 people
					let wcaResults = [];
					let compDict = {};

					for (let k = 0; k < rankItems.length; k++) {
						let personId = rankItems[k].personId;

						if (UNCOUNTED_PEOPLE.includes(personId)) continue;

						const personData = require(path.join(__dirname, `../api/persons/${personId}.json`));
						const personResults = personData.results;

						for (const compId of Object.keys(personResults)) {
							if (!(event in personResults[compId])) {
								continue;
							}

							for (let l = 0; l < personResults[compId][event].length; l++) {
								let result = personResults[compId][event][l];

								if ((type == "single" && result.best <= 0) || (type == "average" && result.average <= 0)) continue; // ignore dnf results

								result['competitionId'] = compId;

								// 4. get comp name from the compId
								// still need to fetch external API because comp may not be in VN
								if (!(compId in compDict)) {
									const compRes = await fetch(`${API_URL}/competitions/${compId}.json`, {
										method: "GET",
									});

									if (!compRes.ok) {
										throw new Error(`API returned status ${response.status}`);
									}

									const compData = await compRes.json();

									result['competitionName'] = compData.name;
									compDict[compId] = compData.name;
								} else {
									result['competitionName'] = compDict[compId];
								}

								result['personId'] = personData.id;
								result['personName'] = personData.name;
								wcaResults.push(result);
							}
						}
					}

					// 3. sort results
					if (type == "average") {
						wcaResults.filter(item => item.average > 0);

						wcaResults.sort((a, b) => {
							const aVal = a.average;
							const bVal = b.average;

							if (aVal < 0 && bVal >= 0) return 1;   // a goes after b
							if (aVal >= 0 && bVal < 0) return -1;  // a goes before b

							return aVal - bVal; // normal ascending
						});
					} else if (type == "single") {
						wcaResults.filter(item => item.best > 0);
						
						wcaResults.sort((a, b) => {
							const aVal = a.best;
							const bVal = b.best;

							if (aVal < 0 && bVal >= 0) return 1;
							if (aVal >= 0 && bVal < 0) return -1;

							return aVal - bVal;
						});
					}

					// if the option is show top 100 person
					if (person_or_result == "person") {
						let seen = new Set();
						wcaResults = wcaResults.filter(item => {
							if (seen.has(item.personId)) return false;
							seen.add(item.personId);
							return true;
						});
					}

					if (wcaResults.length > 100) wcaResults = wcaResults.slice(0, 100); // again, only get top 100

					fs.writeFileSync(path.join(__dirname, `../api/rank/${event}_${type}_100_${person_or_result}.json`), JSON.stringify(wcaResults, null, 2), 'utf-8');
				}
			}
		}

	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

async function fetchSumOfRank() {
	let allProfiles = [];
	const events_participants = require(path.join(__dirname, '../data/events_participants.json'));

	const personFiles = fs.readdirSync(path.join(__dirname, '../api/persons'));

	personFiles.forEach(file => {
		if (path.extname(file) === '.json') {
			const filePath = path.join(path.join(__dirname, '../api/persons'), file);				
			const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			const personId = content.id;
			const personName = content.name;
			const personRank = content.rank;

			let rank = {
				"222": {
					"single": 0,
					"average": 0
				},
				"333": {
					"single": 0,
					"average": 0
				},
				"444": {
					"single": 0,
					"average": 0
				},
				"555": {
					"single": 0,
					"average": 0
				},
				"666": {
					"single": 0,
					"average": 0
				},
				"777": {
					"single": 0,
					"average": 0
				},
				"333oh": {
					"single": 0,
					"average": 0
				},
				"333bf": {
					"single": 0,
					"average": 0
				},
				"333fm": {
					"single": 0,
					"average": 0
				},
				"333mbf": {
					"single": 0,
					"average": 0
				},
				"444bf": {
					"single": 0,
					"average": 0
				},
				"555bf": {
					"single": 0,
					"average": 0
				},
				"clock": {
					"single": 0,
					"average": 0
				},
				"minx": {
					"single": 0,
					"average": 0
				},
				"pyram": {
					"single": 0,
					"average": 0
				},
				"skewb": {
					"single": 0,
					"average": 0
				},
				"sq1": {
					"single": 0,
					"average": 0
				}
			}

			for (let i = 0; i < personRank.singles.length; i++) {
				let eventId = personRank.singles[i].eventId;
				if (eventId in rank) rank[eventId].single = personRank.singles[i].rank.country;
			}

			for (let i = 0; i < personRank.averages.length; i++) {
				let eventId = personRank.averages[i].eventId;
				if (eventId in rank) rank[eventId].average = personRank.averages[i].rank.country;
			}

			for (const eventId in rank) {
				if (rank[eventId].single === 0)
					rank[eventId].single = events_participants[eventId].single + 1;

				if (rank[eventId].average === 0 && eventId != "333mbf")
					rank[eventId].average = events_participants[eventId].average + 1;
			}

			let sor = {};
			for (let i = 0; i < EVENT_CATEGORIES.length; i++) {
				let categoryId = EVENT_CATEGORIES[i].id;
				let categoryName = EVENT_CATEGORIES[i].name;
				let events = EVENT_CATEGORIES[i].events;

				sor[categoryId] = {
					"single": 0,
					"average": 0
				};

				for (let j = 0; j < events.length; j++) {
					let event = events[j];

					sor[categoryId].single += rank[event].single;
					sor[categoryId].average += rank[event].average;
				}
			}

			// allProfiles.push({personId, personName, rank, sor});
			let insertIndex = allProfiles.findIndex(p => sor.all.average < p.sor.all.average);

			if (insertIndex === -1) {
				allProfiles.push({ personId, personName, rank, sor });
			} else {
				allProfiles.splice(insertIndex, 0, { personId, personName, rank, sor });
			}
		}
	});

	for (let i = 0; i < EVENT_CATEGORIES.length; i++) {
		let categoryData = EVENT_CATEGORIES[i];
		let categoryId = categoryData.id;
		// let categoryName = categoryData.name;
		// let categoryEvents = categoryData.events;

		for (let j = 0; j < TYPES.length; j++) {
			let type = TYPES[j];

			allProfiles.sort((a, b) => a.sor[categoryId][type] - b.sor[categoryId][type]);

			let index = 0;
			let pageCount = 1;
			let profilesInPage = [];
			
			while (index < allProfiles.length) {
				if (index != 0 && index % PAGE_ITEMS_LIMIT == 0) {
					fs.writeFileSync(path.join(__dirname, `../api/rank/sor/${categoryId}_${type}-page-${pageCount}.json`), JSON.stringify(profilesInPage, null, 2), 'utf-8');

					profilesInPage = [];
					pageCount++;
				}

				let profile = allProfiles[index];
				profilesInPage.push(profile);

				if (index == allProfiles.length - 1) {
					fs.writeFileSync(path.join(__dirname, `../api/rank/sor/${categoryId}_${type}-page-${pageCount}.json`), JSON.stringify(profilesInPage, null, 2), 'utf-8');

					profilesInPage = [];
					pageCount++;
				}

				index++;
			}

			console.log(`sor ${categoryId} ${type} done`);
		}
	}
}

function calcKinch(result, nr, eventId) {
	if (eventId == "333mbf") {
		const resultStr = result.toString().padStart(9, '0'); // Ensure 9 digits
		const resultDD = parseInt(resultStr.slice(0, 2), 10);
		const resultTTTTT = parseInt(resultStr.slice(2, 7), 10);
		const resultMM = parseInt(resultStr.slice(7, 9), 10);

		const resultDifference = 99 - resultDD;
		const resultTimeInSeconds = resultTTTTT === 99999 ? null : resultTTTTT;
		const resultMissed = resultMM;
		const resultSolved = resultDifference + resultMissed;

		const resultKinch = resultSolved - resultMissed + 1 - resultTimeInSeconds/(60*60);
		
		const nrStr = nr.toString().padStart(9, '0'); // Ensure 9 digits
		const nrDD = parseInt(nrStr.slice(0, 2), 10);
		const nrTTTTT = parseInt(nrStr.slice(2, 7), 10);
		const nrMM = parseInt(nrStr.slice(7, 9), 10);

		const nrDifference = 99 - nrDD;
		const nrTimeInSeconds = nrTTTTT === 99999 ? null : nrTTTTT;
		const nrMissed = nrMM;
		const nrSolved = nrDifference + nrMissed;

		const nrKinch = nrSolved - nrMissed + 1 - nrTimeInSeconds/(60*60);

		return (resultKinch / nrKinch) * 100;
	}

	// other events
	return (nr / result) * 100;
}

async function fetchKinch() {
	let allProfiles = [];

	const personFiles = fs.readdirSync(path.join(__dirname, '../api/persons'));

	personFiles.forEach(file => {
		if (path.extname(file) === '.json') {
			const filePath = path.join(path.join(__dirname, '../api/persons'), file);				
			const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			const personId = content.id;
			const personName = content.name;
			const personRank = content.rank;

			let kinch = {
				"222": {
					"single": 0,
					"average": 0
				},
				"333": {
					"single": 0,
					"average": 0
				},
				"444": {
					"single": 0,
					"average": 0
				},
				"555": {
					"single": 0,
					"average": 0
				},
				"666": {
					"single": 0,
					"average": 0
				},
				"777": {
					"single": 0,
					"average": 0
				},
				"333oh": {
					"single": 0,
					"average": 0
				},
				"333bf": {
					"single": 0,
					"average": 0
				},
				"333fm": {
					"single": 0,
					"average": 0
				},
				"333mbf": {
					"single": 0,
					"average": 0
				},
				"444bf": {
					"single": 0,
					"average": 0
				},
				"555bf": {
					"single": 0,
					"average": 0
				},
				"clock": {
					"single": 0,
					"average": 0
				},
				"minx": {
					"single": 0,
					"average": 0
				},
				"pyram": {
					"single": 0,
					"average": 0
				},
				"skewb": {
					"single": 0,
					"average": 0
				},
				"sq1": {
					"single": 0,
					"average": 0
				}
			}

			let nr = {
				"222": {
					"single": 0,
					"average": 0
				},
				"333": {
					"single": 0,
					"average": 0
				},
				"444": {
					"single": 0,
					"average": 0
				},
				"555": {
					"single": 0,
					"average": 0
				},
				"666": {
					"single": 0,
					"average": 0
				},
				"777": {
					"single": 0,
					"average": 0
				},
				"333oh": {
					"single": 0,
					"average": 0
				},
				"333bf": {
					"single": 0,
					"average": 0
				},
				"333fm": {
					"single": 0,
					"average": 0
				},
				"333mbf": {
					"single": 0,
					"average": 0
				},
				"444bf": {
					"single": 0,
					"average": 0
				},
				"555bf": {
					"single": 0,
					"average": 0
				},
				"clock": {
					"single": 0,
					"average": 0
				},
				"minx": {
					"single": 0,
					"average": 0
				},
				"pyram": {
					"single": 0,
					"average": 0
				},
				"skewb": {
					"single": 0,
					"average": 0
				},
				"sq1": {
					"single": 0,
					"average": 0
				}
			}

			for (const eventId in nr) {
				let singleRankings = require(path.join(__dirname, `../api/rank/${eventId}_single_100_person.json`));
				if (singleRankings.length > 0) nr[eventId].single = singleRankings[0].best;

				let avgRankings = require(path.join(__dirname, `../api/rank/${eventId}_average_100_person.json`));
				if (avgRankings.length > 0) nr[eventId].average = avgRankings[0].average;
			}

			for (let i = 0; i < personRank.singles.length; i++) {
				let eventId = personRank.singles[i].eventId;
				if (eventId in kinch) kinch[eventId].single = calcKinch(personRank.singles[i].best, nr[eventId].single, eventId);
			}

			for (let i = 0; i < personRank.averages.length; i++) {
				let eventId = personRank.averages[i].eventId;
				if (eventId == "333mbf") continue;
				if (eventId in kinch) kinch[eventId].average = calcKinch(personRank.averages[i].best, nr[eventId].average, eventId);
			}

			let avgKinchScore = 0;
			let kinchScore = {
				"222": 0,
				"333": 0,
				"444": 0,
				"555": 0,
				"666": 0,
				"777": 0,
				"333oh": 0,
				"333bf": 0,
				"333fm": 0,
				"333mbf": 0,
				"444bf": 0,
				"555bf": 0,
				"clock": 0,
				"minx": 0,
				"pyram": 0,
				"skewb": 0,
				"sq1": 0
			}

			for (const eventId in kinchScore) {
				if (eventId == "444bf" || eventId == "555bf" || eventId == "333mbf") {
					kinchScore[eventId] = kinch[eventId].single;
					avgKinchScore += kinchScore[eventId];
					continue;
				}

				if (eventId == "333bf" || eventId == "333fm") {
					kinchScore[eventId] = kinch[eventId].single > kinch[eventId].average ? kinch[eventId].single : kinch[eventId].average;
					avgKinchScore += kinchScore[eventId];
					continue;
				}

				kinchScore[eventId] = kinch[eventId].average;
				avgKinchScore += kinchScore[eventId];
			}

			avgKinchScore /= 17;

			// allProfiles.push({ personId, personName, avgKinchScore, kinchScore });
			let insertIndex = allProfiles.findIndex(p => avgKinchScore > p.avgKinchScore);

			if (insertIndex === -1) {
				allProfiles.push({ personId, personName, avgKinchScore, kinchScore });
			} else {
				allProfiles.splice(insertIndex, 0, { personId, personName, avgKinchScore, kinchScore });
			}
		}
	});

	let index = 0;
	let pageCount = 1;
	let profilesInPage = [];
	
	while (index < allProfiles.length) {
		if (index != 0 && index % PAGE_ITEMS_LIMIT == 0) {
			fs.writeFileSync(path.join(__dirname, `../api/rank/kinch/page-${pageCount}.json`), JSON.stringify(profilesInPage, null, 2), 'utf-8');

			profilesInPage = [];
			pageCount++;
		}

		let profile = allProfiles[index];
		profilesInPage.push(profile);

		if (index == allProfiles.length - 1) {
			fs.writeFileSync(path.join(__dirname, `../api/rank/kinch/page-${pageCount}.json`), JSON.stringify(profilesInPage, null, 2), 'utf-8');

			profilesInPage = [];
			pageCount++;
		}

		index++;
	}
}

async function fetchData() {
	try {
		fetchEvents();
		fetchCompetitions();
		fetchChampionships();
		fetchPersons();
		fetchRankings();
		fetchSumOfRank();
		fetchKinch();
	} catch (err) {
		console.error('Failed to update JSON:', err);
		process.exit(1); // exit with error for GitHub Actions to mark it as failed
	}
}

fetchData();