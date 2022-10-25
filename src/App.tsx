import React, { useState } from "react";
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {
  Redirect, Route, Switch, useLocation
} from "react-router-dom";
import "./App.css";
import { InvadersSaveState, InvadersViewState } from "./invaders/invaderData";
import InvadersView, { fromSaveState as fromInvaderSaveState, initialState as invadersViewInitialState, toSaveState as toInvaderSaveState } from "./invaders/invadersView";
import Navbar from "./navbar/navbar";
import { SpiritsSaveState, SpiritsViewState } from "./spirits/spiritData";
import SpiritsView, { fromSaveState as fromSpiritSaveState, initialState as spiritsViewInitialState, toSaveState as toSpiritSaveState } from "./spirits/spiritsView";

interface AppState {
  spiritView: SpiritsViewState;
  invaderView: InvadersViewState;
}

interface SavedState {
  spiritView: SpiritsSaveState;
  invaderView: InvadersSaveState;
}

export default function App({_}: any) {
  const location = useLocation();
  const maybeSavedState = localStorage.getItem("state");
  let initialState: AppState;
  if (maybeSavedState !== null) {
    const savedState: SavedState = JSON.parse(maybeSavedState);
    initialState = {spiritView: fromSpiritSaveState(savedState.spiritView), invaderView: fromInvaderSaveState(savedState.invaderView)};
  } else {
    initialState = {spiritView: spiritsViewInitialState(), invaderView: invadersViewInitialState()}
  }
  
  const [state, setState] = useState<AppState>(initialState);

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

  function saveState(update: AppState): void {
    const toSave: SavedState = {spiritView: toSpiritSaveState(update.spiritView), invaderView: toInvaderSaveState(update.invaderView)};
    localStorage.setItem("state", JSON.stringify(toSave));
    setState(_ => (update))
  }

  return (
    <div className="app" style={getRouteTheme()}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <Navbar />
        <Switch>
          <Route exact path="/" render = {() => {return (<Redirect to="/spirits" />)}} />
          <Route path="/spirits">
            <SpiritsView state={state.spiritView} updateState={(update) => {
              saveState({...state, spiritView: update, invaderView: {...state.invaderView, expansionsToShow: update.expansionsToShow}})
            }} />
          </Route>
          <Route path="/invaders">
            <InvadersView state={state.invaderView} updateState={(update) => {
              saveState({...state, invaderView: update, spiritView: {...state.spiritView, expansionsToShow: update.expansionsToShow}})
            }} />
          </Route>
        </Switch>
      </DndProvider>
    </div>
  )
}
