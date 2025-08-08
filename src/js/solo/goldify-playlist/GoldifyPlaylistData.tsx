import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../../css/TrackDataTable.css';
import TopListeningData from '../top-listens/TopListeningData';
import { replaceWindowURL, getSpotifyRedirectURL } from '../../utils/GoldifySoloUtils';
import Button from '@mui/material/Button';
import { amber } from '@mui/material/colors';
import { replacePlaylistTracks, getPlaylistTracksById } from '../../utils/playlistTracks';
import { GOLDIFY_PLAYLIST_NAME, HOME_PAGE_PATH } from '../../utils/constants';
import {
  SortableList,
  handleDragEnd,
  SortableTrackItem,
} from '../../utils/GoldifyPlaylistDataElements';
import { TokenData } from '../../utils/UserInfoUtils';
import { SpotifyTrack, SpotifyTopTracksResponse } from '../../utils/TopListeningDataUtils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface GoldifyPlaylistDataProps {
  retrievedTokenData: TokenData | null;
  goldifyPlaylistId: string;
  newlyCreatedPlaylist: boolean;
  autoFillCompletedHandler: () => void;
}

const GoldifyPlaylistData: React.FC<GoldifyPlaylistDataProps> = ({
  retrievedTokenData,
  goldifyPlaylistId,
  newlyCreatedPlaylist,
  autoFillCompletedHandler,
}) => {
  const [playlistItems, setPlaylistItems] = useState<SortableTrackItem[] | null>(null);
  const [playlistDirty, setPlaylistDirty] = useState<boolean>(false);
  const [removedTrackDataMap, setRemovedTrackDataMap] = useState<Map<string, SpotifyTrack>>(
    new Map()
  );

  // Saved copy and URI list mirrors class fields in the previous JS implementation
  const savedPlaylistItemsRef = useRef<SortableTrackItem[]>([]);
  const playlistTrackUriListRef = useRef<string[]>([]);

  const setURIListFromPlaylistItems = useCallback((items: SortableTrackItem[]): void => {
    playlistTrackUriListRef.current = items.map(item => item.track.uri);
  }, []);

  const setInitialPlaylistData = useCallback(
    (items: SortableTrackItem[]): void => {
      setURIListFromPlaylistItems(items);
      setPlaylistItems(items);
      setPlaylistDirty(false);
      savedPlaylistItemsRef.current = JSON.parse(JSON.stringify(items));
    },
    [setURIListFromPlaylistItems]
  );

  const retrieveGoldifyPlaylistData = useCallback(
    async (tokenData: TokenData, playlistId: string): Promise<void> => {
      try {
        const data = await getPlaylistTracksById(tokenData, playlistId);
        if (data === undefined || (data as unknown as { error?: string })?.error) {
          replaceWindowURL(HOME_PAGE_PATH);
        } else {
          // Map to SortableTrackItem shape
          const mapped: SortableTrackItem[] = data.items.map(item => ({ track: item.track }));
          setInitialPlaylistData(mapped);
        }
      } catch (_error) {
        replaceWindowURL(HOME_PAGE_PATH);
      }
    },
    [setInitialPlaylistData]
  );

  useEffect(() => {
    if (retrievedTokenData?.access_token) {
      retrieveGoldifyPlaylistData(retrievedTokenData, goldifyPlaylistId);
    }
  }, [retrievedTokenData, goldifyPlaylistId, retrieveGoldifyPlaylistData]);

  const addTrackFromTopListensData = useCallback((trackData: SpotifyTrack): void => {
    if (!playlistTrackUriListRef.current.includes(trackData.uri)) {
      playlistTrackUriListRef.current = [...playlistTrackUriListRef.current, trackData.uri];
      setPlaylistItems(prev => {
        const next = prev ? [...prev, { track: trackData }] : [{ track: trackData }];
        setPlaylistDirty(true);
        return next;
      });
    }
  }, []);

  const inSavedGoldifyPlaylist = useCallback((removedItem: SortableTrackItem): boolean => {
    return savedPlaylistItemsRef.current.some(saved => saved.track.uri === removedItem.track.uri);
  }, []);

  const removeGoldifyTrack = useCallback(
    (track: SpotifyTrack): void => {
      setPlaylistItems(prev => {
        if (!prev) return prev;
        const index = prev.findIndex(item => item.track.id === track.id);
        if (index === -1) return prev;

        // Update URI list
        const newUris = playlistTrackUriListRef.current.filter(uri => uri !== track.uri);
        playlistTrackUriListRef.current = newUris;

        // Remove item
        const removedItem = prev[index];
        const next = [...prev.slice(0, index), ...prev.slice(index + 1)];

        // Track removed items if they were in the saved playlist
        if (inSavedGoldifyPlaylist(removedItem)) {
          setRemovedTrackDataMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(removedItem.track.uri, removedItem.track);
            return newMap;
          });
        }

        setPlaylistDirty(true);
        return next;
      });
    },
    [inSavedGoldifyPlaylist]
  );

  const onDragEnd = useCallback((event: DragEndEvent): void => {
    setPlaylistItems(prev => {
      if (!prev) return prev;
      const next = handleDragEnd(event, prev);
      if (next !== prev) setPlaylistDirty(true);
      return next;
    });
  }, []);

  const updateGoldifyPlaylist = useCallback(async (): Promise<void> => {
    if (!retrievedTokenData?.access_token || !playlistItems) return;

    // Sync URI list from current items before saving
    setURIListFromPlaylistItems(playlistItems);

    await replacePlaylistTracks(
      retrievedTokenData,
      goldifyPlaylistId,
      playlistTrackUriListRef.current
    );

    // Remove any entries from removed map that are now back in the playlist
    setRemovedTrackDataMap(prevMap => {
      const newMap = new Map(prevMap);
      for (const uriKey of Array.from(newMap.keys())) {
        if (playlistTrackUriListRef.current.includes(uriKey)) {
          newMap.delete(uriKey);
        }
      }
      return newMap;
    });

    setPlaylistDirty(false);
    savedPlaylistItemsRef.current = JSON.parse(JSON.stringify(playlistItems));
  }, [retrievedTokenData, goldifyPlaylistId, playlistItems, setURIListFromPlaylistItems]);

  const cancelUpdatesToGoldifyPlaylist = useCallback((): void => {
    const saved = savedPlaylistItemsRef.current;
    setURIListFromPlaylistItems(saved);

    setRemovedTrackDataMap(prevMap => {
      const newMap = new Map(prevMap);
      for (const uriKey of Array.from(newMap.keys())) {
        if (playlistTrackUriListRef.current.includes(uriKey)) {
          newMap.delete(uriKey);
        }
      }
      return newMap;
    });

    setPlaylistItems(JSON.parse(JSON.stringify(saved)));
    setPlaylistDirty(false);
    // saved ref remains the same
  }, [setURIListFromPlaylistItems]);

  const getRemovedTrackData = useCallback((): SpotifyTopTracksResponse => {
    const items: SpotifyTrack[] = Array.from(removedTrackDataMap.values());
    return {
      href: '',
      items,
      limit: items.length,
      next: null,
      offset: 0,
      previous: null,
      total: items.length,
    };
  }, [removedTrackDataMap]);

  const playlistHeader = useMemo(() => `Your ${GOLDIFY_PLAYLIST_NAME} Playlist`, []);

  // DnD sensors must be declared unconditionally to respect the Rules of Hooks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getGoldifyPlaylistDiv = (): React.ReactElement => {
    return (
      <div>
        <div className="goldify-update-buttons">
          {playlistDirty ? (
            <div>
              <Button
                className="goldify-playlist-save-button"
                variant="contained"
                color="primary"
                style={{ background: amber[600] }}
                onClick={updateGoldifyPlaylist}
              >
                Save Goldify Playlist
              </Button>
              <Button
                className="goldify-playlist-cancel-button"
                variant="contained"
                color="primary"
                style={{ background: amber[600] }}
                onClick={cancelUpdatesToGoldifyPlaylist}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="track-data-table-container">
          <div className="track-data-table-header-container">
            <a
              href={getSpotifyRedirectURL('playlist', goldifyPlaylistId)}
              target="_blank"
              rel="noreferrer"
            >
              <h1 className="track-data-table-header">{playlistHeader}</h1>
            </a>
          </div>
          <div className="track-data-table-outer-container">
            <div className="track-data-table-inner-container">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <table className="track-data-table">
                  <thead className="track-data-thead">
                    <tr className="track-data-tr">
                      <th className="track-data-th"></th>
                      <th className="track-data-th track-data-action-icon"></th>
                      <th className="track-data-th track-data-album-cover">Album</th>
                      <th className="track-data-th">Title</th>
                      <th className="track-data-th">Artist(s)</th>
                      <th className="track-data-th">Album Name</th>
                    </tr>
                  </thead>
                  {playlistItems && (
                    <SortableContext
                      items={playlistItems.map(i => i.id || i.track.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <SortableList
                        items={playlistItems}
                        removeTrackItemHandler={removeGoldifyTrack}
                      />
                    </SortableContext>
                  )}
                </table>
              </DndContext>
            </div>
          </div>
        </div>
        {retrievedTokenData && (
          <TopListeningData
            retrievedTokenData={retrievedTokenData}
            goldifyUriList={playlistTrackUriListRef.current}
            addTrackHandler={addTrackFromTopListensData}
            playlistDirty={playlistDirty}
            newlyCreatedPlaylist={newlyCreatedPlaylist}
            onAutoFillCompleteHandler={autoFillCompletedHandler}
            getRemovedTrackData={getRemovedTrackData}
          />
        )}
      </div>
    );
  };

  if (playlistItems === null) {
    return <div />;
  }
  return getGoldifyPlaylistDiv();
};

export default GoldifyPlaylistData;
