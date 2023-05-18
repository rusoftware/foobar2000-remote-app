import React, { useState, useEffect } from 'react';
import logo from './logo.svg';

function App() {
  const [page, setPage] = useState('player');
  const [musicPath, setMusicPath] = useState('');
  const [currentPath, setCurrentPath] = useState(null);
  const [folders, setFolders] = useState([]);
  //const [albums, setAlbums] = useState([]);
  const [playing, setPlaying] = useState('foo');
  const [songPosition, setSongPosition] = useState('');
  const [currentSong, setCurrentSong] = useState({
    track: '',
    playlistId: '',
    title: '',
    album: '',
    artist: '',
    duration: 0
  });
  const [albumCover, setAlbumCover] = useState('');
  
  useEffect(() => {
    fetch('/api/browser/roots')
    .then(response => response.json())
    .then(data => setMusicPath(data.roots[0].path))
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(`/api/browser/entries?path=${currentPath || musicPath}`);
        const data = await response.json();
        // Extraer las carpetas del objeto de respuesta
        const folders = data.entries.filter(entry => entry.type === 'D');
        // Actualizar el estado con las carpetas encontradas
        setFolders(folders);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchFolders();
  }, [currentPath, musicPath]);

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
    const fetchPlaybackStatus = async () => {
      try {
        const response = await fetch('api/player');
        const data = await response.json();
        const track = data.player.activeItem.index;
        const playingState = data.player.playbackState;
  
        if (track !== currentSong.track) {
          console.log("cambia cancion");
          setCurrentSong({track: track, playlistId: data.player.activeItem.playlistId});
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
  
  const handlePlayerClick = (e, action) => {
    fetch('/api/player/' + action, {
      method: 'POST'
    })
    .catch(error => console.error(error));
  };

  const getSongData = async () => {
    const response = await fetch('/api/query?player=true&trcolumns=%25artist%25,%25album%25,%25title%25', {
      method: 'GET'
    });
    const data = await response.json();
    
    setCurrentSong({
      track: data.player.activeItem.index,
      playlistId: data.player.activeItem.playlistId,
      title: data.player.activeItem.columns[2],
      album: data.player.activeItem.columns[1],
      artist: data.player.activeItem.columns[0],
      duration: data.player.activeItem.duration
    });

    setSongPosition(data.player.activeItem.position);
  };

  const updateSongPosition = async (newPosition) => {
    try {
      const response = await fetch('api/player', {
        method: 'POST',
        body: JSON.stringify({ position: newPosition }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // La posición se actualizó correctamente
      } else {
        // Maneja el error de actualización de posición
      }
    } catch (error) {
      console.error(error);
    }
  };

  // /////////////////////////
  // App Components
  const Player = () => (
    <>
      <p>{currentPath}</p>
      <div className='album-cover'>
        <img src={albumCover} width={360} alt="" />
      </div>

      <div className='song-info'>
        <h1>{currentSong.title}</h1>
        <p>Álbum: {currentSong.album}</p>
        <p>Artista: {currentSong.artist}</p>
        <div className="progress-bar">
          <input
            type="range"
            min={0}
            max={currentSong.duration}
            value={songPosition}
            onChange={(e) => {
              const newPosition = parseInt(e.target.value, 10);
              setSongPosition(newPosition);
              updateSongPosition(newPosition);
            }}
            className="range-input"
          />
        </div>
      </div>
      <p>{playing}</p>
      <hr />
      <button onClick={event => handlePlayerClick(event, 'previous')}>Prev</button>
      {(playing === "stopped") ?
        <button onClick={event => handlePlayerClick(event, 'play')}>Play</button>
        :
        <button onClick={event => handlePlayerClick(event, 'pause/toggle')}>
          {playing === 'playing' ? <span>Pause</span> : <span>Play</span>}
        </button>
      }
      <button onClick={event => handlePlayerClick(event, 'next')}>Next</button>
      
      {/* stop button 
      <button onClick={event => handlePlayerClick(event, 'stop')}>Stop</button> */}
      <hr />
      <button onClick={() => setPage('explorer')}>explore</button>
    </>
  );

  const Explorer = () => (
  
    <>
      <button onClick={() => setPage('player')}>player</button>
      <ul>
        <li onClick={() => setCurrentPath(currentPath.substring(0, currentPath.lastIndexOf("\\")))}>UP</li>
        {folders.map(folder => (
          <li key={folder.path} onClick={() => setCurrentPath(folder.path)}>
            {folder.name}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="container">
      {page === 'player' && <Player />}
      {page === 'explorer' && <Explorer />}
    </div>
  );
}

export default App;
