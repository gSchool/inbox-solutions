# JavaScript Inbox

This is a solution to the JavaScript Inbox project described here:

http://howto.galvanize.com/tutorials/2015-05-07-javascript-inbox/

## Setup

Ensure you have

* node installed
* mongo installed and running

Then run:

```
npm install -g nodemon
npm install
cp .env{.example,}
```

Check in `.env` to make sure your database url looks good, then seed the database with:

```
node seed.js
```

## Running the app

To start the app run:

```
npm start
```

Then open up `http://localhost:3000`
