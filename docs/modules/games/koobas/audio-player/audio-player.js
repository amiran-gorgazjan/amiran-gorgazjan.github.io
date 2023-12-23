var audio = new Audio('/modules/games/koobas/audio-player/files/punch1.wav');

const sounds = {
    'punch1': {
        url: '/modules/games/koobas/audio-player/files/punch1.wav',
        volume: 0.5,
        buffer: null,
    },
    'apple-bite-1': {
        url: '/modules/games/koobas/audio-player/files/apple-bite-1.mp3',
        volume: 0.5,
        buffer: null,
    },
    'player-death': {
        url: '/modules/games/koobas/audio-player/files/player-death.wav',
        volume: 0.5,
        buffer: null,
    },
    'step': {
        url: '/modules/games/koobas/audio-player/files/step.wav',
        volume: 0.5,
        buffer: null,
    },
}
var context = new AudioContext();

function loadSound(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                resolve(buffer);
            }, reject);
        }

        request.onerror = reject;

        request.send();
    });
}

export function loadAllSounds() {
    return Promise.all(Object.values(sounds).map(sound => {
        return loadSound(sound.url).then(buffer => {
            sound.buffer = buffer;
        });
    }));
}

export function playAudio(name) {
    const sound = sounds[name];

    if (!sound) {
        console.warn(`Sound ${name} not found`);
        return;
    }

    const source = context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(context.destination);
    source.loop = false;

    if (source.start) {
        source.start(source.context.currentTime);
    } else if (source.noteOn) {
        source.noteOn(0);
    }
}