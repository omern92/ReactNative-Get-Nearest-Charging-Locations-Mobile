import React, { Component } from 'react';
import FloatingButton from '../components/FloatingButton';
import Container from '../components/Container';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements'

class NearMe extends Component {
  keyExtractor = (item, index) => item._id
  renderItem = ({ item }) => (
      <ListItem
        title={item.station_name}
        subtitle={this.subTitle(item)}
        onPress={() => this.handlePress(item)}
      />
    );

  subTitle = (item) => {
    let subtitle = '';
    if (item.street_address) {
      subtitle = item.street_address;
    }
    
    if (item.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${item.access_days_time}`;
    } else if (item.access_days_time) {
      subtitle = item.access_days_time;
    }

    return subtitle;
  }

  changeView = (locations, position) => {
    this.props.navigation.dispatch({
      key: 'NearMeMap',
      type: 'ReplaceCurrentScreen',
      routeName: 'NearMeMap',
      params: { locations, position }
    });
  }

  handlePress = (location) => {
    this.props.navigation.navigate('LocationDetails', { location }); 
  };

  render() {
    const { locations, position } = this.props.navigation.state.params;

    return (
      <View>
        <Container scroll>
          <FlatList 
            data={locations}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </Container>

        <FloatingButton
            onPress={() => this.changeView(locations, position)}
        />
      </View>        

    );
  }
}


export default NearMe;
