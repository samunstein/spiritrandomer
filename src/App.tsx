import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import SpiritsView, { initialState as spiritsViewInitialState, SpiritsViewState } from "./spirits/spiritsView";
import InvadersView from "./invaders/invadersView";
import Navbar from "./navbar/navbar";
import "./App.css"

interface AppState {
  spiritView: SpiritsViewState,
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
      super(props);
      this.state = {spiritView: spiritsViewInitialState()}
  }
  render() {
    return (
      <Router>
        <div className="app">
          <Navbar />
          <Switch>
            <Route exact path="/" render = {() => {return (<Redirect to="/spirits" />)}} />
            <Route path="/spirits">
              <SpiritsView state={this.state.spiritView} updateState={(update) => this.setState((prev) => ({...prev, spiritView: update}))} />
            </Route>
            <Route path="/invaders">
              <InvadersView />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}
