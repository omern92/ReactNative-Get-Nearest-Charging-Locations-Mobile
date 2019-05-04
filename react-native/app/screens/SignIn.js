import React, { Component } from 'react';
import Meteor from 'react-native-meteor';
import { NavigationActions, StackActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import Container from '../components/Container';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';
import { connectAlert } from '../components/Alert';
import NearMe from './NearMe';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: '',
      password: '',
      loading: false,
    };
  }

  goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  onSignIn = () => {
    const { emailOrUsername, password } = this.state;
    if (!emailOrUsername) {
      return this.props.alertWithType('error', 'Error', 'Email or username required.');
    }
    
    if (!password) {
      return this.props.alertWithType('error', 'Error', 'password is required.');
    }

    this.setState({ loading: true });
    Meteor.loginWithPassword(emailOrUsername, password, (err) => {
      this.setState({ loading: false });
      if (err) {
        return this.props.alertWithType('error', 'Error', err.reason);
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Profile' }),
          ],
        });
        this.props.alertWithType('success', 'Welcome!', `Welcome back ${emailOrUsername}.`);
        setTimeout(() => this.props.navigation.dispatch(resetAction), 1500);
        
      }
    });
  }

  render() {
    return (
      <Container scroll>
        <Card>
          <Input
            label="Email or Username"
            placeholder="Please enter your email or username..."
            keyboardType="email-address"
            onChangeText={(emailOrUsername) => this.setState({ emailOrUsername })}
            value={this.state.emailOrUsername}
          />
          <Input
            label="Password"
            placeholder="Please enter your password..."
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <PrimaryButton
            title="Sign In"
            loading={this.state.loading}
            onPress={this.onSignIn}
          />
        </Card>

        <SecondaryButton
          title="Not a user? Sign up!"
          onPress={this.goToSignUp}
        />
      </Container>
    );
  }
}

export default connectAlert(SignIn);
