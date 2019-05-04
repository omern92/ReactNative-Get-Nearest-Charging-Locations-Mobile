import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import  Meteor, { withTracker } from 'react-native-meteor';
import { Card, Button, ListItem } from 'react-native-elements';
import _ from 'lodash';
import moment from 'moment';
import Container from '../components/Container';
import NotFound from '../components/NotFound';
import { Header } from '../components/Text';
import colors from '../config/colors';
import { connectAlert } from '../components/Alert';

class LocationDetails extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      changingStatus: false,
    };
  }

  attemptCheckin = (locationId, checkedIn) => {
    const params = {
      locationId,
      checkedIn,
    };

    if (this.props.user !== null) {
      this.setState({ changingStatus: true });
      Meteor.call('Locations.toggleChecked', params, (err) => {
        if (err) {
          this.props.alertWithType('error', 'Error', err.reason);
        }
        this.setState({ changingStatus: false });
      });
    } else {
      this.props.alertWithType('error', 'Error', 'Only registered users can check in.');
      setTimeout(() => this.props.navigation.navigate('Account'), 2000);
    }
  };

  renderItems = () => {
    if (!this.props.activityReady) {
      return <Header>Loading...</Header>
    } else if (this.props.activity.length === 0) {
      return (
        <NotFound
          text="No activity yet."
          small
        />
      ); 
    }
    return (
      <FlatList 
        data={this.props.activity}
        keyExtractor={ (item, index) => item._id}
        renderItem={({ item }) => (
          <ListItem
            title={item.username}
            subtitle={moment(item.createdAt).format('MMM Do @ h:mma')}
            rightTitle={item.type === 'Checked In' ? 'Checked In' : 'Checked Out'}
          />
        )}
      />
    );
  }



  render() {
    const location = this.props.location || _.get(this.props, 'navigation.state.params', {});
    const userId = _.get(this.props, 'user._id', '');
    const checkedIn = location.checkedInUserId === userId;
    const available = typeof location.checkedInUserId !== 'string';

    let icon = { name: 'check'};
    let title = 'Check In';
    let backgroundColor = colors.primary;

    if (checkedIn) {
      icon = { name: 'close' };
      title = 'Check Out';
      backgroundColor = colors.red;
    } else if (!available) {
      icon = { name: 'close' };
      title = 'Not Available';
    }

    return (
      <Container scroll>
      <Card
        title={location.station_name}
      >
        <Text>{location.street_address}</Text>
        <Text>{location.access_days_time}</Text>
      </Card>
      <Button
        raised
        icon={icon}
        title={title}
        backgroundColor={backgroundColor}
        buttonStyle={{ marginVertical: 20 }}
        disabled={!available && !checkedIn}
        onPress={() => this.attemptCheckin(location._id, checkedIn)}
        loading={this.state.changingStatus}
      />
      <Card
        title={'Activity'}
      >
        {this.renderItems()}
      </Card>
    </Container>
    );
  }
}


const ConnectedLocationDetails = withTracker((params) => {
  let locationId = _.get(params, 'navigation.state.params.locationId', '')
  const location = _.get(params, 'navigation.state.params.location', {});

  if (locationId) {
    Meteor.subscribe('Locations.pub.details', { locationId });
  } else {
    Meteor.subscribe('Locations.pub.details', { locationId: location._id });
    locationId = location._id;
  }

  const activityHandle = Meteor.subscribe('Activity.pub.list', { locationId });
  
  return {
    user: Meteor.user(),
    location: Meteor.collection('locations').findOne({ _id: locationId }),
    activityReady: activityHandle.ready(),
    activity: Meteor.collection('activity').find({ locationId }, { sort: { createdAt: -1 } }),
  };
})(LocationDetails);

export default connectAlert(ConnectedLocationDetails);

