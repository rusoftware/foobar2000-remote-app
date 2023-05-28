import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from './Player';
import Explorer from './Explorer';
import Tracklist from './Tracklist';
import Playlists from './Playlists';
import placeholderImg from './img/no-cover.jpeg';


// TODOs:
// - When select a song from a playlist it mark as selected (playing) all the same track-numbers (use indes)
// - Create a AppPlayer list if not exists and use allways that to play music through the app (others lists are just for navigation, when select one, copy into AppPlayer to play it)
// - Playlists navigation, add coverart
// - Explorer navigation, try to display album art and songs (parsed from the *.cue if necessary) inside each artist

function App() {
  const [page, setPage] = useState('player');
  const [rootMusicPath, setRootMusicPath] = useState('');
  const [currentPath, setCurrentPath] = useState(null);
  const [folders, setFolders] = useState([]);
  const [playing, setPlaying] = useState('foo');
  const [currentSong, setCurrentSong] = useState({
    track: -1,
    playlistId: -1,
    title: '',
    album: '',
    year: '',
    artist: '',
    duration: 0
  });
  const [songPosition, setSongPosition] = useState(0);
  const [albumCover, setAlbumCover] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState([]);
  const [tracklistsSongs, setTracklistsSongs] = useState([]);

  const currentPositionRef = useRef(songPosition);

  const handlePlayerClick = (e, action) => {
    fetch('/api/player/' + action, {
      method: 'POST'
    })
    .then(() => updatePlayerStatus())
    .catch(error => console.error(error));
  };

  const drawSongInfo = async(data) => {
    setSongPosition(data.player.activeItem.position);
    setCurrentSong(prevSong => ({
      ...prevSong,
      track: data.player.activeItem.index,
      playlistId: data.player.activeItem.playlistId,
      title: data.player.activeItem.columns[2],
      album: data.player.activeItem.columns[1],
      year: data.player.activeItem.columns[3],
      artist: data.player.activeItem.columns[0],
      duration: data.player.activeItem.duration
    }));
  };

  const fetchTracks = useCallback(async() => {
    if (selectedPlaylist) {
      try {
        const response = await fetch(`/api/playlists/${selectedPlaylist}/items/0:2000?columns=%25artist%25,%25album%25,%25year%25,%25track%25,%25title%25`);
        const data = await response.json();
        setTracklistsSongs(data.playlistItems.items);

        const groupedData = [];
        /*const getMiniArt = async (track) => {
          try {
            const response = await fetch(`api/artwork/${selectedPlaylist}/${track}`);
            if (response.ok) {
              const coverURL = response.url;
              return(coverURL);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };*/

        data.playlistItems.items.forEach((item, index) => {
          const [artist, album, year, trackNumber, songName] = item.columns;

          if (!groupedData[artist]) {
            groupedData[artist] = {};
          }

          const albumKey = `${year} - ${album}`;

          if (!groupedData[artist][albumKey]) {
            groupedData[artist][albumKey] = {
              coverArt: placeholderImg, // TODO: getMiniArt(index): Implement getMiniArt in Playlists component
              name: album,
              year: year,
              songs: []
            }
          }

          groupedData[artist][albumKey]['songs'].push({
            trackNumber,
            songName
          });
        });

        setSelectedPlaylistSongs(groupedData);
      } catch (error) {
        console.log('failed fetching tracks', error);
      }
    }
  }, [selectedPlaylist]);

  const updatePlayerStatus = useCallback(async() => {
    try {
      const response = await fetch('/api/player?player=true&columns=%25artist%25,%25album%25,%25title%25,%25year%25', {
        method: 'GET'
      });
      const playerData = await response.json();
      setPlaying(playerData.player.playbackState);
      drawSongInfo(playerData);
    } catch (e) {
      console.log("failed updating status");
    }
  }, []);

  const updateSongPosition = async (newPosition) => {
    fetch('api/player', {
      method: 'POST',
      body: JSON.stringify({ position: newPosition }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => setSongPosition(newPosition));
  };

  const playSong = async (songId) => {
    try {
      await fetch(`/api/player/play/${selectedPlaylist}/${songId}`, {
        method: 'POST',
      })
      .then(() => updatePlayerStatus());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const playlistItemsAdd = async (ev, folder, shouldPlay, shouldReplace) => {
    try {
      await fetch(`/api/playlists/${selectedPlaylist}/items/add`, {
        method: 'POST',
        body: JSON.stringify({items: [folder], play: shouldPlay, replace: shouldReplace}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => updatePlayerStatus());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const playlistItemsRemove = async (path) => {
    try {
      await fetch(`/api/playlists/${selectedPlaylist}/items/remove`, {
        method: 'POST',
        body: JSON.stringify({items: [path]}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => updatePlayerStatus());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // secondaryEffects
  useEffect(() => {
    currentPositionRef.current = songPosition;
  }, [songPosition]);

  useEffect(() => {
    updatePlayerStatus();
  }, [updatePlayerStatus]);
  
  useEffect(() => {
    const timerInterval = 1000;

    const updateProgressBarPosition = () => {
      if (playing !== 'playing') {
        clearInterval(interval);
      }

      const currentPosition = currentPositionRef.current;

      if (currentPosition >= currentSong.duration) {
        updatePlayerStatus();
        return;
      }

      const newPosition = currentPosition + timerInterval / 1000;
      currentPositionRef.current += newPosition;
      setSongPosition(newPosition);
    };

    const interval = setInterval(updateProgressBarPosition, timerInterval);

    return () => {
      clearInterval(interval);
    };
  }, [currentSong.track, currentSong.duration, currentSong.position, playing, updatePlayerStatus]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks, selectedPlaylist, currentSong.track]);

  useEffect(() => {
    fetch('/api/browser/roots')
      .then(response => response.json())
      .then(data => setRootMusicPath(data.roots[0].path));
  }, []);

  useEffect(() => {
    const getCoverArt = async () => {
      try {
        const response = await fetch(`api/artwork/${currentSong.playlistId}/${currentSong.track}`);

        if (response.ok) {
          const blob = await response.blob();
          const coverURL = URL.createObjectURL(blob);
          setAlbumCover(coverURL);
        } else {
          setAlbumCover(placeholderImg);
          console.log('Network response was not ok');
        }
      } catch (error) {
        setAlbumCover(placeholderImg);
        console.error('Error:', error);
      }
    };

    getCoverArt();
  }, [currentSong]);

  useEffect(() => {
    const fetchPlaylists = async() => {
      try {
        const response = await fetch('api/playlists');
        const data = await response.json();
        setPlaylists(data.playlists);
        const currentPlaylist = data.playlists.find(playlist => playlist.isCurrent);
        setSelectedPlaylist(currentPlaylist.id);
      } catch (error) {
        console.log('failed fetching playlists', error);
      }
    }

    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      const excludedFolders = ['MusicBee'];
      const includedExtensions = ['mp3', 'flac'];
      if (currentPath || rootMusicPath)
      try {
        const response = await fetch(`/api/browser/entries?path=${currentPath || rootMusicPath}`);
        const data = await response.json();
        const folders = data.entries.filter(entry => {
          const isExcluded = excludedFolders.includes(entry.name);
          const isDirectory = entry.type === 'D';
          const isFile = entry.type === 'F';

          if (isExcluded) {
            return false;
          }

          if (isDirectory) {
            return true;
          }

          if (isFile) {
            const fileExtension = entry.name.split('.').pop().toLowerCase();
            return includedExtensions.includes(fileExtension);
          }

          return false;
        });

        setFolders(folders);
      } catch (error) {
        console.error('failed fetching folders', error);
      }
    };

    fetchFolders();
  }, [currentPath, rootMusicPath]);

  return (
    <div className="container">
      {page === 'player' && (
        <>
          <Player
            albumCover={albumCover}
            currentSong={currentSong}
            songPosition={songPosition}
            playing={playing}
            handlePageChange={handlePageChange}
            handlePlayerClick={handlePlayerClick}
            updateSongPosition={updateSongPosition}
          />
          <Tracklist
            selectedPlaylist={selectedPlaylist}
            playlists={playlists}
            tracklistsSongs={tracklistsSongs}
            playSong={playSong}
            playlistItemsRemove={playlistItemsRemove}
            currentSong={currentSong}
          />
        </>
      )}
      {page === 'explorer' && (
        <Explorer
          folders={folders}
          setCurrentPath={setCurrentPath}
          currentPath={currentPath}
          handlePageChange={handlePageChange}
          rootMusicPath={rootMusicPath}
          playlistItemsAdd={playlistItemsAdd}
        />
      )}
      {page === 'playlists' && (
        <Playlists
          handlePageChange={handlePageChange}
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          playlists={playlists}
          selectedPlaylistSongs={selectedPlaylistSongs}
          playSong={playSong}
        />
      )}
    </div>
  );
}

export default App;
