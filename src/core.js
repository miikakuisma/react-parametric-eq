export const equalizerDefaults = [
  {
    frequency: 60,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "60"
  },
  {
    frequency: 170,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "170"
  },
  {
    frequency: 310,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "310"
  },
  {
    frequency: 600,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "600"
  },
  {
    frequency: 1000,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "1k"
  },
  {
    frequency: 3000,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "3k"
  },
  {
    frequency: 6000,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "6k"
  },
  {
    frequency: 12000,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "12k"
  },
  {
    frequency: 16000,
    type: "peaking",
    value: 0,
    Q: 0.1,
    label: "16k"
  }
];

export function createAudioContext(audioBuffer) {
  return new Promise((resolve, reject) => {
    if (window.webkitAudioContext) {
      try {
        window.audioContext = new window.webkitAudioContext({
          sampleRate: 44100
        });
        window.audioSource = window.audioContext.createBufferSource();
        window.audioSource.buffer = audioBuffer;
        window.eqInputNode = window.audioContext.createGain();
        window.eqInputNode.gain.setValueAtTime(1, window.audioContext.currentTime);
        window.audioSource.connect(window.eqInputNode);
        // Create EQ nodes
        equalizerDefaults.forEach((eq) => {
          const filter = `eq${eq.frequency}`;
          window[filter] = window.audioContext.createBiquadFilter();
          window[filter].type = eq.type;
          window[filter].frequency.value = eq.frequency;
          window[filter].gain.value = 0.0;
          if (eq.Q && window[filter].Q) {
            window[filter].Q.value = eq.Q;
          }
        });
        // Connect EQ
        window.eqInputNode.connect(window.eq60);
        window.eq60.connect(window.eq170);
        window.eq170.connect(window.eq310);
        window.eq310.connect(window.eq600);
        window.eq600.connect(window.eq1000);
        window.eq1000.connect(window.eq3000);
        window.eq3000.connect(window.eq6000);
        window.eq6000.connect(window.eq12000);
        window.eq12000.connect(window.eq16000);
        window.eq16000.connect(window.audioContext.destination);
        resolve();
      } catch (e) {
        reject(e);
      }
    } else if (window.AudioContext) {
      try {
        window.audioContext = new window.AudioContext({
          sampleRate: 44100
        });
        window.audioSource = window.audioContext.createBufferSource();
        window.audioSource.buffer = audioBuffer;
        window.eqInputNode = window.audioContext.createGain();
        window.eqInputNode.gain.setValueAtTime(1, window.audioContext.currentTime);
        window.audioSource.connect(window.eqInputNode);
        // Create EQ nodes
        equalizerDefaults.forEach((eq) => {
          const filter = `eq${eq.frequency}`;
          window[filter] = window.audioContext.createBiquadFilter();
          window[filter].type = eq.type;
          window[filter].frequency.value = eq.frequency;
          window[filter].gain.value = 0.0;
          if (eq.Q && window[filter].Q) {
            window[filter].Q.value = eq.Q;
          }
        });
        // Connect EQ
        window.eqInputNode.connect(window.eq60);
        window.eq60.connect(window.eq170);
        window.eq170.connect(window.eq310);
        window.eq310.connect(window.eq600);
        window.eq600.connect(window.eq1000);
        window.eq1000.connect(window.eq3000);
        window.eq3000.connect(window.eq6000);
        window.eq6000.connect(window.eq12000);
        window.eq12000.connect(window.eq16000);
        window.eq16000.connect(window.audioContext.destination);
        resolve();
      } catch (e) {
        reject(e);
      }
    }
  });
}

function createOfflineContext({
  audioBuffer,
  numberOfChannels,
  length,
  sampleRate
}) {
  return new Promise((resolve, reject) => {
    if (window.offlineCtx) {
      delete window.offlineCtx;
    }
    if (window.offlineSource) {
      delete window.offlineSource;
    }
    if (window.webkitOfflineAudioContext) {
      // Safari
      window.offlineCtx = new window.webkitOfflineAudioContext(
        numberOfChannels,
        length,
        sampleRate
      );
      window.offlineSource = window.offlineCtx.createBufferSource();
      window.offlineSource.buffer = audioBuffer;
      resolve();
    } else {
      // Chromium
      window.offlineCtx = new window.OfflineAudioContext(
        numberOfChannels,
        length,
        sampleRate
      );
      window.offlineSource = window.offlineCtx.createBufferSource();
      window.offlineSource.buffer = audioBuffer;
      resolve();
    }
  });
}

function renderOfflineContext() {
  return new Promise((resolve, reject) => {
    if (window.webkitOfflineAudioContext) {
      // Safari
      window.offlineSource.start();
      window.offlineCtx.oncomplete = function (result) {
        delete window.offlineCtx;
        resolve(result.renderedBuffer);
      };
      window.offlineCtx.startRendering();
    } else {
      // Chrome
      window.offlineSource.start();
      window.offlineCtx
        .startRendering()
        .then(function (renderedBuffer) {
          delete window.offlineCtx;
          resolve(renderedBuffer);
        })
        .catch(function (err) {
          reject("Rendering failed: " + err);
        });
    }
  });
}

export function render(audioBuffer) {
  return new Promise((resolve, reject) => {
    createOfflineContext({
      audioBuffer,
      length: audioBuffer.length,
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate
    }).then(() => {
      // Create EQ nodes
      equalizerDefaults.forEach((eq) => {
        const offlineFilter = `offlineEq${eq.frequency}`;
        const filter = `eq${eq.frequency}`;
        window[offlineFilter] = window.offlineCtx.createBiquadFilter();
        window[offlineFilter].type = eq.type;
        window[offlineFilter].frequency.value = eq.frequency;
        window[offlineFilter].gain.value = window[filter].gain.value;
        if (eq.Q && window[offlineFilter].Q) {
          window[offlineFilter].Q.value = eq.Q;
        }
      });
      // Connect EQ nodes
      window.offlineSource.connect(window.offlineEq60);
      window.offlineEq60.connect(window.offlineEq170);
      window.offlineEq170.connect(window.offlineEq310);
      window.offlineEq310.connect(window.offlineEq600);
      window.offlineEq600.connect(window.offlineEq1000);
      window.offlineEq1000.connect(window.offlineEq3000);
      window.offlineEq3000.connect(window.offlineEq6000);
      window.offlineEq6000.connect(window.offlineEq12000);
      window.offlineEq12000.connect(window.offlineEq16000);
      window.offlineEq16000.connect(window.offlineCtx.destination);
      renderOfflineContext()
        .catch((error) => {
          reject(error);
        })
        .then((newBuffer) => {
          resolve(newBuffer);
        });
    });
  });
}

export function bufferToWave(abuffer, len) {
	var numOfChan = abuffer.numberOfChannels,
	length = len * numOfChan * 2 + 44,
	buffer = new ArrayBuffer(length),
	view = new DataView(buffer),
	channels = [], i, sample,
	offset = 0,
	pos = 0;

	// write WAVE header
	setUint32(0x46464952);                         // "RIFF"
	setUint32(length - 8);                         // file length - 8
	setUint32(0x45564157);                         // "WAVE"

	setUint32(0x20746d66);                         // "fmt " chunk
	setUint32(16);                                 // length = 16
	setUint16(1);                                  // PCM (uncompressed)
	setUint16(numOfChan);
	setUint32(abuffer.sampleRate);
	setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
	setUint16(numOfChan * 2);                      // block-align
	setUint16(16);                                 // 16-bit (hardcoded in this demo)

	setUint32(0x61746164);                         // "data" - chunk
	setUint32(length - pos - 4);                   // chunk length

	for(i = 0; i < abuffer.numberOfChannels; i++)
		channels.push(abuffer.getChannelData(i));

	while(pos < length) {
		for(i = 0; i < numOfChan; i++) {
			sample = Math.max(-1, Math.min(1, channels[i][offset])); 
			sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0;
			view.setInt16(pos, sample, true);
			pos += 2;
		}
		offset++
	}

	return new Blob([buffer], {type: "audio/wav"});

	function setUint16(data) {
		view.setUint16(pos, data, true);
		pos += 2;
	}

	function setUint32(data) {
		view.setUint32(pos, data, true);
		pos += 4;
	}
}
