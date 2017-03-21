import { Template } from 'meteor/templating';
 
import { Academias } from '../api/academias.js';
 
import './academia.html';
 
Template.academia.events({
  
  'click .delete'() {
    Academias.remove(this._id);
  },

});