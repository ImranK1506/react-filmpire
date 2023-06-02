import React from 'react';
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
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

import useStyles from './styles';
import { useGetMovieQuery } from '../../services/TMDB';

export const MovieInformation = () => {
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const classes = useStyles();
  const dispatch = useDispatch();

  const isMovieFavorited = true;
  const isMovieWatchlisted = true;

  const addToFavorites = () => {

  }

  const addToWatchlist = () => {

  }

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
      <Grid item sm={12} lg={4}>
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
            {data?.runtime}min {data?.spoken_languages.length > 0
            ? `/ ${data?.spoken_languages[0].name}`
            : ''}
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
                  onClick={() => {}}
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
                  onClick={(addToFavorites) => {}}
                  href="#"
                  endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite /> }>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                {/* Watchlist */}
                <Button
                  onClick={(addToWatchlist) => {}}
                  href="#"
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne /> }>
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
    </Grid>
  )
};

export default MovieInformation;
