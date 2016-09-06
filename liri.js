var param1 = process.argv[2]; //first parameter which takes commands like "my-tweets" or "spotify-this-song"
var param2 = process.argv.slice(3); //second parameter which takes specific info for spotify/movies

//var moment = require('moment'); //Node Moment.js  this allows date/time formatting in Twitter

//Twitter API ----------------------------------------------------------------------------------
function runTwitter() {
	var keys = require('./keys.js');
	var keyList = keys.twitterKeys;
	var Twitter = require('twitter');
	var client = new Twitter(keyList);

	client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=sexi_coder_boi&count=20', function(err, tweets, response){
		if (err){
			console.log('Error occured: ' + err);
		}
		//console.log(JSON.stringify(tweets, null, 2));  //this is to see the entire JSON object
		for (var i = 0; i < tweets.length; i++){
			console.log("-------------------------");
		 	console.log("Tweet: " + tweets[i].text);
		 	console.log("Tweeted at: " + tweets[i].created_at);
		 	//console.log("Tweeted at: " + moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm a'));
		 	//console.log("Tweeted at: " + moment(tweets[i].created_at, 'dd MM Do hh:mm:ss YYYY').format('MMMM Do YYYY, h:mm a'));		 	
		}
	});
	appendFile(param1, param2);
}

//Spotify API ----------------------------------------------------------------------------------
function runSpotify(searchTerm){
	var spotify = require('spotify');

	spotify.search({type: 'track', query: searchTerm}, function(err, data){
		if (err){
			console.log('Error occured: ' + err);
		}
		//console.log(JSON.stringify(data, null, 2));
		console.log("-------------------------");
		console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
		console.log("Track Name: " + data.tracks.items[0].name);
		console.log("Album Name: " + data.tracks.items[0].album.name);
		console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("-------------------------");
	});
	appendFile(param1, param2);
}

//OMDB API----------------------------------------------------------------------------------
function runOMDB(searchTerm){
	var request = require('request');

	request('http://www.omdbapi.com/?t=' + searchTerm + '&y=&plot=short&tomatoes=true&r=json', function (err, response, body){
		if (!err && response.statusCode == 200) {
			//console.log(JSON.stringify(body, null, 2));
			console.log("-------------------------");
			console.log("Movie Title: " + JSON.parse(body)["Title"]);
			console.log("Release Year: " + JSON.parse(body)["Year"]);
			console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
			console.log("Country where movie produced: " + JSON.parse(body)["Country"]);
			console.log("Language: " + JSON.parse(body)["Language"]);
			console.log("Plot: " + JSON.parse(body)["Plot"]);
			console.log("Starring: " + JSON.parse(body)["Actors"]);
			console.log("Rotten Tomato Rating: " + JSON.parse(body)["tomatoRating"]);
			console.log("Rotten Tomato Rating: " + JSON.parse(body)["tomatoURL"]);
			console.log("-------------------------");
		}
	});	
	appendFile(param1, param2);
}

//createMovieQuery will convert spaces in movie title to '+' for the OMDB search query
function createMovieQuery(string){
	var newQuery = string.replace(' ', '+');
	return newQuery;
}

//Random----------------------------------------------------------------------------------
function runRandom() { //this will run whatever command is  in random.txt
	var fs = require('fs');
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err){
			console.log("Error found: " + err);
		}
		var dataArr = data.split(',');
		if (dataArr[0] === "my-tweets"){
			runTwitter();
		} else if (dataArr[0] === "spotify-this-song"){
			runSpotify(dataArr[1]);
		} else if (dataArr[0] === "movie-this"){
			runOMDB(dataArr[1]);
		}
	});
}

function appendFile(a, b) { //append each command into the log.txt file
	if (b.length == 0) {
		var combined = a + ", ";
	} else {
		var combinedArr = b.join(' ');
		var combined = a + " " + combinedArr + ", ";
	}
	var fs = require('fs');

	fs.appendFile('log.txt', combined, function(err){
		if (err){
			console.log("Error found: " + err);
		} else {
			console.log("content added to log.txt");
		}
	});
}

//switch statement that will run a function based on what command user gives
switch (param1) {
	case "my-tweets":
		runTwitter();
		break;
	case "spotify-this-song":
		if (param2.length == 0){ //checks if user specified and put a 2nd search paramter or not
			runSpotify('the sign ace of base');
			break;
		} else {
			runSpotify(param2);
			break;
		}
	case "movie-this":
		if (param2.length == 0){
			var nobody = createMovieQuery('Mr. Nobody'); // if user did not specify search, then defaults to Mr Nobdy
			runOMDB(nobody);
			break;
		} else {
			runOMDB(param2);
			break;
		}
	case "do-what-it-says":
		runRandom();
		break;
}
