import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Locations } from './locations';
import { Activity } from '../activity/activity';

export const getNearestLocations = new ValidatedMethod({
  name: 'Locations.getNearestLocations',
  validate: new SimpleSchema({
    latitude: { type: Number, decimal: true },
    longitude: { type: Number, decimal: true },
  }).validator(),
  run({ latitude, longitude }) {
    return Locations.find({ location: { 
      $nearSphere: { 
        $geometry: { 
          type: "Point", coordinates: [longitude, latitude]
        }, 
        $minDistance: 0,
      } 
    } 
  }, { limit: 10 }).fetch();
  },
});

export const toggleChecked = new ValidatedMethod({
  name: 'Locations.toggleChecked',
  validate: new SimpleSchema({
    locationId: { type: String },
    checkedIn: { type: Boolean },
  }).validator(),
  run({ locationId, checkedIn }) {
    const station = Locations.findOne((locationId));

    if (!station) {
      throw new Meteor.Error('Locations.methods.toggleChecked.notFound',
        'Location not found.');
    }

    const user = Meteor.user();
    // Check if the user isn't logged in.
    if (!user) {
      throw new Meteor.Error('Locations.methods.toggleChecked.notLoggedIn',
        'You must be logged In.');      
    }
    // Check if the user has profile property.
    if (user.profile) {
      // Check if the user isn't checked somewhere else.
      if (user.profile.checkedIn && user.profile.checkedIn !== locationId) {
        throw new Meteor.Error('Locations.methods.toggleChecked.userCheckedElse',
          'You already checkedIn somewhere else.');
      }
    }

    // Check if the station checked already by someone else.
    if (station.checkedInUserId && station.checkedInUserId !== this.userId) {
      throw new Meteor.Error('Locations.methods.toggleChecked.LocationAlreadyChecked',
        'The location is already checked by someone else.');
    }
    // Check if the user wants to check in or out.
    let status;
    // If checkedIn is true, then the user pressed to checkout.
    checkedIn ? status = 'Checked Out' : status = 'Checked In';

    // Check if the user is trying to check in although he already checked into that location.
    if (status === 'Checked In' && station.checkedInUserId === this.userId) {
      throw new Meteor.Error('Locations.methods.toggleChecked.checkedInByUser',
      'You\'re already checked in at this location.');
    }
    // Check if the user is trying to check out although he's not currently checked in.
    if (status === 'Checked Out' && station.checkedInUserId !== this.userId) {
      throw new Meteor.Error('Locations.methods.toggleChecked.notCheckedInHere',
      'You are not checked into this location.');
    }

    let userValue;
    let locationValue;

    status === 'Checked Out' ? 
      [userValue, locationValue] = [null, null] 
      : 
      [userValue, locationValue] = [this.userId, locationId];

    Locations.update(locationId, {
      $set: { checkedInUserId: userValue }
    });

    Meteor.users.update(this.userId, {
      $set: { "profile.checkedIn": locationValue },
      $push: { "profile.activity": {
        date: new Date(),
        location: station.station_name,
        status,
        locationId,
      }},
    });



    Activity.insert({
      createdAt: new Date(),
      username: user.username,
      userId: this.userId,
      type: status,
      locationId,
    });
  },
});

