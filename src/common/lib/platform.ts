interface NavigatorUAData {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
}

function getNavigatorData(): { platform: string; maxTouchPoints: number } {
  if (typeof navigator === 'undefined') {
    return { platform: '', maxTouchPoints: -1 };
  }

  const uaData =
    'userAgentData' in navigator ? (navigator.userAgentData as NavigatorUAData) : undefined;

  if (uaData?.platform) {
    return {
      platform: uaData.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  };
}

const nav = getNavigatorData();

export const isWebKit =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  typeof CSS === 'undefined' || !CSS.supports
    ? false
    : CSS.supports('-webkit-backdrop-filter:none');

export const isIOS =
  // iPads can claim to be MacIntel
  nav.platform === 'MacIntel' && nav.maxTouchPoints > 1
    ? true
    : /iP(hone|ad|od)|iOS/.test(nav.platform);
