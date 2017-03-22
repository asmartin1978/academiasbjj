import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

 
import './academia.html';
 
Template.academia.events({
  
  'click .delete'() {
    Meteor.call('academias.remove', this._id);  
  },

});