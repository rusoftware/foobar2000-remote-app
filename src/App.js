import React, { useState, useEffect } from 'react';
import Player from './Player';
import Explorer from './Explorer';
import Tracklist from './Tracklist';
import logo from './logo.svg';

function App() {
  const [page, setPage] = useState('player');
  const [rootMusicPath, setRootMusicPath] = useState('');
  const [currentPath, setCurrentPath] = useState(null);
  const [folders, setFolders] = useState([]);
  const [playing, setPlaying] = useState('foo');
  const [songPosition, setSongPosition] = useState('');
  const [currentSong, setCurrentSong] = useState({
    track: null,
    playlistId: null,
    title: '',
    album: '',
    year: '',
    artist: '',
    duration: 0
  });
  const [albumCover, setAlbumCover] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('p1');
  const [playlists, setPlaylists] = useState([]);
  const [canciones, setCanciones] = useState([]);

  useEffect(() => {
    fetch('/api/browser/roots')
      .then(response => response.json())
      .then(data => setRootMusicPath(data.roots[0].path));
  }, []);

  useEffect(() => {
    const fetchPlaybackStatus = async () => {
      try {
        const response = await fetch('api/player');
        const data = await response.json();
        const track = data.player.activeItem.index;
        const playingState = data.player.playbackState;

        if (track !== currentSong.track) {
          setCurrentSong({ track: track, playlistId: data.player.activeItem.playlistId });
          getSongData();
        }

        setPlaying(playingState);
        setSongPosition(data.player.activeItem.position);
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(fetchPlaybackStatus, 400);

    return () => {
      clearInterval(interval);
    };
  }, [currentSong.track]);

  useEffect(() => {
    const getCoverArt = async () => {
      try {
        const response = await fetch(`api/artwork/${currentSong.playlistId}/${currentSong.track}`);

        if (response.ok) {
          const blob = await response.blob();
          const coverURL = URL.createObjectURL(blob);
          setAlbumCover(coverURL);
        } else {
          setAlbumCover(logo);
          console.log('Network response was not ok');
        }
      } catch (error) {
        setAlbumCover(logo);
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
    const fetchTracks = async() => {
      try {
        const response = await fetch(`/api/playlists/${selectedPlaylist}/items/0:100?columns=%25track%25,%25artist%25,%25album%25,%25title%25`);
        const data = await response.json();
        //console.log(currentSong);
        //console.log(data.playlistItems.items);
        setCanciones(data.playlistItems.items);
      } catch (error) {
        console.log('failed fetching tracks', error);
      }
    }

    fetchTracks();
  }, [selectedPlaylist]);

  useEffect(() => {
    const fetchFolders = async () => {
      if (currentPath || rootMusicPath)
      try {
        const response = await fetch(`/api/browser/entries?path=${currentPath || rootMusicPath}`);
        const data = await response.json();
        const folders = data.entries.filter(entry => entry.type === 'D');
        setFolders(folders);
      } catch (error) {
        console.error('failed fetching folders', error);
      }
    };

    fetchFolders();
  }, [currentPath, rootMusicPath]);
  
  const handlePlayerClick = (e, action) => {
    fetch('/api/player/' + action, {
      method: 'POST'
    })
    .catch(error => console.error(error));
  };

  const getSongData = async () => {
    try {
      const response = await fetch('/api/query?player=true&trcolumns=%25artist%25,%25album%25,%25title%25,%25year%25', {
        method: 'GET'
      });
      const data = await response.json();

      setCurrentSong({
        track: data.player.activeItem.index,
        playlistId: data.player.activeItem.playlistId,
        title: data.player.activeItem.columns[2],
        album: data.player.activeItem.columns[1],
        year: data.player.activeItem.columns[3],
        artist: data.player.activeItem.columns[0],
        duration: data.player.activeItem.duration
      });

      setSongPosition(data.player.activeItem.position);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSongPosition = async (newPosition) => {
    fetch('api/player', {
      method: 'POST',
      body: JSON.stringify({ position: newPosition }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const playSong = async (songId) => {
    try {
      await fetch(`/api/player/play/${selectedPlaylist}/${songId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container">
      {page === 'player' && (
        <>
          <Player
            albumCover={albumCover}
            currentSong={currentSong}
            songPosition={songPosition}
            playing={playing}
            handlePlayerClick={handlePlayerClick}
            updateSongPosition={updateSongPosition}
          />
          <Tracklist
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            handlePageChange={handlePageChange}
            playlists={playlists}
            canciones={canciones}
            playSong={playSong}
          />
        </>
      )}
      {page === 'explorer' && (
        <Explorer
          folders={folders}
          setCurrentPath={setCurrentPath}
          currentPath={currentPath}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default App;
