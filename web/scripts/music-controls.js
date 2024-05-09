document.addEventListener('DOMContentLoaded', function() {
    let currentPlayingAudio = null;
    const musicIndicator = document.getElementById('musicToggle');
    const playStopButton = document.getElementById('playStopButton'); // Get the button element

    document.querySelectorAll('.soundLink').forEach(link => {
        link.addEventListener('click', function() {
            // Stop any currently playing audio
            if (currentPlayingAudio && currentPlayingAudio !== this.audio) {
                currentPlayingAudio.pause();
                currentPlayingAudio.currentTime = 0;
                currentPlayingAudio = null;
                updateMusicIndicator();
                playStopButton.style.display = 'none'; // Hide the button when no music is playing
            }

            // Manage audio play
            if (!this.audio) {
                this.audio = new Audio(this.getAttribute('data-src'));
                this.audio.onplay = () => {
                    this.classList.add('playing');
                    currentPlayingAudio = this.audio;
                    updateMusicIndicator('-> Playing...');
                    playStopButton.style.display = 'inline'; // Show the button when music is playing
                };
                this.audio.onpause = () => {
                    this.classList.remove('playing');
                    updateMusicIndicator();
                };
                this.audio.onended = () => {
                    this.classList.remove('playing');
                    if (currentPlayingAudio === this.audio) {
                        currentPlayingAudio = null;
                    }
                    updateMusicIndicator();
                    playStopButton.style.display = 'none'; // Hide the button when music ends
                };
                this.audio.onwaiting = () => {
                    updateMusicIndicator('-> Playing....');
                };
                this.audio.play();
            } else if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
                this.audio.currentTime = 0;
                currentPlayingAudio = null;
                updateMusicIndicator();
                playStopButton.style.display = 'none'; // Hide the button when music is paused
            }
        });
    });

    // Button to toggle stop
    playStopButton.addEventListener('click', function() {
        if (currentPlayingAudio && !currentPlayingAudio.paused) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
            currentPlayingAudio = null;
            updateMusicIndicator();
            this.style.display = 'none'; // Hide the button
        }
    });

    function updateMusicIndicator(text = '') {
        musicIndicator.textContent = 'music ' + text;
    }
});
