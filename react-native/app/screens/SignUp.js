/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import { Accounts } from 'react-native-meteor'
import Container from '../components/Container';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';
import { connectAlert } from '../components/Alert';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      loading: false,
    };
  }

  handleChangeEmail = (email) => {
    const { username } = this.state;
    const update = { email };
    const inferredUsername = email.split('@')[0];
    if (username === inferredUsername.slice(0, inferredUsername.length - 1)) {
      update.username = inferredUsername;
    }
    this.setState(update);
  };

  goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  onSubmit = () => {
    const { email, username, password, confirmPassword } = this.state;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return this.props.alertWithType('error', 'Error', 'Incorrect email.');
    } 

    if (!username) {
      return this.props.alertWithType('error', 'Error', 'Username is required.');
    }

    if (!password) {
      return this.props.alertWithType('error', 'Error', 'Password is required.');
    }

    if (password !== confirmPassword) {
      return this.props.alertWithType('error', 'Error', 'Passwords must match.');
    }

    this.setState({ loading: true });
    Accounts.createUser({
      username,
      email,
      password,
    }, 
    (err) => {
      this.setState({ loading: false });
      if (err) {
        this.props.alertWithType('error', 'Error', err.reason);
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Profile' }),
          ],
        });
        this.props.alertWithType('success', 'Success!', `Welcome, ${username}.`);
        setTimeout(() => this.props.navigation.dispatch(resetAction), 1500);
      }
    });
  }

  render() {
    return (
      <Container scroll>
        <Card>
          <Input
            label='EMAIL'
            onChangeText={this.handleChangeEmail}
            value={this.state.email}
            placeholder="Please enter your email..."
            keyboardType="email-address"
            
          />
          <Input
            label='USERNAME'
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            placeholder="Please enter your username..."
          />
          <Input
            label='PASSWORD'
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            placeholder="Please enter your password..."
            secureTextEntry
          />
          <Input
            label='CONFIRM PASSWORD'
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
            value={this.state.confirmPassword}
            placeholder="Please confirm your password..."
            secureTextEntry
          />
          <PrimaryButton
            title="Sign Up"
            loading={this.state.loading}
            onPress={this.onSubmit}
          />
        </Card> 

        <SecondaryButton
          title="Sign in"
          onPress={this.goToSignIn}
        />
      </Container>

    );
  }
}

export default connectAlert(SignUp);
