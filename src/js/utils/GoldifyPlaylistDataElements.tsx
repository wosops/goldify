import React from 'react';
import { red } from '@mui/material/colors';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { getSpotifyRedirectURL } from './GoldifySoloUtils';
import { SpotifyTrack } from './TopListeningDataUtils';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableTrackItem {
  track: SpotifyTrack;
  id?: string;
}

interface SortableItemProps {
  listValue: SortableTrackItem;
  removeTrackItemHandler: (track: SpotifyTrack) => void;
}

interface SortableListProps {
  items: SortableTrackItem[];
  removeTrackItemHandler: (track: SpotifyTrack) => void;
}

/**
 * Utility function to handle drag end and reorder items
 * @param event DragEndEvent from @dnd-kit
 * @param items Current array of items
 * @returns Reordered array of items
 */
export const handleDragEnd = (
  event: DragEndEvent,
  items: SortableTrackItem[]
): SortableTrackItem[] => {
  const { active, over } = event;

  if (active.id !== over?.id) {
    const oldIndex = items.findIndex(item => (item.id || item.track.id) === active.id);
    const newIndex = items.findIndex(item => (item.id || item.track.id) === over?.id);

    return arrayMove(items, oldIndex, newIndex);
  }

  return items;
};

// Drag handle component
export const DragHandle: React.FC = () => (
  <span className="move-row-icon"></span>
);

// Individual sortable item
export const SortableItem: React.FC<SortableItemProps> = ({ 
  listValue, 
  removeTrackItemHandler 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: listValue.id || listValue.track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className="track-data-tr"
    >
      <td className="track-data-td">
        <div {...attributes} {...listeners}>
          <DragHandle />
        </div>
      </td>
      <td className="track-data-td">
        <RemoveCircleIcon
          className="goldify-playlist-remove-button"
          style={{ color: red[500] }}
          fontSize="large"
          onClick={() => {
            removeTrackItemHandler(listValue.track);
          }}
        />
      </td>
      <td className="track-data-td">
        <a
          href={getSpotifyRedirectURL('album', listValue.track.album.id)}
          target="_blank"
          rel="noreferrer"
        >
          <img
            alt="Album Art"
            src={listValue.track.album.images[0]?.url}
            width="50"
            height="50"
          />
        </a>
      </td>
      <td className="track-data-td">
        <a
          href={getSpotifyRedirectURL('track', listValue.track.id)}
          target="_blank"
          rel="noreferrer"
        >
          {listValue.track.name}
        </a>
      </td>
      <td className="track-data-td">
        {listValue.track.album.artists.map((artist, index) => (
          <React.Fragment key={artist.id}>
            {index > 0 && ', '}
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
      <td className="track-data-td">
        <a
          href={getSpotifyRedirectURL('album', listValue.track.album.id)}
          target="_blank"
          rel="noreferrer"
        >
          {listValue.track.album.name}
        </a>
      </td>
    </tr>
  );
};

// Sortable list container
export const SortableList: React.FC<SortableListProps> = ({ 
  items, 
  removeTrackItemHandler,
}) => {
  return (
    <tbody>
      {items.map((value) => (
        <SortableItem
          key={value.id || value.track.id}
          listValue={value}
          removeTrackItemHandler={removeTrackItemHandler}
        />
      ))}
    </tbody>
  );
};