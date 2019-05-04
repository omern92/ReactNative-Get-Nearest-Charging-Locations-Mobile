import { Meteor } from 'meteor/meteor';
import { Activity } from '../activity';

// Publish locations' activity.
Meteor.publish('Activity.pub.list', function getLocationActivity({ locationId }) {
  return Activity.find({ locationId }, { limit: 5, sort: { createdAt: -1 } });
});

// Publish users' activity.
Meteor.publish('userActivity.pub.list', function getUserActivity({ userId }) {
  return Meteor.users.find({ userId }, { "profile.activity": 1, limit: 5 });
});