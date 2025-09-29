import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import '../../../css/UserInfo.css';
import { SpotifyUser } from '../../utils/UserInfoUtils';
import spotifyLogo from '../../../assets/spotify_logo.png';
import goldifyLogo from '../../../assets/goldify_logo.png';

interface UserInfoProps {
  userData: SpotifyUser | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  const [processedUserData, setProcessedUserData] = useState<SpotifyUser | null>(null);

  /**
   * Sets this component's userData state once available
   */
  useEffect(() => {
    if (userData && !userData.error) {
      setUserData(userData);
    }
  }, [userData]);

  /**
   * Basic function that sets the userData state of this component
   * @param userData Object containing the user's profile data
   */
  const setUserData = (userData: SpotifyUser): void => {
    // If the user has no profile image, use the goldify image
    const updatedUserData = { ...userData };
    if (updatedUserData.images.length === 0) {
      updatedUserData.images.push({ url: goldifyLogo });
    }
    setProcessedUserData(updatedUserData);
  };

  const openUserSpotifyProfile = (): void => {
    if (processedUserData?.external_urls?.spotify) {
      window.open(processedUserData.external_urls.spotify, '_blank');
    }
  };

  /**
   * Displays the user's profile data formatted in a single component
   * @returns JSX element containing the user's profile information
   */
  const getUserInfoDiv = (): React.ReactElement => {
    if (!processedUserData) return <div />;

    return (
      <div className="card" onClick={openUserSpotifyProfile}>
        <div className="user-image">
          <div>
            <Avatar
              alt="Profile Image"
              src={processedUserData.images[0]?.url}
              className="user-image-avatar"
            />
          </div>
        </div>
        <div className="user-names">
          <h1>{processedUserData.display_name}</h1>
        </div>
        <div className="spotify-logo">
          <img src={spotifyLogo} alt="Spotify Logo" />
        </div>
      </div>
    );
  };

  /**
   * Displays the user's profile data once available
   */
  if (processedUserData === null) {
    return <div />;
  } else {
    return getUserInfoDiv();
  }
};

export default UserInfo;
