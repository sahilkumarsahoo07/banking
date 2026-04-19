/**
 * Device Fingerprint Utility
 * Generates a stable browser/device ID using Canvas, screen, and hardware metadata.
 * Not 100% perfect but sufficient for casual device locking.
 */

const getCanvasFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('BankingCRM🔐', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('BankingCRM🔐', 4, 17);
    return canvas.toDataURL();
  } catch {
    return '';
  }
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const getDeviceFingerprint = () => {
  // Use a persisted UUID in localStorage as the primary strong identifier for this specific device/browser
  let deviceUuid = localStorage.getItem('device_uuid');
  if (!deviceUuid) {
    // Generate a random UUID
    deviceUuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_uuid', deviceUuid);
  }

  // Combine UUID with stable browser properties (excluding unstable ones like screen geometry which shift on mobile rotation)
  const components = [
    deviceUuid,
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency || '',
    navigator.deviceMemory || ''
  ];

  return hashString(components.join('|||'));
};

export const getDeviceName = () => {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Edg/.test(ua)) browser = 'Edge';

  return `${os} — ${browser}`;
};
