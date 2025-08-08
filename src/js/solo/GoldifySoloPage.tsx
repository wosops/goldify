import React, { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import '../../css/GoldifySoloPage.css';
import UserInfo from './user-info/UserInfo';
import GoldifyPlaylist from './goldify-playlist/GoldifyPlaylist';
import {
  retrieveAuthenticationCode,
  retrieveAuthorization,
  retrieveTokensAxios,
  replaceWindowURL,
  getLoadingPage,
  clearAuthCodeFromURL,
} from '../utils/GoldifySoloUtils';
import { GOLDIFY_PLAYLIST_NAME, HOME_PAGE_PATH } from '../utils/constants';
import { retrieveUserDataAxios, SpotifyUser, TokenData } from '../utils/UserInfoUtils';

const GoldifySoloPage: React.FC = () => {
  const [retrievedTokenData, setRetrievedTokenData] = useState<TokenData | null>(null);
  const [userData, setUserData] = useState<SpotifyUser | null>(null);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const isProcessingAuth = useRef<boolean>(false);

  /**
   * Authenticates the user, then retrieves data necessary for basic function
   */
  useEffect(() => {
    // Prevent multiple auth attempts
    if (isProcessingAuth.current) {
      return;
    }
    
    const code = retrieveAuthenticationCode();
    if (code === undefined || code === null) {
      retrieveAuthorization();
    } else {
      isProcessingAuth.current = true;
      retrieveDataOnPageLoad(code);
    }
  }, []);

  /**
   * Gets the user's token data, as well as the user's profile data
   * @param code Spotify's authorization code
   */
  const retrieveDataOnPageLoad = async (code: string): Promise<void> => {
    try {
      const tokenData = await retrieveTokensAxios(code);
      
      if (tokenData === undefined || tokenData.error) {
        isProcessingAuth.current = false;
        replaceWindowURL(HOME_PAGE_PATH);
        return;
      }
      
      clearAuthCodeFromURL(); // Clear the code immediately after successful exchange
      setRetrievedTokenData(tokenData);
      
      if (tokenData) {
        const userDataResponse = await retrieveUserDataAxios(tokenData);
        if (userDataResponse === undefined || userDataResponse.error) {
          isProcessingAuth.current = false;
          replaceWindowURL(HOME_PAGE_PATH);
        } else {
          setUserData(userDataResponse);
          isProcessingAuth.current = false;
        }
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      isProcessingAuth.current = false;
      replaceWindowURL(HOME_PAGE_PATH);
    }
  };

  const handleAutoFillCompleted = (): void => {
    setNotificationOpen(true);
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason !== 'clickaway') {
      setNotificationOpen(false);
    }
  };

  /**
   * Displays the base goldifySolo page
   * @returns JSX element containing the User Info component and the Goldify Playlist component
   */
  const getGoldifyPage = (): React.ReactElement => {
    return (
      <div className="goldify-page-container">
        <UserInfo userData={userData} />
        <Snackbar
          open={notificationOpen}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          className="notification-snack-bar"
        >
          <Alert
            onClose={handleCloseNotification}
            severity="info"
            elevation={6}
            variant="filled"
          >
            We&apos;ve added a few of your top hits to your new&nbsp;
            {GOLDIFY_PLAYLIST_NAME} playlist!
          </Alert>
        </Snackbar>
        <div className="container">
          <GoldifyPlaylist
            retrievedTokenData={retrievedTokenData}
            userData={userData}
            autoFillCompletedHandler={handleAutoFillCompleted}
          />
        </div>
      </div>
    );
  };

  /**
   * Renders the loading page until base data is retrieved, then renders the goldify page
   * @returns JSX element of either the loading page or the goldify page
   */
  if (retrievedTokenData === null || userData === null) {
    return getLoadingPage();
  } else {
    return getGoldifyPage();
  }
};

export default GoldifySoloPage; 