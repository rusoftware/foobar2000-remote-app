import React, { useState, useEffect } from 'react';
import './styles/explorer.scss';
import { BsFolderFill, BsChevronLeft } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa';

const Explorer = ({ handlePageChange, currentPath, folders, setCurrentPath, rootMusicPath }) => {
  const [isRoot, setIsRoot] = useState(true);

  useEffect(() => {
    const isThisRoot = (!currentPath || currentPath === rootMusicPath);

    if (!isThisRoot) {

    }

    setIsRoot(isThisRoot);
  }, [currentPath, rootMusicPath]);

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

  const groupFoldersByLetter = (folders) => {
    return folders.reduce((result, folder) => {
      if (folder.type === 'D') {
        const firstLetter = folder.name.charAt(0).toUpperCase();
        if (!result[firstLetter]) {
          result[firstLetter] = [];
        }
        result[firstLetter].push(folder);
      }
      return result;
    }, {});
  };

  const groupedFolders = groupFoldersByLetter(folders);

  return (
    <div className='explorer'>
      <div className='header'>
        <BsChevronLeft size={24} className='back' onClick={() => handlePageChange('player')} />

        <BsFolderFill size={32} />
      </div>

      <div className='navigation-folders'>
        {isRoot &&
          <>
            {Object.keys(groupedFolders).map((letter) => (
              <div key={letter}>
                <h2>{letter}</h2>
                <ul className='artists-list'>
                  {groupedFolders[letter].map((folder) => (
                    <li key={folder.path} onClick={() => handleFolderClick(folder.path)}>
                        {folder.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        }
        {!isRoot &&
          <>
            <h2>Albums</h2>
            <FaArrowLeft onClick={handleUpClick} size={24} style={{marginTop: '.83em'}} />

            <ul className='artists-list'>
              {folders.map((folder) => (
                <li key={folder.path} onClick={() => handleFolderClick(folder.path)}>
                  {folder.name}
                </li>
              ))}
            </ul>
          </>
        }
      </div>

      <pre style={{marginTop: '6em'}}>{currentPath} - {rootMusicPath}</pre>
      {isRoot && <div>IS ROOT</div>}
    </div>
  );
};

export default Explorer;
