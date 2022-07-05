## Features

Currently available using assistfs:

-   **Auto Key Press** - Enabling Auto Key Press using selected the Action Slot.
    -   Time should be setted on ms, as example 1 second will be: 1000
    -   Shift / Alt / Ctrl - Supported, as example Alt+1 to use 1th Alt slot
    -   Tab / Space / Enter & etc - Supported
-   **Auto Follow** - Sometimes autofollow in Flyff breaks and you find your support not following you anymore. Auto Follow make sure each 5 seconds that you're following the selected target!
    -   Follow Key must be configured for Z key (default).

## Build

Install the project: `npm install`

Chrome: `npm run build-chrome`
Firefox: `npm run build-firefox`

## Installation

### Chrome

1. Open Extension tab chrome://extensions/
2. Enable Developer Mode on top right corner
3. Press "Load Unpacked Extansion"
4. Choose `dist` project folder
5. Refresh game tab
6. Left top corner you will see "Cheats" button

### Firefox

1. Open Debug tab about:debugging#/runtime/this-firefox
2. Click on "Load Temporary Add-on"
3. Choose manifest.json inside `dist` project folder
4. Refresh game tab
5. Left top corner you will see "Cheats" button

## KNOWN ISSUES
