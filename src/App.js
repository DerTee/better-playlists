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
        <h2>{this.props.playlists.length} playlists</h2>
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
        <img style={{width: "80px"}} src={playlist.imageUrl} alt="" />
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
    .then(data => this.setState({user: {name: data.id}}))

    fetch('https://api.spotify.com/v1/me/playlists',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        console.log(item.images)
        return {
          name: item.name,
          imageUrl: item.images[0].url,
          songs: []
        }
      })
    }))
  }

  render() {
    let playlistsToRender =
      this.state.user &&
      this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []

    return (
      <div className="App">
        {this.state.user ?
          <div>
            <h1 style={{...defaultStyle, fontSize: '54px'}}>
              { this.state.user.name}'s Playlists
            </h1>
            <PlaylistCounter playlists={playlistsToRender}/>
            <HoursCounter playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {playlistsToRender.map(playlist =>
                  <Playlist playlist={playlist}/>
            )}
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'}
            style={{padding: '20px', fontSize: '50px', marginTop: '20px'}}>Sign in with Spotify...</button>
        }
      </div>
    )
  }
}

export default App
