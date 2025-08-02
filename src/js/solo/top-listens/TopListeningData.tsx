import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent 
} from '@mui/material';
import { blue, green } from '@mui/material/colors';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import '../../../css/TrackDataTable.css';
import { 
  retrieveTopListeningDataAxios, 
  SpotifyTopTracksResponse, 
  SpotifyTrack
} from '../../utils/TopListeningDataUtils';
import { replaceWindowURL, getSpotifyRedirectURL } from '../../utils/GoldifySoloUtils';
import {
  shortTermTracksRecommended,
  mediumTermTracksRecommended,
  longTermTracksRecommended,
  RECENT_TAB_VALUE,
  RECURRING_TAB_VALUE,
  EVERLASTING_TAB_VALUE,
  RECENTLY_REMOVED_TAB_VALUE,
  HOME_PAGE_PATH,
} from '../../utils/constants';
import { TokenData } from '../../utils/UserInfoUtils';

interface TopListeningDataProps {
  retrievedTokenData: TokenData;
  goldifyUriList: string[];
  addTrackHandler: (track: SpotifyTrack) => void;
  playlistDirty: boolean;
  newlyCreatedPlaylist: boolean;
  onAutoFillCompleteHandler: () => void;
  getRemovedTrackData: () => SpotifyTopTracksResponse;
}

const TopListeningData: React.FC<TopListeningDataProps> = ({
  retrievedTokenData,
  goldifyUriList,
  addTrackHandler,
  playlistDirty: _playlistDirty,
  newlyCreatedPlaylist,
  onAutoFillCompleteHandler,
  getRemovedTrackData,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<number>(0);
  const [topListeningData, setTopListeningData] = useState<SpotifyTopTracksResponse | null>(null);
  const [shortTermListeningData, setShortTermListeningData] = useState<SpotifyTopTracksResponse | null>(null);
  const [mediumTermListeningData, setMediumTermListeningData] = useState<SpotifyTopTracksResponse | null>(null);
  const [longTermListeningData, setLongTermListeningData] = useState<SpotifyTopTracksResponse | null>(null);
  
  const hasAutoFilledRef = useRef<boolean>(false);

  /**
   * Auto-fills a playlist with a few tracks from the user's top listening data
   * This will use the addTrackHandler passed in to add the tracks to
   * the user's goldify playlist
   */
  const autoFillGoldifyPlaylist = useCallback((): void => {
    // Add short term tracks
    for (let stTrack = 0; stTrack < shortTermTracksRecommended; stTrack++) {
      const currentTrack = shortTermListeningData?.items[stTrack];
      if (currentTrack) {
        addTrackHandler(currentTrack);
      }
    }

    // Add medium term tracks
    for (let mtTrack = 0; mtTrack < mediumTermTracksRecommended; mtTrack++) {
      const currentTrack = mediumTermListeningData?.items[mtTrack];
      if (currentTrack) {
        addTrackHandler(currentTrack);
      }
    }

    // Add long term tracks
    for (let ltTrack = 0; ltTrack < longTermTracksRecommended; ltTrack++) {
      const currentTrack = longTermListeningData?.items[ltTrack];
      if (currentTrack) {
        addTrackHandler(currentTrack);
      }
    }

    onAutoFillCompleteHandler();
  }, [shortTermListeningData, mediumTermListeningData, longTermListeningData, addTrackHandler, onAutoFillCompleteHandler]);

  /**
   * Retrieves the user's top listening data once retrievedTokenData is available
   */
  useEffect(() => {
    if (retrievedTokenData?.access_token) {
      retrieveTopListeningData(retrievedTokenData);
    }
  }, [retrievedTokenData]);

  /**
   * Auto-fill logic when playlist is newly created and empty
   */
  useEffect(() => {
    if (
      Array.isArray(goldifyUriList) &&
      goldifyUriList.length === 0 &&
      newlyCreatedPlaylist &&
      !hasAutoFilledRef.current &&
      shortTermListeningData &&
      mediumTermListeningData &&
      longTermListeningData
    ) {
      hasAutoFilledRef.current = true;
      autoFillGoldifyPlaylist();
    }
  }, [goldifyUriList, newlyCreatedPlaylist, shortTermListeningData, mediumTermListeningData, longTermListeningData, autoFillGoldifyPlaylist]);

  /**
   * Will retrieve the user's top listening data and which data is visible
   * @param retrievedTokenData User data containing an access_token
   * Defaults to displaying shortTermListeningData
   */
  const retrieveTopListeningData = async (retrievedTokenData: TokenData): Promise<void> => {
    try {
      const data = await retrieveTopListeningDataAxios(retrievedTokenData);
      
      if (data === undefined) {
        replaceWindowURL(HOME_PAGE_PATH);
      } else {
        setTopListeningData(data.short_term);
        setShortTermListeningData(data.short_term);
        setMediumTermListeningData(data.medium_term);
        setLongTermListeningData(data.long_term);
      }
    } catch (error) {
      console.error('Error retrieving top listening data:', error);
      replaceWindowURL(HOME_PAGE_PATH);
    }
  };

  /**
   * Checks to see if the selected track is already a part of your goldify playlist
   * @param trackUri Uri of the selected track
   * @returns whether or not the track is in the current playlist
   */
  const goldifyPlaylistContainsTrack = (trackUri: string): boolean => {
    return goldifyUriList.includes(trackUri);
  };

  /**
   * Changes which TopListeningData is visible and sets states accordingly
   * @param event The OnChange event that triggered this call
   */
  const updateTopListeningDataTerm = (event: SelectChangeEvent<number>): void => {
    const newValue = Number(event.target.value);
    let newListeningData: SpotifyTopTracksResponse | null = null;

    switch (newValue) {
      case RECENT_TAB_VALUE:
        newListeningData = shortTermListeningData;
        break;
      case RECURRING_TAB_VALUE:
        newListeningData = mediumTermListeningData;
        break;
      case EVERLASTING_TAB_VALUE:
        newListeningData = longTermListeningData;
        break;
      case RECENTLY_REMOVED_TAB_VALUE:
        newListeningData = getRemovedTrackData();
        break;
    }

    setSelectedTerm(newValue);
    setTopListeningData(newListeningData);
  };



  /**
   * Renders a single track item row
   */
  const getTopListeningDataItemDiv = (listValue: SpotifyTrack, index: number): React.ReactElement => {
    return (
      <tr key={index} className="track-data-tr">
        <td className="track-data-td track-data-action-icon">
          {goldifyPlaylistContainsTrack(listValue.uri) ? (
            <BeenhereIcon style={{ color: blue[500] }} fontSize="large" />
          ) : (
            <AddCircleIcon
              className="top-listens-add-track"
              style={{ color: green[500] }}
              fontSize="large"
              onClick={() => {
                addTrackHandler(listValue);
              }}
            />
          )}
        </td>
        <td className="track-data-td track-data-album-cover">
          <a
            href={getSpotifyRedirectURL('album', listValue.album.id)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt={listValue.album.name}
              src={listValue.album.images[0]?.url}
            />
          </a>
        </td>
        <td className="track-data-td">
          <a
            href={getSpotifyRedirectURL('track', listValue.id)}
            target="_blank"
            rel="noreferrer"
          >
            {listValue.name}
          </a>
        </td>
                 <td className="track-data-td">
           {listValue.album.artists.map((artist, artistIndex) => (
             <React.Fragment key={artist.id}>
               {artistIndex > 0 && ', '}
               <a
                 href={getSpotifyRedirectURL('artist', artist.id)}
                 target="_blank"
                 rel="noreferrer"
               >
                 {artist.name}
               </a>
             </React.Fragment>
           ))}
         </td>
      </tr>
    );
  };

  /**
   * Displays the top listening data set in the props
   * Will also call the props.addTrackHandler to add songs to the user's goldify playlist
   * @returns A div containing the retrieved/visible topListeningData
   */
  const getTopListeningDataDiv = (): React.ReactElement => {
    return (
      <div className="track-data-table-container top-listens-table-container">
        <div className="track-data-table-header-container">
          <h1 className="track-data-table-header">Your Top Hits</h1>
          <FormControl variant="outlined" className="track-data-table-tab-panel">
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              value={selectedTerm}
              onChange={updateTopListeningDataTerm}
              label="Time Range"
            >
              <MenuItem value={RECENT_TAB_VALUE}>Latest</MenuItem>
              <MenuItem value={RECURRING_TAB_VALUE}>Recap</MenuItem>
              <MenuItem value={EVERLASTING_TAB_VALUE}>All-Time</MenuItem>
              <MenuItem value={RECENTLY_REMOVED_TAB_VALUE}>Recently Removed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="track-data-table-outer-container">
          <div className="track-data-table-inner-container">
            <table className="track-data-table">
              <thead className="track-data-thead">
                <tr className="track-data-tr">
                  <th className="track-data-th"></th>
                  <th className="track-data-th">Album</th>
                  <th className="track-data-th">Title</th>
                  <th className="track-data-th">Artist(s)</th>
                </tr>
              </thead>
              <tbody className="track-data-tbody">
                {selectedTerm !== RECENTLY_REMOVED_TAB_VALUE &&
                  topListeningData?.items.map((listValue, index) =>
                    getTopListeningDataItemDiv(listValue, index)
                  )}
                {selectedTerm === RECENTLY_REMOVED_TAB_VALUE &&
                  getRemovedTrackData()?.items.map((listValue, index) =>
                    getTopListeningDataItemDiv(listValue, index)
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders which div is available depending on topListeningData
   * @returns Empty div or div containing top listening data
   */
  if (topListeningData === null) {
    return <div />;
  } else {
    return getTopListeningDataDiv();
  }
};

export default TopListeningData; 