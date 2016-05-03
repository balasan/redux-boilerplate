'use strict';

var User = require('../api/user/user.model');

var dummyUsers = [
  {
    _id: '5706ef322170009d5be58be4',
    provider: 'local',
    name: 'Test User',
    role: 'user',
    email: 'test@test.com',
    password: 'test',
  },
  {
    _id: '5706ef322170009d5be58be3',
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }
];

User.find({}).remove(function() {
  User.create(dummyUsers, function() {
    console.log('finished populating users');
  });
});

