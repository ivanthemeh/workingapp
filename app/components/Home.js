// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import UserLoginForm from './UserLoginForm';
import { inject , observer } from 'mobx-react';
import os from 'os';
import MyCalendar from '../components/BigCalendar/BigCalendar';

console.log(os);


type Props = {};

class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <MyCalendar />
          {
            this.props.stores[0].currentUser ? JSON.stringify(this.props.stores[0].currentUser) : <UserLoginForm />
          }
        </div>
      </div>
    );
  }
}
// <IconCalendar />

export default inject(['stores'])(observer(Home))
