import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../podnetIcon.png';


// SideMenu Class
export class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div className="podcastTopBar">
                <div className="podcastStatusBar">
                    <div>
                        <img src={logo} alt="logo" />
                        <p>Podnet</p></div>
                </div>
                <div className="podcastNavigation">
                    <div>
                        <ul>
                            <li><Link to="/">Top Podcast</Link></li>
                            <li><Link to="/search">Search</Link></li>
                            {/* <li><Link to="/favourite">Favourite</Link></li> */}
                        </ul>
                    </div>
                    <hr />
                </div>

            </div>
        );
    }
}
