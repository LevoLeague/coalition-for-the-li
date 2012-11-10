var User = function () {

  this.property('username', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('familyName', 'string', {required: false});
  this.property('givenName', 'string', {required: false});
  this.property('email', 'string', {required: true});

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');
};

User = geddy.model.register('User', User);

