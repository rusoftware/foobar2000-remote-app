import React from 'react';
import './styles/tracklist.scss';
import { BsFolderFill } from 'react-icons/bs'


const Tracklist = ({
  selectedPlaylist,
  setSelectedPlaylist,
  handlePageChange,
  playlists,
  canciones,
  playSong
}) => {

  const changePlaylist = (id) => {
    setSelectedPlaylist(id);
  }
  
  return (
    <section className='tracklist-section'>
      { selectedPlaylist }
      <BsFolderFill size={26} onClick={() => handlePageChange('explorer')} />
      <div>
        <ul>
          {playlists.map(liitem => (
            <li onClick={() => changePlaylist(liitem.id)} key={liitem.id}>{liitem.title}</li>
          ))}
        </ul>
        <ul className='tracklist'>
          {canciones.map((track, index) => (
            <li onClick={() => playSong(index)} key={index}>{track.columns[0]} - {track.columns[3]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tracklist;
