import {formatDistanceToNow} from 'date-fns';
import React from 'react';
import {Text} from 'react-native';

const TimeAgo = ({timestamp}) => {
  // Convert the ISO string timestamp to a JavaScript Date object
  if (!timestamp) {
    return <Text>No timestamp provided</Text>;
  }

  // Convert the ISO string timestamp to a JavaScript Date object
  const postDate = new Date(timestamp);

  // Check if the Date object is valid
  if (isNaN(postDate.getTime())) {
    return <Text>Invalid timestamp</Text>;
  }
  // Calculate the time difference from the post date to now
  const timeAgo = formatDistanceToNow(postDate, {addSuffix: true});

  return <Text>{timeAgo}</Text>;
};

export default TimeAgo;
