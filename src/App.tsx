import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SpiritsView, { initialState as spiritsViewInitialState } from "./spirits/spiritsView";
import { SpiritsViewState } from "./spirits/spiritData";
import InvadersView, {initialState as invadersViewInitialState } from "./invaders/invadersView";
import Navbar from "./navbar/navbar";
import "./App.css"
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { InvadersViewState } from "./invaders/invaderData";

interface AppState {
  spiritView: SpiritsViewState;
  invaderView: InvadersViewState;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
      super(props);
      this.state = {spiritView: spiritsViewInitialState(), invaderView: invadersViewInitialState()};
  }
  render() {
    return (
      <Router>
        <div className="app">
          <DndProvider backend={HTML5Backend}>
            <Navbar />
            <Switch>
              <Route exact path="/" render = {() => {return (<Redirect to="/spirits" />)}} />
              <Route path="/spirits">
                <SpiritsView state={this.state.spiritView} updateState={(update) => {
                  this.setState((prev) => ({...prev, spiritView: update}))
                }} />
              </Route>
              <Route path="/invaders">
                <InvadersView state={this.state.invaderView} updateState={(update) => {
                  this.setState((prev) => ({...prev, invaderView: update}))
                }} />
              </Route>
            </Switch>
          </DndProvider>
        </div>
        
        
      </Router>
    )
  }
}
