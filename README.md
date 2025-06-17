# NTS-1 Web Controller

You can control the KORG Nu:Tekt NTS-1 from your web browser. It allows for real-time sound editing and also features librarian functionality.

You can also install it on your own machine, but it also runs at the following URL.

[https://directions4.github.io/nts1-web-controller/](https://directions4.github.io/nts1-web-controller/)

![screenshot.png](screenshot.png)

## Features

* Browser-controlled UI for KORG NTS-1 synthesizer

* Virtual keyboard

* Patches stored in Web LocalStorage

## Browser Support

This app works in all browsers that natively support the [Web MIDI API](https://www.w3.org/TR/webmidi/). Currently, the following browsers have built-in support:

* Chrome (Mac, GNU/Linux, Android & Windows)

* Firefox (Mac, GNU/Linux, Android & Windows)

* Android WebView component (KitKat and above)

## Demo

Connect Korg NTS-1 to your PC or SmartPhone through USB port, and access this URL with Chrome (or Chromium).
[https://directions4.github.io/nts1-web-controller/](https://directions4.github.io/nts1-web-controller/)

## Local execution

### Installation

You need [node](https://nodejs.org/).

```sh
npm install
```

### Running

```sh
npm run dev
```

access [http://localhost:5173/](http://localhost:5173/) .

## License

NTS-1 Web Controller is licensed under a [MIT License](./LICENSE).
