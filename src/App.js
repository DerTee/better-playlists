import React, { Component } from 'react'
import 'reset-css/reset.css'
import './App.css'
import queryString from 'query-string'

let defaultStyle = {
  color: '#fff',
  'font-family': 'Papyrus'
}
let counterStyle = {...defaultStyle,
  width: "40%",
  display: "inline-block",
  marginBottom: "1rem",
  fontSize: "1.5rem",
  lineHeight: "2rem",
}

function isOdd(number) {
  return number % 2
}

class PlaylistCounter extends Component {
  render() {
    let playlistCounterStyle = counterStyle
    return (
      <div style={playlistCounterStyle}>
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
    let totalDurationHours = Math.round(allSongs.reduce((duration, song) => {
      return duration + song.duration
    }, 0) / 3600 /*convert seconds to hours*/)
    let isTooLow = totalDurationHours < 1
    let hoursCounterStyle = {...counterStyle,
      color: isTooLow ? 'red' : 'white',
      fontWeight: isTooLow ? 'bold' : 'normal'
    }
    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDurationHours} hours</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return(
      <div style={{defaultStyle}}>
        <img alt=""/>
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)}
          style={{...defaultStyle,
            fontSize: "1.5rem",
            color: "black",
            margin: "0.5rem",
          }}/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    let numberOfSongsInOverview = 3
    return(
      <div style={{...defaultStyle,
        display: "inline-block",
        minWidth: "10rem",
        width: "20%",
        padding: ".3rem",
        backgroundColor: isOdd(this.props.index)
          ? '#808080'
          : '#C0C0C0'
      }}>
        <h2>{playlist.name}</h2>
        <img style={{width: "100%"}} src={playlist.imageUrl} alt="" />
        <ul style={{marginTop: "0.3rem"}}>
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
    if(!accessToken)
      return

    fetch('https://api.spotify.com/v1/me',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({user: {name: data.id}}))

    fetch('https://api.spotify.com/v1/me/playlists',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items

      let trackDataPromises = playlists.map( playlist => {
        let responsePromise = fetch(playlist.tracks.href,{
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })

      let allTracksDataPromises =
        Promise.all(trackDataPromises)

      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items.map(item => ({
            name: item.track.name,
            duration: Math.round(item.track.duration_ms / 1000)
          }))
        })
        return playlists
      })

      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(playlist => {
        return {
          name: playlist.name,
          imageUrl: playlist.images[0].url,
          songs: playlist.trackDatas.map(track => ({
              name: track.name,
              duration: track.duration
            })
          )
        }
      })
    }))
  }

  render() {
    let playlistsToRender =
      this.state.user &&
      this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let filterString = this.state.filterString.toLowerCase()
          let matchesPlaylist = playlist.name.toLowerCase().includes(filterString)
          let matchesSongs = playlist.songs.find(song =>
            song.name.toLowerCase().includes(filterString))
          return matchesPlaylist || matchesSongs
        }) : []

    return (
      <div className="App">
        {this.state.user ?
          <div>
            <h1 style={{...defaultStyle,
              fontSize: '3rem',
              marginTop: '.5rem'
            }}>
              { this.state.user.name}'s Playlists
            </h1>
            <PlaylistCounter playlists={playlistsToRender}/>
            <HoursCounter playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {playlistsToRender.map((playlist, i) =>
                  <Playlist playlist={playlist} index={i} />
            )}
          </div> : <button onClick={() => {
              window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login'
                : 'https://better-playlists-backend-fort.herokuapp.com/login'}
            }
            style={{padding: '20px', fontSize: '50px', marginTop: '20px'}}>Sign in with Spotify...</button>
        }
      </div>
    )
  }
}

export default App
