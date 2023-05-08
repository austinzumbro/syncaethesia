var redirect_uri = "http://localhost:3001/index.html";

var user_id = '';
var user_secret = '';

const AUTHORIZE = "http://accounts.spotify.com/authorize";

function onPageLoad(){
    if (window.location.search.length > 0){
        handleRedirect();
    }
}

function handleRedirect(){
    let code = getCode();
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuth(){
    user_id = document.getElementById("userId").value;
    user_secret = document.getElementById("userSecret").value;
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("user_secret", user_secret); //may not need this because we don't want to see user secret privacy reasons
    
    // create auth url personalized to user
    let authorizedURL = AUTHORIZE;
    authorizedURL += "?user_id=" + user_id;
    authorizedURL += "&response_type=code";
    authorizedURL += "&redirect_uri=" + encodeURI(redirect_uri);
    authorizedURL += "&show_dialog=true";
    //scope we can change to what we want (for following, libraries, plalists etc): https://developer.spotify.com/documentation/web-api/concepts/scopes
    authorizedURL += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = authorizedURL; // show spotify's auth screen
}

const APIController = (function() {

    const userId = '';
    const userSecret = '';

    // private methods
    const getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(userId + ':' + userSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
})