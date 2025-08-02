import React from 'react';
import { SpotifyUser, TokenData } from '../../utils/UserInfoUtils';
import { SpotifyPlaylist } from '../../utils/playlist';

interface GoldifyCreatePlaylistProps {
  retrievedTokenData: TokenData | null;
  userData: SpotifyUser | null;
  playlistUpdater: (playlist: SpotifyPlaylist) => void;
}

const GoldifyCreatePlaylist: React.FC<GoldifyCreatePlaylistProps> = ({
  retrievedTokenData: _retrievedTokenData,
  userData,
  playlistUpdater: _playlistUpdater,
}) => {
  return (
    <div>
      <h2>Create Goldify Playlist</h2>
      <p>This component will create a new Goldify playlist...</p>
      {userData && (
        <p>Creating playlist for {userData.display_name}</p>
      )}
    </div>
  );
};

export default GoldifyCreatePlaylist; 