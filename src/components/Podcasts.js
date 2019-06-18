import React from 'react';
import { Link } from 'react-router-dom';
import jsonCountry from '../config/country.json';
import jsonGenre from '../config/genre.json';

// Podcast Class
export class Podcasts extends React.Component {
    constructor(props) {
        super(props);
        this.handleCountry = this.handleCountry.bind(this);
        this.handleGenre = this.handleGenre.bind(this);
        this.fetchApi = this.fetchApi.bind(this);
        this.state = {
            entry: [],
            country: 'in',
            genre: 26
        };
    }

    // Changing state value with selected country
    handleCountry(event) {
        this.setState({ country: event.target.value });

    }

    // Changing state value with selected genre
    handleGenre(event) {
        this.setState({ genre: event.target.value });
    }

    // Top 50  podcast based on country on genre and country 
    fetchApi() {
        fetch("https://itunes.apple.com/"
            + this.state.country
            + "/rss/topaudiopodcasts/limit=50/genre="
            + this.state.genre + "/json")
            .then(response => response.json())
            .then(data => this.setState({ entry: data.feed.entry }));
    }

    // fetchApi() function before mounting of component
    componentDidMount() {
        this.fetchApi();
    }

    // fetchApi() function after change in selected options
    componentWillUpdate() {
        this.fetchApi();
    }


    render() {
        return (
            <div className="podcastPage">
                <div>
                    <div className="podcastOption">
                        <div>
                            <p>Genre</p>
                            <select value={this.state.genre} onChange={this.handleGenre}>
                                {jsonGenre.entry.map(eachGenre => <option value={eachGenre.id}>{eachGenre.genre}</option>)}
                            </select>
                        </div>
                        <div><p>Country</p>
                            <select value={this.state.country} onChange={this.handleCountry}>
                                {jsonCountry.country.map(eachCountry => <option value={eachCountry.id}>{eachCountry.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="podcastContainer">
                        {this.state.entry.map(eachEntry =>
                            <Link className="podcastLink" to={`/podcast/${eachEntry.id.attributes['im:id']}`}>
                                <div className="podcastAsset">
                                    <p>
                                        <img src={eachEntry['im:image'][2].label} alt="PodcastImage" />
                                    </p>
                                    <p>
                                        {eachEntry['im:name'].label}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}