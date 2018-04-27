import React, { Component } from 'react'
import './App.css'
import queryString from 'query-string'

let defaultStyle = {
  color: '#fff',
}
// let fakeServerData = {
//   user: {
//     name: 'Max',
//     playlists: [
//       {
//         name: 'Driven',
//         songs: [
//           {name: 'Little sister', duration: 100},
//           {name: 'Sonne', duration: 1234},
//           {name: 'Son of a gun', duration: 200}
//         ]
//       }
//     ]
//   }
// }

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
        <h2>{this.props.playlists.length} Text</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce(
      (songs, eachPlaylist) => {return songs.concat(eachPlaylist.songs)},
      []
    )
    let totalDuration = 0.01 * allSongs.reduce((duration, song) => {
      return duration + song.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
        <h2>{totalDuration} hours</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return(
      <div style={defaultStyle}>
        <img alt="Filterimage"/>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    let numberOfSongsInOverview = 3
    return(
      <div style={{...defaultStyle, display: "inline-block", width: "25%"}}>
        <img alt="Playlistimage"/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.slice(0,numberOfSongsInOverview).map(song =>
              <li>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super() // calls constructor of parent class
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    fetch('https://api.spotify.com/v1/me',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({serverData: {user: {name: data.id}}}))
  }

  render() {
    let playlists =
      this.state.serverData.user &&
      this.state.serverData.user.playlists
        ? this.state.serverData.user.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []

    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              { this.state.serverData.user.name}'s Playlists
            </h1>
            { this.state.serverData.user.playlists &&
              <div>
                <PlaylistCounter playlists={playlists}/>
                <HoursCounter playlists={playlists}/>
                <Filter onTextChange={text => this.setState({filterString: text})}/>
                {playlists.map(playlist =>
                      <Playlist playlist={playlist}/>
                )}
                </div>
            }
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'}
            style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify...</button>
        }
      </div>
    )
  }
}

export default App
