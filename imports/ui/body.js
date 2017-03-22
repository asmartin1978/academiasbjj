import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 import { Academias } from '../api/academias.js';

import './academia.js';

import './body.html';

Template.body.helpers({
  academias(){
  	return Academias.find({} , { sort: { createdAt: -1 } });
  },

});


Template.body.events({
  'submit .new-academia'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const nombre = target.nombre.value;
    const anyo = target.anyo.value;
    const direccion = target.direccion.value;
 
    // Insert a task into the collection
    Academias.insert({
      nombre,
      anyo,
      direccion,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
 
    // Clear form
    target.nombre.value = '';
    target.anyo.value = '';
    target.direccion.value = '';
  },
});