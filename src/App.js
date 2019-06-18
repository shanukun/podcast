import React from 'react';
import { Route } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import { PodcastPlayer } from './components/PodcastPlayer';
import { SinglePod } from './components/SinglePod';
import { Podcasts } from './components/Podcasts';
import { SearchPodcast } from './components/SearchPodcast';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      episodeList: [{ 'url': 'ab', 'title': '' }],
      episodeKey: 0,
    }
    this.updatePlayer = this.updatePlayer.bind(this);
  }

  updatePlayer = episodeData => {
    console.log("::-" + episodeData.key);
    this.setState({
      episodeList: episodeData.episodeList,
      episodeKey: episodeData.key
    });
  }

  render() {
    return (
      <div>
        <SideMenu />
        <Route exact path='/' component={Podcasts} />
        <Route exact path='/search' component={SearchPodcast} />
        <Route exact path='/podcast/:id' render={props =>
          <SinglePod {...props} callbackFunction={this.updatePlayer} />} />
        <PodcastPlayer
          episodeList={this.state.episodeList}
          episodeKey={this.state.episodeKey} />
      </div>
    );
  }
}
export default App;
