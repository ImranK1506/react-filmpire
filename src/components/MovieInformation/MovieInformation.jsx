import React, { useEffect, useState } from 'react';
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import genreIcons from '../../assets/genres';
import { MovieList } from '..'
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

import useStyles from './styles';
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
import { userSelector } from '../../features/auth';

export const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const { id } = useParams();
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: '/recommendations', movie_id: id });
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data])

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data])

  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
          media_type: 'movie',
          media_id: id,
          favorite: !isMovieFavorited,
        });

    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    });

    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="5rem"/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something wrong</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      {/* Poster image */}
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px'}}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}/>
      </Grid>
      {/* Title */}
      <Grid item container direction="column" lg={7} >
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        {/* Sub title */}
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        {/* Rating */}
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{marginLeft: '10px'}}>
              {Math.round(data?.vote_average * 10) / 10} / 10
            </Typography>
          </Box>
          {/* Movie length and spoken language */}
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime} min | Language: {data?.spoken_languages[0].name}
          </Typography>
        </Grid>
        {/* Genre icons with links */}
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        {/* Overview */}
        <Typography variant="h5" style={{ marginTop: '10px' }} gutterBottom>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        {/* Display actor images and info */}
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data && data.credits.cast.map((character, i) => (
            character.profile_path && (
              <Grid
                key={i}
                item
                xs={4}
                md={2}
                component={Link}
                to={`/actors/${character.id}`}
                style={{ textDecoration: 'none' }}>
                <img
                  className={classes.castImage}
                  src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                  alt={character.name}
                />
                <Typography color="textPrimary">{character?.name}</Typography>
                <Typography color="textSecondary">{character?.character.split('/')[0]}</Typography>
            </Grid>
            )
          //  Only show first six actors
          )).slice(0, 6)}
        </Grid>
        {/* Movie website */}
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                {/* Movie site */}
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}>
                  Website
                </Button>
                {/* IMDB */}
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}>
                  IMDB
                </Button>
                {/* Trailer */}
                <Button
                  onClick={() => setOpen(true)}
                  href="#"
                  endIcon={<Theaters />}>
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              {/* Favorites */}
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  href="#"
                  endIcon={isMovieFavorited ? <Favorite /> : <FavoriteBorderOutlined />  }>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                {/* Watchlist */}
                <Button
                  onClick={addToWatchlist}
                  href="#"
                  endIcon={isMovieWatchlisted ? <PlusOne /> : <Remove /> }>
                  Watchlist
                </Button>
                {/* Back button */}
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}>
                  <Typography
                    style={{ textDecoration: 'none' }}
                    component={Link} to="/"
                    color="inherit"
                    variant="subtitle2">
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
    {/* Recommendations */}
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" align="center" gutterBottom>
          You might also like
        </Typography>
      {/* Loop through recommended movies */}
        {recommendations
          ? <MovieList movies={recommendations} numberOfMovies={12}/>
          : <Box>Nothing Found</Box>
        }
      </Box>
    {/* Trailer */}
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
       >
        <>
          {data?.videos?.results?.length > 0 && (
            <iframe
              autoPlay
              className={classes.video}
              title="Trailer"
              src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
              allow="autoplay"
            />
          )}
        </>
      </Modal>
    </Grid>
  )
};

export default MovieInformation;
