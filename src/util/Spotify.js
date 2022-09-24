const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

let accessToken;

const Spotify = {
    getAccessToken(){
        if (accessToken){
            return accessToken;
        }

        // check for an access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null,'/');
            return accessToken;} 
        
	// if there is no access token match, allow user to login to Spotify to get new access token
	else {
             const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
             window.location = accessUrl;

	// if user saved his/her login info in browser, seems like spotify embeds the access token, token_type, and expires_in as arguments into the window.location along with the redirectUri
		//
		//How do I check if the user is already logged in , or is it even necessary to?
		//
        // if this is the case, then check if accessToken and expiresIn info is in window and get the info

		// FOLLOWING CODE NEEDS TESTING
        if (accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null,'/');
            return accessToken;} 
 

	}
    },

    // Send the search term in the SearchBar to Spotify to get a list of relevant tracks.
    search (term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: {
                                                                                            Authorization: `Bearer ${accessToken}`
                                                                                          } 
                                                                               }).then(response => {
                                                                                   return response.json();
                                                                               }).then(jsonResponse => {
                                                                                   if (!jsonResponse.tracks){
                                                                                       return [];
                                                                                   }
                                                                                   return jsonResponse.tracks.items.map(track => ({
                                                                                       id: track.id,
                                                                                       name: track.name,
                                                                                       artist: track.artists[0].name,
                                                                                       album: track.album.name,
                                                                                       uri:track.uri
                                                                                   })

                                                                                   );
                                                                               });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me',{ headers: headers }
                ).then(response => response.json()
                ).then(jsonResponse => {
                    userId = jsonResponse.id
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ name: name })
                    }).then(response => response.json()
                    ).then(jsonResponse => {
                        const playlistId = jsonResponse.id;

                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris })
                        })

                    });
                });

    }

}

export default Spotify;
