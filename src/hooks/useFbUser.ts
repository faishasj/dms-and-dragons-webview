import React from 'react';
import { ThreadContext } from '../lib/Messenger';
import { MessengerContext } from '../App';

export const useFbUser = (callback: (fbId: string) => void): void => {
  const messengerSDK: any = React.useContext(MessengerContext);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') callback('3933693980036784');
    if (messengerSDK) {
      messengerSDK?.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          callback(psid);
        },
        (error: any) => {}
      );
    }
  }, [messengerSDK, callback]);
};
