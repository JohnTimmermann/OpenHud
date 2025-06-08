# OpenHud - An open source CS2 Custom Hud.

Join the community [Discord](https://discord.gg/HApB9HyaWM)!

- Tech: Electron, React, Typescript, NodeJS, Express, Socketio, SQLite3
- Styling: TailwindCSS (admin panel) / Sass (hud)

## License

This software is licensed under a custom license that allows free use and modification — including in monetized streams and videos — but **forbids resale** of the program or modified versions.

If you redistribute modified versions, you must provide proper credit and disclose what changes were made.

See [LICENSE](./LICENSE) for full details.

# Getting Started:

- Download the latest .zip form the releases page and unzip it.
- Copy the gamestate_integration_openhud.cfg file from the .zip /resources/src/assets to your CS config folder (the same folder you'd put an autoexec.cfg). (Will make it automatic in the future)
- Launch openhud.exe and run CS2 in WindowedFullscreen mode.
- You're done! Create your players, teams, and matches. Start CS2 and join a match (or demo) as a spectator.
- For the Spectator overlay, click the overlay button in the side menu of the app.
- For OBS overlay, create a Browser Source, delete all of the custom css, and use the url: http://localhost:1349/hud

Hopefully it ends up looking very nice and lets a lot of people use it in their streams!

# OpenHud React Hud based on [Lexogrine react hud](https://github.com/JohnTimmermann/OpenHud-React-Hud)

![Custom CS2 Hud](https://i.imgur.com/OWexW9T.png)

# Admin Panel

![AdminPanel/Matches](https://i.imgur.com/8WwunXg.png)
![AdminPanel/Players](https://i.imgur.com/3oKFgIJ.png)
![AdminPanel/Teams](https://i.imgur.com/vIlKeM6.png)
