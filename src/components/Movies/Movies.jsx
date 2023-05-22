import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { useGetMoviesQuery } from '../../services/TMDB';

export const Movies = () => {
  const { data } = useGetMoviesQuery();

  // eslint-disable-next-line no-console
  console.log(data);

  return (
    <div>
      Movies
    </div>
  );
};

export default Movies;
