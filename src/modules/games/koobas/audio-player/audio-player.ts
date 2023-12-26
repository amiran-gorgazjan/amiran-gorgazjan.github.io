type Sound = {
    url: string,
    buffer: AudioBuffer | null,
}

const soundNames = [
    'punch1',
    'apple-bite-1',
    'player-death',
    'step',
    'ascend',
] as const
type SoundName = typeof soundNames[number]

function SOUND(soundName: SoundName, extension: 'wav' | 'mp3'): Sound {
    return {
        url: `/modules/games/koobas/audio-player/files/${soundName}.${extension}`,
        buffer: null,
    }
}

const sounds: Record<SoundName, Sound> = {
    'punch1': SOUND('punch1', 'wav'),
    'apple-bite-1': SOUND('apple-bite-1', 'mp3'),
    'player-death': SOUND('player-death', 'wav'),
    'step': SOUND('step', 'wav'),
    'ascend': SOUND('ascend', 'wav'),
}

var context = new AudioContext();

function loadSound(url: string): Promise<AudioBuffer> {
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

export function playAudio(name: SoundName) {
    const sound = sounds[name];

    if (!sound) {
        console.warn(`Sound ${name} not found`);
        return;
    }

    const source = context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(context.destination);
    source.loop = false;
    source.start(source.context.currentTime);
}