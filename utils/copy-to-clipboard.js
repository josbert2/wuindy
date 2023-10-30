export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard) {
      // Modern asynchronous clipboard API
      navigator.clipboard.writeText(text).then(resolve).catch(reject);
    } else {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        const body = document.querySelector('body');
        body.appendChild(textarea);
        
        textarea.value = text;
        textarea.select();
        const successful = document.execCommand('copy');
        
        body.removeChild(textarea);
        
        if (successful) {
          resolve();
        } else {
          throw new Error('Copy command was unsuccessful.');
        }
      } catch (error) {
        reject(error);
      }
    }
  });
}

export default copyToClipboard;
