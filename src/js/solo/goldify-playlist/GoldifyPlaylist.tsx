import React, { useState, useEffect } from 'react';
import GoldifyPlaylistData from './GoldifyPlaylistData';
import GoldifyCreatePlaylist from './GoldifyCreatePlaylist';
import { findExistingGoldifyPlaylistByName, SpotifyPlaylist } from '../../utils/playlist';
import { replaceWindowURL } from '../../utils/GoldifySoloUtils';
import { GOLDIFY_PLAYLIST_NAME, HOME_PAGE_PATH } from '../../utils/constants';
import { SpotifyUser, TokenData } from '../../utils/UserInfoUtils';

interface GoldifyPlaylistProps {
  retrievedTokenData: TokenData | null;
  userData: SpotifyUser | null;
  autoFillCompletedHandler: () => void;
}

const GoldifyPlaylist: React.FC<GoldifyPlaylistProps> = ({
  retrievedTokenData,
  userData,
  autoFillCompletedHandler,
}) => {
  const [goldifyPlaylist, setGoldifyPlaylist] = useState<SpotifyPlaylist | null | undefined>(undefined);
  const [goldifyPlaylistId, setGoldifyPlaylistId] = useState<string>('');
  const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useState<boolean>(false);

  /**
   * Function used to update this component's state from within a child component
   * @param playlist Playlist object returned from spotify's api
   */
  const updatePlaylist = (playlist: SpotifyPlaylist): void => {
    // used to set playlist after creating a new playlist
    setGoldifyPlaylist(playlist);
    setGoldifyPlaylistId(playlist.id);
    setNewlyCreatedPlaylist(true);
  };

  /**
   * Checks to see if the user has an existing goldify playlist once
   * token data is available
   */
  useEffect(() => {
    if (retrievedTokenData && !retrievedTokenData.error) {
      retrieveGoldifyPlaylist(retrievedTokenData);
    }
  }, [retrievedTokenData]);

  /**
   * Call's spotify's api to check if the user has an existing Goldify playlist
   * Then sets this component's state accordingly
   * @param retrievedTokenData Object containing the user's access token
   */
  const retrieveGoldifyPlaylist = async (retrievedTokenData: TokenData): Promise<void> => {
    try {
      const data = await findExistingGoldifyPlaylistByName(retrievedTokenData, GOLDIFY_PLAYLIST_NAME);
      
      if (data === null) {
        setGoldifyPlaylist(null);
      } else if (data === undefined) {
        replaceWindowURL(HOME_PAGE_PATH);
      } else {
        setGoldifyPlaylist(data);
        setGoldifyPlaylistId(data.id);
      }
    } catch (error) {
      console.error('Error retrieving Goldify playlist:', error);
      replaceWindowURL(HOME_PAGE_PATH);
    }
  };

  /**
   * Displays the user's Goldify Playlist if available
   * Otherwise redirects to page to create one
   * @returns JSX element to either create or display the user's Goldify playlist
   */
  if (goldifyPlaylist === undefined) {
    return <div />;
  } else if (goldifyPlaylist === null) {
    return (
      <GoldifyCreatePlaylist
        retrievedTokenData={retrievedTokenData}
        userData={userData}
        playlistUpdater={updatePlaylist}
      />
    );
  } else {
    return (
      <GoldifyPlaylistData
        retrievedTokenData={retrievedTokenData}
        goldifyPlaylistId={goldifyPlaylistId}
        newlyCreatedPlaylist={newlyCreatedPlaylist}
        autoFillCompletedHandler={autoFillCompletedHandler}
      />
    );
  }
};

export default GoldifyPlaylist; 