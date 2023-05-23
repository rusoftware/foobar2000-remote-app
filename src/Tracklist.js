import React from 'react';
import './styles/tracklist.scss';
import { MdOutlinePlaylistRemove } from 'react-icons/md';

const Tracklist = ({
  selectedPlaylist,
  playlists,
  songs,
  playSong,
  playlistItemsRemove,
  currentSong
}) => {

  return (
    <section className='tracklist-section'>
      <div className='playlist-title'>
        from {selectedPlaylist ? playlists.find((currentPlaylist) => currentPlaylist.id === selectedPlaylist)?.title : 'Seleccionar opción'}
      </div>
      <div>
        <ul className='tracklist'>
          {songs.map((track, index) => (
            <li className={`${index === currentSong.track ? 'selected' : ''}`} key={index}>
              <span className='track-name' onClick={() => playSong(index)} key={index}>{track.columns[0]} - {track.columns[3]}</span>
              <span className='track-remove'><MdOutlinePlaylistRemove size={24} onClick={(ev) => playlistItemsRemove(index)} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tracklist;
