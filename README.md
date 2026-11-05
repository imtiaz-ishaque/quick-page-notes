# Quick Page Notes

A simple Chrome extension for saving notes while you browse. Every note is saved together with the title and URL of the page you wrote it on, so you can always find where an idea came from.

Developed by Imtiaz Ahmed | https://websolapp.net

## Features

- Click the extension icon and write a note in the popup
- Each note automatically stores the page title and page URL
- See all your notes in one list, newest first
- Search across note text, page titles, and URLs
- Edit or delete any note at any time
- Click a note's title to open the original page
- Notes sync across your Chrome browsers when Chrome Sync is on
- Works offline, no account or sign up needed
- Built with Manifest V3 and only two permissions

## Install for testing (Developer mode)

1. Download and unzip the extension folder
2. Open `chrome://extensions` in Chrome
3. Turn on **Developer mode** (top right corner)
4. Click **Load unpacked** and select the folder that contains `manifest.json`
5. Click the puzzle icon in the toolbar and pin **Quick Page Notes**

## How to use

1. Open any website and click the extension icon
2. Write your note and click **Save note** (or press Ctrl+Enter)
3. Use the search box to filter your notes
4. Use **Edit** or **Delete** under any note to change or remove it

## Where notes are stored

Notes are saved using Chrome's `chrome.storage` API. Each note is stored as its own item in `chrome.storage.sync`, so it follows you to your other Chrome browsers signed in with the same Google account and Chrome Sync enabled.

Chrome Sync has size limits (about 8 KB per item and about 100 KB in total). If sync is full or unavailable, the note is saved in `chrome.storage.local` automatically, so no note is ever lost. Each note can be up to 4,000 characters.

## Permissions

| Permission | Why it is needed |
|---|---|
| `storage` | To save, read, update, and delete your notes |
| `activeTab` | To read the title and URL of the current tab when you open the popup |

The extension has no host permissions, no background scripts, no remote code, and makes no network requests.

## Project structure

```
quick-page-notes/
  manifest.json   Extension configuration (Manifest V3)
  popup.html      Popup layout
  popup.css       Popup styling
  popup.js        Note logic: add, list, search, edit, delete, storage
  icons/          16, 32, 48, and 128 px icons
  PRIVACY.md      Privacy policy
  README.md       This file
```

## Publish on the Chrome Web Store

1. Zip the extension files so that `manifest.json` is at the root of the zip, not inside a subfolder
2. Create a developer account at https://chrome.google.com/webstore/devconsole (one time $5 registration fee)
3. Click **New item** and upload the zip file
4. Fill in the **Store listing** tab: description, category (Productivity), language, at least one screenshot (1280x800 or 640x400), and a small promo tile (440x280). The 128x128 icon is already included in the package
5. Fill in the **Privacy** tab:
   - Single purpose: Save notes linked to the page you are browsing
   - Permission justification for `storage`: Stores the user's notes locally and in Chrome sync
   - Permission justification for `activeTab`: Reads the title and URL of the current tab when the popup is opened
   - Remote code: No
   - Data usage: the extension does not collect or transmit user data
   - Privacy policy URL: host `PRIVACY.md` on a public page (for example GitHub Pages or your website) and paste the link
6. In the **Distribution** tab choose Public or Unlisted, then click **Submit for review**. Review usually takes 1 to 3 days

## Updating the extension

Increase the `version` number in `manifest.json`, zip the files again, and upload the new package from the Developer Dashboard under your extension's **Package** tab.

## Support

For questions, bug reports, or feature requests, contact: info@websolapp.net

## License

Copyright (c) 2026 Imtiaz Ahmed. All rights reserved.
