# vnca-db
statics json files for all Vietnamese WCA exports

## Why?
We are developing a website for the Vietnam Cube Association, organization and community. Fetching data from the [Unofficial WCA API](https://wca-rest-api.robiningelbrecht.be/) or the [WCA API v0](https://docs.worldcubeassociation.org/knowledge_base/v0_api.html) can be slow, especially for custom queries such as sum of ranks or kinch scores.

To make our website faster and more reliable, we decided to create a static file-based API. This solution lets us serve data quickly without needing a paid database service.

The data is fetched every Wednesday 00:00 UCT from the [Unofficial WCA API](https://wca-rest-api.robiningelbrecht.be/).

## Contribute
There are profiles that no longer represent Vietnam region but are still being fetched by the [Unofficial WCA API](https://wca-rest-api.robiningelbrecht.be/). We have no choice but to filter these profiles out manually by adding their WCA ID to `src/config.json`. If you know such a profile that is not added to this directory yet, please let us know, thank you for your contribution!