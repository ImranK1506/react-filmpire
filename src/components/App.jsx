import React from 'react';
import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';

import useStyles from './styles';

import { Actors, MovieInformation, Movies, Profile, NavBar } from './index';
import { useSelector } from 'react-redux';
import { userSelector } from '../features/auth';

export const App = () => {
  const { user } = useSelector(userSelector);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolBar} />
        <Switch>
          <Route exact path="/movies/:id">
            <MovieInformation />
          </Route>
          <Route exact path="/actors/:id">
            <Actors />
          </Route>
          <Route exact path="/">
            <Movies />
          </Route>
          <Route exact path={`/profile/${user.id}`}>
            <Profile />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
