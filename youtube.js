/* put this in address bar as bookmarklet
javascript:(function(){var script = document.createElement("script");script.src="https://jefvlamings.github.io/youtube-playlist/youtube.js";document.body.appendChild(script);})();
*/


// create a div to show playlist in
var frame = document.createElement('div');
frame.setAttribute("id", "playlist");

// store array locally
var myStorageInsert = function(key, object) {
    window.localStorage.setItem(key, JSON.stringify(object));
};
// retrieve locally stored array
var myStorageGet = function(key) {
    return JSON.parse(window.localStorage.getItem(key));
};
// clear/empty local storage
var myStorageClear = function() {
    localStorage.clear();
	titles = myStorageGet("titles");
	dates = myStorageGet("dates");
	urls = myStorageGet("urls");	  
	showPlaylist(); 
};

// retrieve titles, dates and urls from database
var titles = myStorageGet("titles");
var dates = myStorageGet("dates");
var urls = myStorageGet("urls");

// retrieve current video information from this page
var currentVideo = document.getElementById('movie_player');
var currentTitle = document.getElementById('eow-title').getAttribute('title');
var currentDate = document.getElementById('eow-date').innerHTML;
var currentUrl = window.location.href;

currentVideo.addEventListener("onStateChange", "playNextInPlaylist");


//check if video exists in playlist
var duplicates = function(temporary,stored){
	for (i=0;i<stored.length;i++){
		if (temporary==stored[i]){
			return true;
			break;
		}
	}
};

var currentNumber = function(temporary,stored){
	for (i=0;i<stored.length;i++){
		if (temporary==stored[i]){
			return i;
			break;
		}
	}
};


var playNextInPlaylist = function(){
	var currentState = currentVideo.getPlayerState();
	if(currentState===0){
		console.log("ended");
		window.location.href = urls[1+currentNumber(currentTitle,titles)];
	}
	else{
		console.log("PLAYING");
	}	
}

	
	
// Video controls
var playVideo = function(){
	currentVideo.playVideo();
};
var pauseVideo = function(){
	currentVideo.pauseVideo();
};
var stopVideo = function(){
	currentVideo.stopVideo();
};








// Show playlist on top of youtube website
var output = function(){
	// if this is the first time --> create new empty array
	if(titles=== null){
	
			titles =[];
			dates =[];
			urls =[];
	};
	
	var samen= "";
	
	for(i=0;i<titles.length;i++){
		samen += "<li>"+i+".\
				 <a onClick='moveSongUp("+i+")'> - &uarr;</a>\
				 <a onClick='moveSongDown("+i+")'>  &darr; - </a>\
				 <a href='"+urls[i]+"'>"+titles[i].substring(0,30)+"</a>\
				 <a onClick='removeSong("+i+")'> - x</a>\
				 </li>";	
	}	
return "<h1><b><a onClick='addToPlaylist()'>+ Add video to playlist</a></b></h1><br><a onClick='playVideo()'>Play</a><a onClick='pauseVideo()'>Pause</a><a onClick='stopVideo()'>Stop</a><br><h2>Youtube playlist</h2><ul id='list'>"+samen+"</ul><br><h2>Playlist options</h2><a onClick='myStorageClear()'>Clear playlist</a><br><a onClick='hidePlaylist()'>Hide playlist</a>";	
}

// Show updated video playlist
var showPlaylist = function(){
	frame.innerHTML = "";
	frame.innerHTML = output();	
	frame.style.cssText = 'display: block; position:absolute; z-index: 1000000; padding: 20px; line-height: 200%;' 
	                  	 + 'top: 0px; right: 0px; background: #eee; box-shadow: 0 0 0 5px #E0E0E0; width: 250px;';
	document.body.insertBefore(frame, document.body.firstChild); 
};

// Show playlist when bookmarklet is called
showPlaylist();

// Hide video playlist
var hidePlaylist = function(){
	frame.style.cssText = 'display: none';
};

// Store all arrays in localstorage
var storeAll = function(){
	myStorageInsert("titles",titles);
	myStorageInsert("dates",dates);	
	myStorageInsert("urls",urls);	
};

// Add video to playlist 
var addToPlaylist = function(){

	// if the video is not in the playlist then add title, date and url to arrays
	if(duplicates(currentTitle,titles)!==true){
		titles.push(currentTitle);
		dates.push(currentDate);
		urls.push(currentUrl);
		
		storeAll();
		showPlaylist();				
	}
};


// remove video from playlist
function removeSong(nummer){
	titles.splice(nummer,1);
	dates.splice(nummer,1);
	urls.splice(nummer,1);
	
	storeAll();
	showPlaylist();		
};

// Move video one position up in playlist
function moveSongUp(nummer){
	titles.splice (nummer-1, 0, titles[nummer] );	
	titles.splice(nummer+1,1);	
	dates.splice (nummer-1, 0, dates[nummer] );		
	dates.splice(nummer+1,1);
	urls.splice (nummer-1, 0, urls[nummer] );		
	urls.splice(nummer+1,1);
	storeAll();
	showPlaylist();		
};

// Move video one position down in playlist
function moveSongDown(nummer){
	titles.splice (nummer+2, 0, titles[nummer] );	
	titles.splice(nummer,1);	
	dates.splice (nummer+2, 0, dates[nummer] );		
	dates.splice(nummer,1);
	urls.splice (nummer+2, 0, urls[nummer] );		
	urls.splice(nummer,1);
	storeAll();
	showPlaylist();			
};

