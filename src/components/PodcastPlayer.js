import React from 'react';

// PodcastPlayer Class
export class PodcastPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.handleProgressBar = this.handleProgressBar.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleMedia = this.handleMedia.bind(this);
        this.state = {
            episodeList: props.episodeList,
            episodeKey: 0,
            playPause: false,
            progressBar: { width: '0%' },
            // timer: '0:00/0:00',
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            episodeKey: Number(nextProps.episodeKey),
            episodeList: nextProps.episodeList,
            playPause: true,
            progressBar: { width: '0%' }
        })
    }

    handlePrev() {
        if (this.state.episodeKey !== 0) {
            this.setState({
                episodeKey: this.state.episodeKey - 1,
            });
        }
    }
    handleNext() {
        if (this.state.episodeList.length - 1 !== this.state.episodeKey) {
            this.setState({ episodeKey: this.state.episodeKey + 1 });
        }
    }

    handleProgressBar() {
        const player = document.getElementById("mediaPlayer");
        let percent = 0;
        let timerstr = '';
        const timer = () => {
            if (player != null) {
                // console.log(player.currentTime + " " + player.duration);
                // let durMin = Math.floor(player.duration / 60);
                // let durSec = Math.floor(player.duration - durMin * 60);
                // let curMin = Math.floor(player.currentTime / 60);
                // let curSec = Math.floor(player.currentTime - curMin * 60);
                // if (Number(durMin) < 10)
                //     durMin = '0' + durMin;
                // if (Number(durSec) < 10)
                //     durSec = '0' + durSec;
                // if (Number(curMin) < 10)
                //     curMin = '0' + curMin;
                // if (Number(curSec) < 10)
                //     curSec = '0' + curSec;

                // timerstr = curMin + ':' + curSec + '/' + durMin + ':' + durSec;
                // this.setState({ timer: timerstr });

                percent = (player.currentTime / player.duration) * 100;
                this.setState({ progressBar: { width: percent + '%' } });
            }
        }
        setInterval(timer, 1000);


    }
    handleMedia() {
        const player = document.getElementById("mediaPlayer");

        this.setState({ playPause: !this.state.playPause });

        if (this.state.playPause) {
            player.pause();
        } else {
            player.play();
        }
    }

    render() {
        return (
            <div className="podcastPlayer">
                <div>
                    <audio id="mediaPlayer" onCanPlay={this.handleProgressBar} src={this.state.episodeList[this.state.episodeKey].url} autoPlay />
                    <div className="progressBar">
                        <div style={this.state.progressBar}></div>
                    </div>
                    <div className="mediaControl">
                        <p>{this.state.episodeList[this.state.episodeKey].title}</p>
                        <div>
                            {/* <div className="timer">{this.state.timer}</div> */}
                            <div onClick={this.handlePrev}><img src="https://img.icons8.com/small/22/000000/skip-to-start.png" /></div>
                            {!this.state.playPause && <div onClick={this.handleMedia}><img src="https://img.icons8.com/small/22/000000/play.png" /></div>}
                            {this.state.playPause && <div onClick={this.handleMedia}><img src="https://img.icons8.com/small/22/000000/pause.png" /></div>}
                            <div onClick={this.handleNext}><img src="https://img.icons8.com/small/22/000000/end.png" /></div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
