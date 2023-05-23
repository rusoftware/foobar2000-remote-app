import React from 'react';
import './styles/tracklist.scss';
import { MdOutlinePlaylistRemove } from 'react-icons/md';

const Tracklist = ({
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  songs,
  playSong
}) => {

  const changePlaylist = (id) => {
    setSelectedPlaylist(id);
  }
  
  return (
    <section className='tracklist-section'>
      { selectedPlaylist }
      <div>
        <ul>
          {playlists.map(liitem => (
            <li onClick={() => changePlaylist(liitem.id)} key={liitem.id}>{liitem.title}</li>
          ))}
          </ul>
        <ul className='tracklist'>
          {songs.map((track, index) => (
            <li onClick={() => playSong(index)} key={index}>
              <span className='track-name'>{track.columns[0]} - {track.columns[3]}</span>
              <span className='track-remove'><MdOutlinePlaylistRemove size={24} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tracklist;
