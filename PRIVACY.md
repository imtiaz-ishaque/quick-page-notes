# Privacy Policy for Quick Page Notes

Last updated: November 5, 2026

Quick Page Notes ("the extension") is a Chrome extension that lets you save notes together with the title and URL of the page you are viewing. This policy explains what data the extension handles and how.

## Summary

The extension does not collect, transmit, sell, or share any of your data. Everything stays in your browser.

## What data the extension handles

- **Notes you write.** The text of every note you save.
- **Page title and URL.** When you open the popup, the extension reads the title and URL of your current tab and saves them with the note you create. This is the only reason the `activeTab` permission is used.

## Where your data is stored

Your notes are saved only in your browser using Chrome's built in storage API (`chrome.storage.sync` and, as a fallback, `chrome.storage.local`).

If you are signed in to Chrome and Chrome Sync is turned on, Chrome may sync your notes between your own Chrome browsers. This syncing is performed by Google as part of Chrome and is governed by Google's privacy policy. The extension developer has no access to your synced data.

## What the extension does not do

- It does not send data to any server, including servers owned by the developer
- It does not use analytics, tracking, advertising, or cookies
- It does not read or modify the content of web pages
- It does not run on web pages or use content scripts
- It does not use remote code
- It does not sell or transfer user data to third parties

## Permissions

- `storage`: required to save, read, edit, and delete your notes
- `activeTab`: required to read the title and URL of the tab you are on when you open the popup. Access is granted by Chrome only when you click the extension icon

## Data retention and deletion

Your notes stay in your browser until you delete them. You can delete any note using the Delete button in the popup. Uninstalling the extension removes locally stored notes from your browser. Synced notes can also be removed through your Google account's Chrome Sync data settings.

## Children's privacy

The extension does not knowingly collect any information from anyone, including children under 13.

## Changes to this policy

If this policy changes, the updated version will be published at the same location with a new "Last updated" date.

## Contact

Developer: Imtiaz Ahmed (https://websolapp.net)
Email: info@websolapp.net
