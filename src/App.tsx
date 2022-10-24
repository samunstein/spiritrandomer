import React, { useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import SpiritsView, { initialState as spiritsViewInitialState } from "./spirits/spiritsView";
import { SpiritsViewState } from "./spirits/spiritData";
import InvadersView, {initialState as invadersViewInitialState } from "./invaders/invadersView";
import Navbar from "./navbar/navbar";
import "./App.css"
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';
import { InvadersViewState } from "./invaders/invaderData";
import {isMobile} from 'react-device-detect';

interface AppState {
  spiritView: SpiritsViewState;
  invaderView: InvadersViewState;
}

export default function App({_}: any) {
  const location = useLocation();
  const [state, setState] = useState<AppState>({spiritView: spiritsViewInitialState(), invaderView: invadersViewInitialState()});

  function getRouteTheme(): React.CSSProperties {
    let color;
    switch(location.pathname as string) {
      case "/spirits": {
        color = "#0076ad";
        break;
      }
      case "/invaders": {
        color = "#911616";
        break;
      }
      default: {
        color = "#999999"
      }
    }
    return {"--theme-color": color} as React.CSSProperties;
  }

  return (
    <div className="app" style={getRouteTheme()}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <Navbar />
        <Switch>
          <Route exact path="/" render = {() => {return (<Redirect to="/spirits" />)}} />
          <Route path="/spirits">
            <SpiritsView state={state.spiritView} updateState={(update) => {
              setState((prev) => ({...prev, spiritView: update, invaderView: {...prev.invaderView, expansionsToShow: update.expansionsToShow}}))
            }} />
          </Route>
          <Route path="/invaders">
            <InvadersView state={state.invaderView} updateState={(update) => {
              setState((prev) => ({...prev, invaderView: update, spiritView: {...prev.spiritView, expansionsToShow: update.expansionsToShow}}))
            }} />
          </Route>
        </Switch>
      </DndProvider>
    </div>
  )
}
