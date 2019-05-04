import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Container from '../components/Container';
import FloatingButton from '../components/FloatingButton';
import MapCallOut, {styles as MapCallOutStyles } from '../components/MapCallout';

class NearMeMap extends Component {
  
  changeView = (locations, position) => {
    this.props.navigation.dispatch({
      key: 'NearMe',
      type: 'ReplaceCurrentScreen',
      routeName: 'NearMe',
      params: { locations, position }
    });
  }

  subTitle = (location) => {
    let subtitle = '';
    if (location.street_address) {
      subtitle = location.street_address;
    }
    
    if (location.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${location.access_days_time}`;
    } else if (location.access_days_time) {
      subtitle = location.access_days_time;
    }

    return subtitle;
  }

  goToLocationDetails = (location) => {
    this.props.navigation.navigate('LocationDetails', { location });
  }

  render() {
    const { locations, position } = this.props.navigation.state.params;

    return (
      <Container>
        <MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        initialRegion={{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        >
          {locations.map((location) => (
            <Marker
              key={location._id}
              coordinate={location}
            >
              <Callout
                style={MapCallOutStyles.calloutContainer}
                tooltip
                onPress={() => this.goToLocationDetails(location)}
              >
                <MapCallOut
                  title={location.station_name}
                  description={this.subTitle(location)}
                  onPress={() => this.goToLocationDetails(location)}
                />
              </Callout>
            </Marker>
          ))}
        </MapView>

        <FloatingButton
          icon='list'
          onPress={() => this.changeView(locations, position)}
        />
      </Container>
    );
  }
}


export default NearMeMap;
