import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Button, Icon } from '@material-ui/core';
import { inject , observer } from 'mobx-react';
import swal from 'sweetalert2'

class UserLoginForm extends React.Component {
    state = {
        email: 'Email',
        password: 'Password'
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSubmit = () => {
        // TODO: // work on this... getting all stores from one prop
        console.log(this.props);

        const toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        let user = this.props.stores[0].findUserByEmail(this.state.email)[0];
        user = {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password
        }
        if (user.password === this.state.password) {
          toast({
            type: 'success',
            title: 'Signed in successfully'
          });
          this.props.stores[0].setCurrentUser(user);
          this.props.history.push("/calendar");
        }
        console.log(user);
    };

    render() {

        const classes = {
            button: {
            margin: '5px',
            },
            container: {
            display: 'flex',
            flexWrap: 'wrap',
            },
            textField: {
            marginLeft: '5px',
            marginRight: '5px',
            width: 200,
            },
            menu: {
            width: 200,
            },
            rightIcon: {
            marginLeft: '5px',
            }
        }

        return (
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="email"
                    label="Email"
                    style={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('email')}
                    margin="normal"
                />
                <TextField
                    id="password"
                    label="Password"
                    onChange={this.handleChange('password')}
                    style={classes.textField}
                    margin="normal"
                />
                <Button onClick={() => this.handleSubmit()} variant="contained" color="primary" style={classes.button}>
                    Login
                    <Icon style={classes.rightIcon}>send</Icon>
                </Button>
            </form>
        );
    }
}

// UserLoginForm.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

// export default UserLoginForm;
export default inject('stores','history')(observer(UserLoginForm));
