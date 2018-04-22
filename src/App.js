import React, { Component } from 'react'
import './App.css'

let defaultStyle = {
  color: '#fff',
}
let fakeServerData = {
  user: {
    name: 'Max',
    playlists: [
      {
        name: 'Driven',
        songs: [
          {name: 'Little sister', duration: 100},
          {name: 'Sonne', duration: 1234},
          {name: 'Son of a gun', duration: 200}
        ]
      },
      {
        name: 'Chill',
        songs: [
          {name: 'Pluuu', duration: 100},
          {name: 'Guuuu', duration: 100},
          {name: 'Ruuuu', duration: 300}
        ]
      },
      {
        name: 'Random',
        songs: [
          {name: 'Galileos nose', duration: 100},
          {name: 'flunky', duration: 100},
          {name: 'poasda', duration: 50}
        ]
      },
      {
        name: 'Classical',
        songs: [
          {name: 'Bach G Minor violin sonata', duration: 100},
          {name: 'Mendelsohn Batholdys thingsmadjing', duration: 100},
          {name: 'Son of a gun', duration: 150}
        ]
      }
    ]
  }
}

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
        <input type="text"/>
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
    this.state = {serverData: {}}
  }

  componentDidMount() {
    setTimeout(
      () => { this.setState({serverData: fakeServerData}) },
      500
    )
  }

  render() {
    return (
      <div className="App">
        {
          this.state.serverData.user ?
          <div>
            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
                  { this.state.serverData.user.name}'s Playlists
            </h1>
            <PlaylistCounter playlists={this.state.serverData.user &&
                                  this.state.serverData.user.playlists}
            />
            <HoursCounter playlists={this.state.serverData.user &&
                                  this.state.serverData.user.playlists}
            />
            <Filter/>
            {this.state.serverData.user.playlists.map(playlist =>
              <Playlist playlist={playlist}/>
            )}
          </div> : <h1 style={defaultStyle}>Loading...</h1>
        }
      </div>
    )
  }
}

export default App
