import { textaliveStore } from '../../store';

import { Player } from 'textalive-app-api';

class TextAliveControl {
  // manager;

  constructor() {
    textaliveStore.manager
      .subscribe((manager) => {
        this.manager = manager;
      })
      .bind(this);
  }

  play() {
    this.manager.playVideo();
  }

  pause() {
    this.manager.pauseVideo();
  }

  stop() {
    this.manager.stopVideo();
  }

  cue() {
    this.manager.cueVideo();
  }
}

const control = new TextAliveControl();

class TextAliveManager {
  // player;
  // maxVocalAmplitude = 0xffff;

  constructor(
    mediaElement,
    animateWord,
    animateChar,
    { beatHandler, chorusHandler, vocalAmplitudeHandler },
    songUrl,
  ) {
    this.maxVocalAmplitude = 0xffff;
    const player = new Player({
      app: {
        appAuthor: 'nolze',
        appName: 'mmmapper',
      },
      mediaElement: mediaElement,
      vocalAmplitudeEnabled: true,
    });

    this.player = player;

    if (beatHandler || chorusHandler || vocalAmplitudeHandler) {
      player.addListener({
        /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html */
        onTimeUpdate: (position) => {
          if (beatHandler) {
            const beat = player.findBeat(position);
            if (!beat) {
              return;
            }
            beatHandler(position, beat);
          }
          if (vocalAmplitudeHandler) {
            const vocalAmplitudeRatio =
              player.getVocalAmplitude(position) /
              (this.maxVocalAmplitude + 1e-9);
            if (!vocalAmplitudeRatio) {
              return;
            }
            vocalAmplitudeHandler(position, vocalAmplitudeRatio);
          }
        },
        onThrottledTimeUpdate: (position) => {
          if (chorusHandler) {
            const chorus = player.findChorus(position);
            chorusHandler(position, !!chorus);
          }
        },
      });
    }

    player.addListener({
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/playerapplistener.html */
      onAppReady: (app) => {
        if (!app.managed) {
          this.showControls();
        }
        if (!app.songUrl) {
          songUrl = songUrl || 'https://www.youtube.com/watch?v=ygY2qObZv24'; // 愛されなくても
          player.createFromSongUrl(songUrl);
        }
      },
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html */
      onVideoReady: (_v) => {
        let w = player.video.firstWord;
        const watchWord = () => {
          w.animate = animateWord;
          w = w.next; // TODO: Check true null value
          !!w && setTimeout(watchWord, 0);
        };
        watchWord();

        let c = player.video.firstChar;
        const watchChar = () => {
          c.animate = animateChar;
          c = c.next;
          !!c && setTimeout(watchChar, 0);
        };
        watchChar();

        this.maxVocalAmplitude = this.player.getMaxVocalAmplitude();
      },
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/songloaderlistener.html */
      onSongLoad: (song) => {
        console.log({ song });
      },
      onSongMapLoad: (songMap) => {
        console.log({ songMap });
      },
      onValenceArousalLoad: (valenceArousal) => {
        console.log({ valenceArousal });
      },
      onVocalAmplitudeLoad: (vocalAmplitude) => {
        // console.log({ vocalAmplitude });
      },
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/textloaderlistener.html */
      onLyricsLoad: (_lyrics) => {},
      onTextLoad: (_lyricsBody) => {},
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/fontloaderlistener.html */
      onFontsLoad: (_fonts) => {},
      /* https://developer.textalive.jp/packages/textalive-app-api/interfaces/videoloaderlistener.html */
      onVideoLoad: (_video) => {},
    });
  }

  showControls() {
    // document.querySelector('#control').style.display = 'block';
  }

  dispose() {
    // this.timer.dispose();
    // TODO: Error
    try {
      this.player.dispose();
    } catch (_err) {}
    this.player = null;
  }

  playVideo() {
    this.player.timer && this.player.requestPlay();
  }

  pauseVideo() {
    this.player.timer && this.player.requestPause();
  }

  stopVideo() {
    this.player.timer && this.player.requestStop();
  }

  cueVideo() {
    this.player.timer &&
      this.player.video &&
      this.player.requestMediaSeek(this.player.video.firstChar.startTime);
  }
}

export { TextAliveManager, control };
