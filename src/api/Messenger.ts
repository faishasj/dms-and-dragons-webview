export const initMessenger = async () => {
  let js = document.getElementsByTagName('script')[0];
  const fjs = js as any;
  if (!document.getElementById('Messenger')) {
    js = document.createElement('script');
    js.id = 'Messenger';
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
};

export const getMessengerSDK = (): Promise<any> =>
  new Promise((resolve, reject) => {
    (window as any).extAsyncInit = function() {
      // @ts-ignore
      if (MessengerExtensions) {
        // @ts-ignore
        resolve(MessengerExtensions);
      } else {
        reject();
      }
    };
  });

export interface ThreadContext {
  thread_type: string,
  tid: string,
  psid: string,
  signed_reques: string
}
