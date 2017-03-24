import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Academias } from '../api/academias.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './academia.js';

import './body.html';

Template.listaacademias.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('academias');
});


Template.listaacademias.helpers({
  academias(){
  	return Academias.find({} , { sort: { createdAt: -1 } });
  },

});



Template.listaacademias.events({
  'submit .new-academia'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const nombre = target.nombre.value;
    const anyo = target.anyo.value;
    const direccion = target.direccion.value;
 

	Meteor.call('academias.insert', nombre, anyo, direccion);
 
    // Clear form
    target.nombre.value = '';
    target.anyo.value = '';
    target.direccion.value = '';
  },
});




