class MP3PlayerComponent extends HTMLElement {
    constructor() {
        super();
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.audio = new Audio();
        this.segmentListener = null;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="mp3-player-container anime-theme flex flex-col items-center p-4 rounded-lg">
                <div class="track-info text-center mb-4">
                    <div class="text-xl track-title">Track Title</div>
                    <div class="text-sm artist-name">Artist Name</div>
                </div>

                <div class="controls flex items-center space-x-4 mb-4">
                    <button class="control-button rewind-button p-2 rounded-full text-xl font-bold">
                        « 10s
                    </button>
                    <button class="control-button play-pause-button p-3 rounded-full">
                        <svg class="w-8 h-8 play-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                        </svg>
                         <svg class="w-8 h-8 pause-icon hidden" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm5 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <button class="control-button next-button p-2 rounded-full text-xl font-bold">
                        »
                    </button>
                </div>

                <div class="progress-container w-full h-2 rounded-full mb-2">
                    <div class="progress-bar h-2 rounded-full" style="width: 0%;"></div>
                </div>

                <div class="time-info flex justify-between w-full text-xs">
                    <span class="current-time">0:00</span>
                    <span class="duration">0:00</span>
                </div>

                <!-- Lyrics Display Area -->
                <div class="lyrics-container w-full mt-4 p-2 bg-gray-800 rounded-md max-h-40 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap">
                    Loading lyrics...
                </div>

                <div class="segment-controls flex flex-wrap items-center justify-center space-x-2 mb-4">
                    <div class="flex flex-col items-start">
                        <label for="segment-start-time" class="text-xs mb-1 text-purple-300">Start Time</label>
                        <input type="text" id="segment-start-time" class="segment-start-time w-20 p-1 text-sm rounded bg-gray-700 text-white placeholder-gray-400" placeholder="mm:ss" pattern="\d{2}:\d{2}" maxlength="5">
                    </div>
                    <div class="flex flex-col items-start">
                        <label for="segment-end-time" class="text-xs mb-1 text-purple-300">End Time</label>
                        <input type="text" id="segment-end-time" class="segment-end-time w-20 p-1 text-sm rounded bg-gray-700 text-white placeholder-gray-400" placeholder="mm:ss" pattern="\d{2}:\d{2}" maxlength="5">
                    </div>
                    <button class="segment-play-button control-button p-1 rounded text-sm mt-4">Play Segment</button>
                </div>

                <div class="playlist-container w-full mt-4">
                    <h3 class="text-md font-semibold mb-2">Playlist</h3>
                    <ul class="playlist-list text-sm max-h-40 overflow-y-auto">
                        <!-- Playlist items will be added here -->
                    </ul>
                </div>
            </div>
        `;

        this.initializeElements();
        this.attachEventListeners();
        this.loadMusicList('../MP3/');
    }

    initializeElements() {
        this.playPauseButton = this.querySelector('.play-pause-button');
        this.rewindButton = this.querySelector('.rewind-button');
        this.nextButton = this.querySelector('.next-button');
        this.progressBarContainer = this.querySelector('.progress-container');
        this.progressBar = this.querySelector('.progress-bar');
        this.currentTimeDisplay = this.querySelector('.current-time');
        this.durationDisplay = this.querySelector('.duration');
        this.playIcon = this.querySelector('.play-icon');
        this.pauseIcon = this.querySelector('.pause-icon');
        this.trackTitleDisplay = this.querySelector('.track-title');
        this.artistNameDisplay = this.querySelector('.artist-name');
        this.playlistList = this.querySelector('.playlist-list');
        this.lyricsContainer = this.querySelector('.lyrics-container');
        this.segmentStartTimeInput = this.querySelector('.segment-start-time');
        this.segmentEndTimeInput = this.querySelector('.segment-end-time');
        this.segmentPlayButton = this.querySelector('.segment-play-button');
    }

    attachEventListeners() {
        this.segmentStartTimeInput.addEventListener('input', this.handleTimeInput.bind(this));
        this.segmentEndTimeInput.addEventListener('input', this.handleTimeInput.bind(this));

        // Controls
        this.playPauseButton.addEventListener('click', async () => {
            if (this.audio.paused) {
                try {
                    await this.audio.play();
                } catch (error) {
                    console.error('Error attempting to play:', error);
                }
            } else {
                this.audio.pause();
            }
        });

        this.rewindButton.addEventListener('click', () => {
            this.audio.currentTime -= 10;
        });

        this.nextButton.addEventListener('click', () => {
            this.playNextTrack();
        });

        // Segment playback
        this.segmentPlayButton.addEventListener('click', () => {
            const startTimeStr = this.segmentStartTimeInput.value;
            const endTimeStr = this.segmentEndTimeInput.value;

            const startTime = this.parseMMSS(startTimeStr);
            const endTime = this.parseMMSS(endTimeStr);

            if (startTime !== null && endTime !== null && startTime >= 0 && endTime > startTime) {
                this.playSegment(startTime, endTime);
            } else {
                console.warn('Invalid segment time format (expected mm:ss) or invalid range.');
                alert('Invalid segment time format (expected mm:ss) or invalid range.');
            }
        });

        // Audio element events
        this.audio.addEventListener('play', () => {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
            this.trackTitleDisplay.classList.add('font-bold');
        });

        this.audio.addEventListener('pause', () => {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
            this.trackTitleDisplay.classList.remove('font-bold');
        });

        this.audio.addEventListener('timeupdate', () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
            this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
            this.updateLyricsScroll();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.durationDisplay.textContent = this.formatTime(this.audio.duration);
        });

        this.audio.addEventListener('ended', () => {
            this.playNextTrack();
            this.trackTitleDisplay.classList.remove('font-bold');
        });

        // Progress bar dragging
        let isDragging = false;

        this.progressBarContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.updateProgressBar(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.updateProgressBar(e);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    loadMusicList(directoryPath) {
        const files = [
            "A Sky Full Of Stars by Coldplay.mp3",
            "Baby One More Time by Britney Spears.mp3",
            "Call Me Maybe by Carly Rae Jepsen.mp3",
            "Closer by The Chainsmokers.mp3",
            "Faded by Alan Waker.mp3",
            "Faint by Linkin Park.mp3",
            "Firework.mp3",
            "I Want It That Way.mp3",
            "I Will Always Love You by Whitney Houston.mp3",
            "In The Name Of Love by Martin Garrix & Bebe Rexha.mp3",
            "Inconsolable by Backstreet Boys.mp3",
            "Lemon Tree by Fool's Garden.mp3",
            "Little Talks.mp3",
            "Locked Away by R. City ft. Adam Levine.mp3",
            "My Heart Will Go On by Celine Dion.mp3",
            "Party Rock Anthem by LMFAO.mp3",
            "Payphone.mp3",
            "Photograph by Ed Sheeran.mp3",
            "Poker Face by Lady Gaga.mp3",
            "QUA TỪNG KHUNG HÌNH - Robber.mp3",
            "Rap God by Eminem.mp3",
            "Rolling In The Deep by Adele.mp3",
            "See You Agai.mp3",
            "Sugar by Maroon 5.mp3",
            "Super Bass by Nicki Minaj.mp3",
            "Timber by Keha ft. Pitbull.mp3",
            "Titanium by David Guetta ft. Sia.mp3",
            "Uptown Funk by Bruno Mars ft. Mark Ronson.mp3",
            "Wake Me Up When September Ends by Greenday.mp3",
            "What Is Love by Haddaway.mp3",
            "You Belong With Me.mp3"
        ];

        this.playlist = files
            .filter(file => file.endsWith('.mp3'))
            .map(file => {
                const fileName = file.replace('.mp3', '');
                const parts = fileName.split(' by ');
                const title = parts[0] || fileName;
                const artist = parts[1] || 'Unknown Artist';
                return {
                    title: title.trim(),
                    artist: artist.trim(),
                    url: `${directoryPath}${file}`
                };
            });

        this.renderPlaylist();
        if (this.playlist.length > 0) {
            this.loadTrack(this.currentTrackIndex);
        }
    }

    renderPlaylist() {
        this.playlistList.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('cursor-pointer', 'hover:text-purple-700', 'py-1', 'px-2', 'rounded');
            listItem.setAttribute('data-index', index);
            listItem.textContent = `${track.title} - ${track.artist}`;
            listItem.addEventListener('click', async () => {
                this.loadTrack(index);
                try {
                    await this.audio.play();
                } catch (error) {
                    console.error('Error attempting to play after playlist item click:', error);
                }
                this.highlightTrack(index);
            });
            this.playlistList.appendChild(listItem);
        });
    }

    highlightTrack(index) {
        const previouslyHighlighted = this.playlistList.querySelector('.highlighted-track');
        if (previouslyHighlighted) {
            previouslyHighlighted.classList.remove('highlighted-track');
        }

        const currentTrackElement = this.playlistList.querySelector(`li[data-index="${index}"]`);
        if (currentTrackElement) {
            currentTrackElement.classList.add('highlighted-track');
        }
    }

    async loadTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrackIndex = index;
            const track = this.playlist[index];
            this.audio.src = track.url;
            this.trackTitleDisplay.textContent = track.title;
            this.artistNameDisplay.textContent = track.artist;
            
            this.progressBar.style.width = '0%';
            this.currentTimeDisplay.textContent = '0:00';
            this.durationDisplay.textContent = '0:00';
            this.audio.load();
            this.highlightTrack(index);
            
            try {
                const staticLyrics = await this.fetchLyrics(track.title, track.artist);
                this.lyricsContainer.textContent = staticLyrics;
            } catch (error) {
                console.error('Error loading lyrics:', error);
                this.lyricsContainer.textContent = `Error loading lyrics: ${error.message}`;
            }
        }
    }


    async playNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        try {
            await this.audio.play();
        } catch (error) {
            console.error('Error attempting to play next track:', error);
        }
    }

    async fetchLyrics(title, artist) {
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
        this.lyricsContainer.textContent = 'Loading lyrics...';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                return response.status === 404 ? 'Lyrics not found for this track.' :
                    `HTTP error! status: ${response.status}`;
            }
            const data = await response.json();
            return data.lyrics || 'Lyrics not found for this track.';
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            return `Error fetching lyrics: ${error.message}`;
        }
    }

    updateLyricsScroll() {
        if (!this.lyricsContainer) return;
        const lyrics = this.lyricsContainer.textContent;
        if (!lyrics) return;

        const lines = lyrics.split('\n');
        const currentTime = this.audio.currentTime;
        let targetLine = -1;

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/\[(\d+):(\d+\.\d+)\]/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const totalTime = minutes * 60 + seconds;
                if (currentTime < totalTime) {
                    targetLine = i - 1;
                    break;
                }
            }
        }

        if (targetLine >= 0) {
            const lineHeight = parseFloat(window.getComputedStyle(this.lyricsContainer).lineHeight);
            this.lyricsContainer.scrollTop = targetLine * lineHeight;
        }
    }

    parseMMSS(timeString) {
        const parts = timeString.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0 && seconds < 60) {
                return (minutes * 60) + seconds;
            }
        }
        return null;
    }

    async playSegment(startTime, endTime) {
        if (this.audio.readyState >= 2) {
            if (this.segmentListener) {
                this.audio.removeEventListener('timeupdate', this.segmentListener);
            }

            this.audio.currentTime = startTime;
            try {
                await this.audio.play();
            } catch (error) {
                console.error('Error attempting to play segment:', error);
            }

            this.segmentListener = () => {
                if (this.audio.currentTime >= endTime) {
                    this.audio.pause();
                    this.audio.removeEventListener('timeupdate', this.segmentListener);
                    this.segmentListener = null;
                }
            };
            this.audio.addEventListener('timeupdate', this.segmentListener);
        } else {
            console.warn('Audio not ready to play segment.');
            const canPlayListener = async () => {
                await this.playSegment(startTime, endTime);
                this.audio.removeEventListener('canplaythrough', canPlayListener);
            };
            this.audio.addEventListener('canplaythrough', canPlayListener);
        }
    }

    updateProgressBar(e) {
        const containerRect = this.progressBarContainer.getBoundingClientRect();
        const clickPosition = e.clientX - containerRect.left;
        const percentage = (clickPosition / containerRect.width);
        this.audio.currentTime = this.audio.duration * percentage;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    handleTimeInput(event) {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, '');

        if (value.length > 2) {
            value = value.substring(0, 2) + ':' + value.substring(2);
        }

        if (value.length > 5) {
            value = value.substring(0, 5);
        }

        input.value = value;
    }

    disconnectedCallback() {
        if (this.segmentListener) {
            this.audio.removeEventListener('timeupdate', this.segmentListener);
            this.segmentListener = null;
        }
    }

    static get observedAttributes() {
        return [];
    }
}

customElements.define('mp3-player-component', MP3PlayerComponent);