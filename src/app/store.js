import { configureStore } from '@reduxjs/toolkit';

import { tmdbApi } from '../services/TMDB';

export default configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(tmdbApi.middleware)
});
