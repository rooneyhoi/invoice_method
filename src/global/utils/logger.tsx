// eslint-disable-next-line require-jsdoc
export function log(...data: any[]) { // eslint-disable-line import/prefer-default-export
  if (window.location.href.includes('localhost:3000')) {
    // eslint-disable-next-line no-console
    console.info(...data);
  }
}
