# emergencypony.js

This is a bot for downloading and posting a random My Little Pony screenshot on Twitter.

Made by [@juju2143](https://twitter.com/juju2143), commissionned by [@Minty_Root](https://twitter.com/Minty_Root) for [@hourlypony](https://twitter.com/hourlypony), inspired from [@EmergencyPony](https://twitter.com/EmergencyPony)

## What it does

It just posts an image on your Twitter account with a description based on the folder name it was in. That's it.

## Why?

A similar Twitter account turned out to not post any screenshots from episodes considered bad, written by people considered bad, or featuring characters considered bad. This repository ensures every episode and every character have a chance and posting is truly random by downloading screenshots from a known source.

I'd have downloaded a random screenshot from Wikia/Fandom each time the tweet function runs, but we deemed it preferable to download the screenshots on the hard drive beforehand so it works even if Wikia goes down. So you can delete any of the images, but we trust you not to do that...

## Installing

- Clone this repository somewhere
- Make sure you have node.js installed
- Fetch the dependencies: `npm install`
- Copy `config.sample.json` to `config.json` and edit it accordingly
- Download the images from the [MLP Wiki](https://mlp.fandom.com) (will take a while and Wikia and/or your computer might hate you): `npm run download`
  - Note: it's about 200 MB per episode, there over 200 episodes and the process will take over an hour to complete assuming a good internet connection, so have a bunch of disk space and time aside for it :)
  - You actually can have anything in the images folder, as long as it respects a naming scheme like `Episode Name - Part 1/Something epic happens, whatever.png`
- Cleanup unwanted files and folders: `npm run cleanup`
- Run the download script again, just to make sure you didn't miss anything: `npm run download`
- Run the bot: `npm start`
- Or just tweet whenever you want: `npm run tweet`
- That's it, have fun!

## config.json

- `images`: Sets the images folder
- `downloader`: Sets parameters for `npm run download`
  - `start`: Season to start from
  - `end`: Season to end with
  - `interval`: Starts a new file download every x milliseconds
  - `maxDownloads`: Limits how many files to download at the same time
- `tweetSchedule`: Tweet schedule in cron format (ex. `0,30 * * * 1-6` means on minutes 0 and 30 of every hour except on Sundays)
- `twitter`: Whatever Twitter needs for connectiong to their API

## Run on startup (Linux with systemd)

- Copy the provided service file in `/etc/systemd/system/` as root and make the necessary changes
- Run these commands:
    ```sh
    sudo systemctl daemon-reload
    sudo systemctl enable hourlypony
    sudo systemctl start hourlypony
    ```
- Monitor the script's output:
    ```sh
    sudo journalctl -fu hourlypony
    ```

## Licensing

This software is licensed under the terms of the Québec Free and Open-Source Licence – Permissive (LiLiQ-P). If you use it, please tip me some money on [Paypal](https://paypal.me/juju2143) or [Patreon](https://patreon.com/juju2143), or at least tell me about it :)