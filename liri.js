var param1 = process.argv[2]; //first parameter which takes commands like "my-tweets" or "spotify-this-song"
var param2 = process.argv.slice(3); //second parameter which takes specific info for spotify/movies

//var moment = require('moment'); //Node Moment.js  this allows date/time formatting in Twitter

//Twitter API -----------------------------------------
function runTwitter() {
	var keys = require('./keys.js');
	var keyList = keys.twitterKeys;

	var Twitter = require('twitter');
	var client = new Twitter(keyList);
	// for (var twit in keyList){
		//console.log(keyList[twit]);
	// }

	client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=sexi_coder_boi&count=20', function(err, tweets, response){
		if (err){
			console.log('Error occured: ' + err);
		}
		//console.log(JSON.stringify(tweets, null, 2));
		for (var i = 0; i < tweets.length; i++){
			console.log("-------------------------");
		 	console.log("Tweet: " + tweets[i].text);
		 	console.log("Tweeted at: " + tweets[i].created_at);
		 	//console.log("Tweeted at: " + moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm a'));
		 	//console.log("Tweeted at: " + moment(tweets[i].created_at, 'dd MM Do hh:mm:ss YYYY').format('MMMM Do YYYY, h:mm a'));		 	
		}
	});
}

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
}

//run OMDB API
function runOMDB(searchTerm){
	var request = require('request');
		//var movieName = param2.join('+');

	request('http://www.omdbapi.com/?t=' + searchTerm + '&y=&plot=short&r=json', function (err, response, body){

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
			console.log("-------------------------");
		}
	});	
}

//createMovieQuery will convert spaces in movie title to '+' for the OMDB search query
function createMovieQuery(string){
	var newQuery = string.replace(' ', '+');
	return newQuery;
}

function runRandom() {
	
}

if (param1 === "my-tweets"){
	runTwitter();
}
if (param1 === "spotify-this-song" && param2.length == 0){ //check if user put in a search parameter for spotify
	runSpotify('the sign ace of base'); //if not, this is the default search term
} else if (param1 === "spotify-this-song"){
	runSpotify(param2); //else, run spotify api using what user typed in as search parameter
}
if (param1 === "movie-this" && param2.length == 0){
	var nobody = createMovieQuery('Mr. Nobody');
	runOMDB(nobody);
} else if (param1 === "movie-this") {
	runOMDB(param2);
}
if (param1 === "do-what-it-says"){
	//take text from random.txt
}





