import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Meteor, { withTracker } from 'react-native-meteor';
import { Card, ListItem } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
import { PrimaryButton } from '../components/Form';
import Container from '../components/Container';
import { Header } from '../components/Text';
import NotFound from '../components/NotFound';

class Profile extends Component {

  renderItems = () => {
    const { activity } = this.props;

    if (activity.length === 0) {
      return (
        <NotFound
          text="No activity yet."
          small
        />
      ); 
    }
    return (
      <FlatList 
        data={activity}
        keyExtractor={ (item, index) => index}
        renderItem={({ item }) => (
          <ListItem
            title={item.location}
            subtitle={moment(item.date).format('MMM Do @ h:mma')}
            rightTitle={item.status}
            onPress={() => this.goToLocationDetails(item.locationId || '')}
          />
        )}
      />
    );
  }

  goToLocationDetails = (locationId) => {
    this.props.navigation.navigate('LocationDetails', { locationId });
  }

  onLogout = () => {
    Meteor.logout();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'SignIn' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  render() {
    const user = _.get(this.props, 'user', '');
    console.log(user);

    if (!user) {
      return (
        <Container>
          <Header>You must sign in to access Profile:</Header>
          <PrimaryButton
            title="Login"
            onPress={this.goToSignIn}
          />
        </Container>
      );
    }

    return (
      <Container scroll>
        <Card>
          <Header>Hello, {user.username}</Header>
        </Card>

        <Card
          title={'Activity'}
        >
          {this.renderItems()}
        </Card>

        <PrimaryButton
        title="Logout"
        onPress={this.onLogout}
        />
      </Container>
    );
  }
}

const UserProfile = withTracker(() => {
  let activity = _.get(Meteor.user(), 'profile.activity', '');
  if (activity) {
    activity = activity.reverse();
  }

  return {
    user: Meteor.user(),
    activity, 
  };
})(Profile);

export default UserProfile;
