import React from 'react';
import './styles/explorer.scss';

const Explorer = ({ handlePageChange, currentPath, folders, setCurrentPath }) => {
  const handleFolderClick = (path) => {
    setCurrentPath(path);
  };

  const handleUpClick = () => {
    if (currentPath) {
    const lastIndex = currentPath.lastIndexOf('\\');
    const upPath = lastIndex !== -1 ? currentPath.substring(0, lastIndex) : '';
    setCurrentPath(upPath);
    }
  };

  return (
    <div className='explorer'>
    <p>pathhh {currentPath}</p>
      <button onClick={() => handlePageChange('player')}>Player</button>
      <ul>
        <li key="bla" onClick={handleUpClick}>UP</li>
        {folders.map((folder) => (
          <li key={folder.path}>
            <button onClick={() => handleFolderClick(folder.path)}>
                {folder.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Explorer;
