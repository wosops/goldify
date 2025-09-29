![Goldify Logo](public/goldify_logo.png)
# Goldify
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/it-works-why.svg)](https://forthebadge.com)

## NOTE
Goldify has been deprecated as of January 24, 2022. Thank you to anyone that used this application, we hope you were able to craft quite the golden playlist for yourself! :)

---------------

Goldify is an application built to help you easily design your golden Spotify playlist. Built using Spotify's APIs, we provide you with an easy-to-use interface which presents you with all your top hits to build your personal playlist from. Within minutes, you will have a Spotify playlist that is molded exactly to your musical taste. We're excited for you to be here and can't wait for you to enjoy your golden tracks!

## Try it Yourself!

Visit [https://www.goldify.app](https://www.goldify.app) to get started.

## Demo
![Goldify Demo](public/goldify_demo.gif)

## Fork & Run Goldify

### Spotify API Configuration

Before building with Docker, you will need to create your own Spotify Developer App, if you haven't already done so. This can be done [https://developer.spotify.com/dashboard/](here).

Once you have completed this, you will need to create an `.env` file in the root directory of your forked repo. The contents should be as follows:

```
VITE_SPOTIFY_CLIENT_ID = "<YOUR_SPOTIFY_CLIENT_ID>"
VITE_SPOTIFY_CLIENT_SECRET = "<YOUR_SPOTIFY_CLIENT_SECRET>"
VITE_SPOTIFY_REDIRECT_URI = "<YOUR_SPOTIFY_CLIENT_REDIRECT_URI>"
```

### Running Goldify with Docker

To build with Docker, the following commands can be run:

```
docker-compose build
docker-compose up -d
```

If you prefer to run without Docker, you can also run the following:

```
npm ci
npm run dev
```

## Testing/Linting

All changes made to this repo should pass testing and linting standards, and will be checked by GitHub Actions.

To test and lint your changes locally, the following commands can be used:

```
docker-compose exec goldify npm test --silent
docker-compose exec goldify npm run lint --silent
```

If you are running Goldify without Docker, you can run the following:

```
npm test --silent
npm run lint --silent
```
