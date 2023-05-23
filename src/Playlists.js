import React, { useState, useEffect } from 'react';
import './styles/playlists.scss';
import { BsMusicNoteList, BsChevronLeft } from 'react-icons/bs';
import { MdOutlinePlaylistRemove } from 'react-icons/md'

const Playlists = ({
  handlePageChange,
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  songs,
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
          {selectedPlaylist ? playlists.find((currentPlaylist) => currentPlaylist.id === selectedPlaylist)?.title : 'Seleccionar opción'}
        </button>

        {isOpen && (
          <ul className="dropdown-menu">
            {playlists.map((pl) => {
              if (pl.id !== selectedPlaylist) {
                return (
                  <li
                    key={pl.id}
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
      <div className='tracklist-container'>
        <ul className='tracklist'>
          {songs.map((track, index) => (
            <li key={index}>
              <span className='track-name' onClick={() => playSong(index)} key={index}>{track.columns[0]} - {track.columns[3]}</span>
              <span className='track-remove'><MdOutlinePlaylistRemove size={24} onClick={(ev) => console.log('remove')} /></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlists;