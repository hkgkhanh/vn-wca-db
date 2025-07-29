# vnca-db
statics json files for all Vietnamese WCA exports

## Why?
We are developing a website for the Vietnam Cube Association, a national Rubik's Cube organization and community. Fetching data from the [Unofficial WCA API](https://wca-rest-api.robiningelbrecht.be/) or the [WCA API v0](https://docs.worldcubeassociation.org/knowledge_base/v0_api.html) can be slow, especially for custom queries such as sum of ranks or kinch scores.

To make our website faster and more reliable, we decided to create a static file-based API. This solution lets us serve data quickly without needing a paid database service.

The data is fetched twice a week on Tuesday 00:00 UCT and Friday 00:00 UCT, from the [Unofficial WCA API](https://wca-rest-api.robiningelbrecht.be/).