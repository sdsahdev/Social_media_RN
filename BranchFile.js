import branch, {BranchEvent} from 'react-native-branch';

// only canonicalIdentifier is required
let branchUniversalObject = await branch.createBranchUniversalObject(
  'canonicalIdentifier',
  {
    locallyIndex: true,
    title: 'Cool Content!',
    contentDescription: 'Cool Content Description',
    contentMetadata: {
      ratingAverage: 4.2,
      customMetadata: {
        prop1: 'test',
        prop2: 'abc',
      },
    },
  },
);

let linkProperties = {
  feature: 'share',
  channel: 'facebook',
};

let controlParams = {
  $desktop_url: 'http://desktop-url.com/monster/12345',
};

let {url} = await branchUniversalObject.generateShortUrl(
  linkProperties,
  controlParams,
);

import branch from 'react-native-branch'

branch.subscribe({
    onOpenStart: ({
        uri,
        cachedInitialEvent
    }) => {
        console.log(
            'subscribe onOpenStart, will open ' +
            uri +
            ' cachedInitialEvent is ' +
            cachedInitialEvent,
        );
    },
    onOpenComplete: ({
        error,
        params,
        uri
    }) => {
        if (error) {
            console.error(
                'subscribe onOpenComplete, Error from opening uri: ' +
                uri +
                ' error: ' +
                error,
            );
            return;
        }
        else if (params) {
            if (!params['+clicked_branch_link']) {
                if (params['+non_branch_link']) {
                    console.log('non_branch_link: ' + uri);
                    // Route based on non-Branch links
                    return;
                }
            } else {
                // Handle params
                let deepLinkPath = params.$deeplink_path as string; 
                let canonicalUrl = params.$canonical_url as string;
                // Route based on Branch link data 
                return
            }
        }
    },
});