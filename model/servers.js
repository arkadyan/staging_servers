/*global Meteor, check, Match, console */

Servers = new Meteor.Collection("servers");

Servers.allow({
  insert: function() {
    return false;   // Use createServer method for inserts
  },

  update: function() {
    return false;
  },

  remove: function(userId, server) {
    // You can only remove servers if you are logged in
    return !!userId;
  }
});

Meteor.methods({
  // options should include: name, url
  createServer: function(options) {
    console.log('createServer');

    if (! this.userId)
      throw new Meteor.Error(403, 'You must be logged in');

    check(options, {
      name: NonEmptyString,
      url: NonEmptyString
    });

    var id = Servers.insert({
      name: options.name,
      url: options.url,
      isInUse: false,
      inUseBy: null
    });
    return id;
  },

  takeIt: function(serverId) {
    if (! this.userId)
      throw new Meteor.Error(403, 'You must be logged in');

    Servers.update(serverId, {
      $set: {
        isInUse: true,
        inUseBy: this.userId
      }
    });
  },

  releaseIt: function(serverId) {
    if (! this.userId)
      throw new Meteor.Error(403, 'You must be logged in');

    Servers.update(serverId, {
      $set: {
        isInUse: false,
        inUseBy: null
      }
    });
  },

  updateDescription: function(serverId, newDescription) {
    if (! this.userId)
      throw new Meteor.Error(403, 'You must be logged in');

    Servers.update(serverId, {
      $set: {
        description: newDescription
      }
    });
  }
});


var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});
