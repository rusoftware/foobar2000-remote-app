import React, { useState } from 'react';
import './styles/playlists.scss';
import { BsMusicNoteList, BsChevronLeft } from 'react-icons/bs';
import { MdOutlinePlaylistRemove } from 'react-icons/md';

const Playlists = ({
  handlePageChange,
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  selectedPlaylistSongs,
  playSong
}) => {
  const[isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedPlaylist(option);
    setIsOpen(false);
  };

  /*useEffect(() => {
    console.log(playlists);
  }, [playlists]);*/

  return (
    <div className='playlists-section'>
      <div className='header'>
        <BsChevronLeft size={24} className='back' onClick={() => handlePageChange('player')} />

        <BsMusicNoteList size={32} />
      </div>
      <div className='dropdown'>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          {selectedPlaylist ? `from: ${playlists.find((currentPlaylist) => currentPlaylist.id === selectedPlaylist)?.title}` : 'Seleccionar opción'}
        </button>

        {isOpen && (
          <ul className="dropdown-menu">
            {playlists.map((pl) => {
              if (pl.id !== selectedPlaylist) {
                return (
                  <li
                    key={pl.id}
                    index={pl.id}
                    className={`dropdown-item ${selectedPlaylist === pl.id ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(pl.id)}
                  >
                    {pl.title}
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        )}
      </div>
      <div className='playlists-container'>
        {Object.entries(selectedPlaylistSongs).map(([artist, albums]) => (
          <div key={artist}>
            
            {Object.entries(albums).map(([albumKey, albumData]) => {
              return (
                <div key={albumKey}>
                  <div className='album-header'>
                    <div className='cover'>
                      <img src={albumData.coverArt} alt="Album Cover" width={45} />
                    </div>
                    <div className='title'>
                      <div className='artist-name'>{artist}</div>
                      <div className='album-name'>{albumData.name} ({albumData.year})</div>
                    </div>
                  </div>

                  <ul className='playlists'>
                  {Object.values(albumData.songs).map((song, index) => {
                    const songNumber = Object.values(song)[0];
                    const songName = Object.values(song)[1];
                    return (
                      <li key={index}>
                        <span className='track-name' onClick={() => playSong(index)} key={index}>{songNumber} - {songName}</span>
                        <span className='track-remove'><MdOutlinePlaylistRemove size={24} onClick={(ev) => console.log('remove')} /></span>
                      </li>
                    );
                  })}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;