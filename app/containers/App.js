// @flow
import * as React from 'react';
import Navigation from '../components/Navigation/Navigation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;
  
  render() {
    
    return <MuiThemeProvider>
              <div>
              <Navigation />
              {this.props.children}
            </div>
          </MuiThemeProvider>;
  }
}
