import React, { useState, useEffect } from "react"
import useAuth from "./useAuth"
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "58c63d6c452940378c16d1e4a5a65ee0",
});

export default function Dashboard(props) {
  const accessToken = useAuth(props.code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);



  return (
    <Container className="d-flex flex-column py-2" style={{height: '100vh'}}>
      <Form.Control
      type="search"
      placeholder="Search Songs/Artists"
      value={search} onChange={e => setSearch(e.target.value)} />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto"}}>Songs</div>
      <div>Bottom</div>
    </Container>
  )
}
