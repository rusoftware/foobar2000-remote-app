import React from 'react';
import './styles/player.scss';
import { BsPause, BsFillPlayFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';

const Player = ({
  albumCover,
  currentSong,
  songPosition,
  playing,
  handlePlayerClick,
  updateSongPosition
}) => {
  const calculateBackground = () => {
    const percentage = (songPosition / currentSong.duration) * 100;
    return `linear-gradient(to right, rgba(214, 109, 117, .4) 0%, #D66D75 ${percentage}%, #303030 ${percentage}%, #404040 100%)`;
  };

  const formatTiming = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  return (
    <section className='player-page'>
      <div className='player'>
        <div className='currently-playing'>
          <div className='album-cover'>
            <img src={albumCover} alt='' />
          </div>

          <div className='song-info'>
            <h1>{currentSong.title}</h1>
            <p>{currentSong.artist}</p>
            <p>{currentSong.album} - {currentSong.year}</p>
          </div>
        </div>

        <div className='player-controls'>
          <div className='progress-bar'>
            <input
              type='range'
              min={0}
              max={currentSong.duration}
              value={songPosition}
              onChange={(e) => {
                const newPosition = parseInt(e.target.value, 10);
                updateSongPosition(newPosition);
              }}
              className='range-input'
              style={{ background: calculateBackground() }}
            />
            <div className='timer'>
              <span className='track-bar-text'>{formatTiming(songPosition)}</span>
              <span className='track-bar-text'>{formatTiming(currentSong.duration)}</span>
            </div>
          </div>
          
          <div className='player-buttons'>
            <button className='secondary' onClick={(event) => handlePlayerClick(event, 'previous')}><BsSkipStartFill size={28} /></button>
            {playing === 'stopped' ? (
              <button className='main play' onClick={(event) => handlePlayerClick(event, 'play')}><BsFillPlayFill size={50} className='player-icons' /></button>
            ) : (
              <button className='main' onClick={(event) => handlePlayerClick(event, 'pause/toggle')}>
                {playing === 'playing' ? <BsPause size={46} className='player-icons' /> : <BsFillPlayFill size={50} className='player-icons' />}
              </button>
            )}
            <button className='secondary' onClick={(event) => handlePlayerClick(event, 'next')}><BsSkipEndFill size={28} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Player;
