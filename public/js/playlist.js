// Song playlist data
const playlist = [
    {
      title: "Song 1",
      artist: "Artist 1",
      duration: "3:30"
    },
    {
      title: "Song 2",
      artist: "Artist 2",
      duration: "4:15"
    },
    {
      title: "Song 3",
      artist: "Artist 3",
      duration: "2:50"
    },
    {
      title: "Song 4",
      artist: "Artist 4",
      duration: "3:55"
    }
  ];
  
  // Compile Handlebars template
  const source = document.getElementById("playlist-template").innerHTML;
  const template = Handlebars.compile(source);
  
  // Generate the HTML playlist
  const context = { songs: playlist };
  const html = template(context);
  
  // Insert the playlist into the DOM
  document.getElementById("playlist-container").innerHTML = html;