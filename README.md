# SteamGiftsJS

## Usage

Before running the main file, run `setup`. This will take you to the Steam login so that the authenticated state can be saved. If authentication expires, this may need to be done again to refresh the cookies.
```
node setup.js
```

Run SteamGiftsJS:
```
node index.js
```

The motivation behind SteamGiftsJS is to have an application to be run at semi-regular intervals. If you only want to automate the entering, but leave the timing manual, there are browser plug-ins which may better suit your needs. One way to schedule running SteamGiftsJS is with systemd services and timers. Below is an example setup, which would only require you change the path to the SteamGiftsJS directory.

```
# /etc/systemd/system/steamgifts-timer.service

[Unit]
Description="SteamGiftsJS timer service."
Wants=steamgifts.timer

[Service]
Type=simple
ExecStart=/usr/bin/node /full/path/to/steamgiftsjs
WorkingDirectory=/full/path/to/steamgiftsjs
User=someone
```

```
# /etc/systemd/system/steamgifts.timer

[Unit]
Description="Timer for the steamgifts-timer.service"

[Timer]
Unit=steamgifts-timer.service
OnBootSec=5m
OnUnitInactiveSec=45m
RandomizedDelaySec=15m

[Install]
WantedBy=timers.target
```
