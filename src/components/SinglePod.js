import React from 'react';


const request = require('request');
const parsePodcast = require('node-podcast-parser');

export class SinglePod extends React.Component {
    constructor(props) {
        super(props);
        this.convertTheTime = this.convertTheTime.bind(this);
        this.convertTheDate = this.convertTheDate.bind(this);
        this.fetchApi = this.fetchApi.bind(this);
        this.fetchXml = this.fetchXml.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleMore = this.handleMore.bind(this);
        this.state = {
            id: props.match.params.id,
            podinfo: {},
            rssjson: {},
            fetch: false,
            more: { text: 'more', show: true },
            podPlay: 'Play',
            podList: [],
            podListUpdated: false,
        }
    }


    // Handle more functionality
    handleMore() {
        this.setState({ more: { text: '', show: false } });
    }
    // Fetch rss xml on button click
    handleClick() {
        this.fetchXml();
    }

    // Sending episodes url and type back to parent class
    handlePlay(event) {
        const episodeinfo = {
            episodeList: this.state.podList,
            key: event.target.dataset.key,
        }

        this.props.callbackFunction(episodeinfo);
    }

    // Fetch xml from feedUrl from podcast info and convert it to json
    fetchXml() {
        request("https://cors-anywhere.herokuapp.com/"
            + this.state.podinfo.feedUrl, (err, res, data) => {
                if (err) {
                    console.error('Network error', err);
                    return;
                }

                parsePodcast(data, (err, data) => {
                    if (err) {
                        console.error('Parsing error', err);
                        return;
                    }

                    console.log(data);
                    this.setState({
                        rssjson: data,
                        fetch: true
                    });
                });
            });
    }

    // Fetch podcast info of based on id
    fetchApi() {
        fetch(`https://cors-anywhere.herokuapp.com/https://itunes.apple.com/lookup?id=${this.state.id}&entity=podcast`)
            .then(response => response.json())
            .then(data => this.setState({ podinfo: data.results[0] }, () => {
                this.fetchXml();
            })
            );

    }

    componentWillMount() {
        this.fetchApi();
    }

    convertTheDate(str) {
        let mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(str);
        let mnth = mlist[date.getMonth()];
        let year = date.getFullYear();
        let dat = date.getDate();

        return [mnth, dat, year].join(' ');
    }

    convertTheTime(str) {
        let num = Number(str);
        let min = num / 60;

        return [Math.ceil(min), 'min'].join(' ');
    }

    render() {

        let descContent = '';
        let episode = '';
        let lastUpdated = '';
        if (this.state.fetch) {
            episode = this.state.rssjson.episodes.length + ' Episodes';
            lastUpdated = 'Last Updated: ' + this.convertTheDate(this.state.rssjson.updated);
            if (this.state.more.show) {
                const description = this.state.rssjson.description.long;
                const length = description.length;
                descContent = description.slice(0, length / 4);
                descContent += ' ...';
            } else if (!this.state.more.show) {
                descContent = this.state.rssjson.description.long;
            }
            if (!this.state.podListUpdated) {
                this.state.rssjson.episodes.map(item => this.state.podList.push({
                    'title': item.title,
                    'duration': item.duration,
                    'url': item.enclosure.url,
                    'type': item.enclosure.type
                }));
                this.setState({
                    podListUpdated: true
                });
                // console.log(this.state.podList.map(item => item.duration));
            }

        }


        return (
            <div className="singlePodcast">

                <div className="infoContainer">
                    <div className="mobileflex">
                        <div><img id="artistArtwork"
                            src={this.state.podinfo.artworkUrl600} alt="podcast artwork" /></div>
                        <div id="authorInfoMobile" className="authorInfo">
                            <h2>{this.state.podinfo.collectionName}</h2>

                            {this.state.fetch &&
                                <a target="_blank" rel="noopener noreferrer" href={this.state.rssjson.link}>
                                    <p id="author">{this.state.rssjson.author}</p>
                                </a>
                            }

                            {this.state.fetch &&
                                <div className='podCategories'>
                                    {this.state.rssjson.categories.map(item => <span>{item} . </span>)}
                                </div>
                            }

                        </div>
                    </div>
                    <div id="episodeNo">{episode}</div>
                    <hr />


                    {
                        this.state.fetch &&
                        <p id="description">{descContent}
                            <span id='more' onClick={this.handleMore}>{this.state.more.text}</span>
                        </p>
                    }
                </div>

                <div className="podcastInfoContainer">

                    <div className="authorInfo">
                        <h2>{this.state.podinfo.collectionName}</h2>

                        {
                            this.state.fetch &&
                            <a target="_blank" rel="noopener noreferrer" href={this.state.rssjson.link}>
                                <p id="author">{this.state.rssjson.author}</p>
                            </a>
                        }

                        {
                            this.state.fetch &&
                            <div className='podCategories'>
                                {this.state.rssjson.categories.map(item => <span>{item} . </span>)}
                            </div>
                        }

                    </div>

                    {this.state.fetch && <div id="lastUpdated">{lastUpdated}</div>}
                    <hr />

                    {this.state.fetch && <div className='episodeContainer'>
                        {this.state.rssjson.episodes.map((item, i) =>
                            <div key={i} className="episodeEach">
                                <div>{this.convertTheDate(item.published)}</div>
                                <p>{item.title}</p>
                                <div className="playInfo">
                                    <p data-key={i} onClick={this.handlePlay}>
                                        {this.state.podPlay}
                                    </p>
                                    <div>{this.convertTheTime(item.duration)}</div>
                                </div>
                                <div className="episodeDesc">{item.description}</div>
                            </div>)}
                    </div>}
                </div>
            </div>
        );
    }
}