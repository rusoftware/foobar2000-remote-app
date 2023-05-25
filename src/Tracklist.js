import React from 'react';
import './styles/tracklist.scss';
import { MdOutlinePlaylistRemove } from 'react-icons/md';

const Tracklist = ({
  selectedPlaylist,
  playlists,
  tracklistsSongs,
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
          {tracklistsSongs.map((track, index) => (
            <li className={`${index === currentSong.track ? 'selected' : ''}`} key={index}>
              <span className='track-name' onClick={() => playSong(index)} key={index}>
                {track.columns[3]} - {track.columns[4]}
                <br />
                <span className='track-info'>{track.columns[0]} - {track.columns[1]} ({track.columns[2]})</span>
              </span>
              <span className='track-remove'><MdOutlinePlaylistRemove size={24} onClick={(ev) => playlistItemsRemove(index)} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tracklist;
