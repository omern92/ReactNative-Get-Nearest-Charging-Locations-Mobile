import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function onCreateUser(options, user) {
  if (!user.username) {
    // The username MUST be unique. I need to change it to something more robust.
    user.username = user.email.split('@')[0];
  }

  if (user.profile === undefined) {
    user.profile = {};
    user.profile.checkedIn = null;
    user.profile.activity = [];
  }

  return user;
});