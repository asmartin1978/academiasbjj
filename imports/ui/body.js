import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Academias } from '../api/academias.js';
import { Events } from '../api/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './academia.js';
import './body.html';
import './add-edit-event-modal.js';


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


Template.detalleacademia.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe("academias");
});


Template.detalleacademia.helpers({
  academias(id){  
    return Academias.findOne({_id : Router.current().params._id});
  },
});



Template.myacademy.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('academias');
});

Template.myacademy.helpers({
  misacademias(){
    return Academias.find({owner : Meteor.userId()});
  },
});


Template.newacademy.events({
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

    Router.go('myacademy');

  },
});


Template.account.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'events' );
});

Template.account.onRendered( () => {
  $( '#events-calendar' ).fullCalendar({
    events( start, end, timezone, callback ) {
      let data = Events.find().fetch().map( ( event ) => {
        event.editable = !isPast( event.start );
        return event;
      });

      if ( data ) {
        callback( data );
      }
    } ,

    eventRender( event, element ) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
         <p class="guest-count">${ event.guests } Guests</p>
         <p class="type-${ event.type }">#${ event.type }</p>
        `
      );
    },

    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id: event._id,
          start: date,
          end: date
        };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      } else {
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
    },
    dayClick( date ) {
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    },
    eventClick( event ) {
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }


  });

  Tracker.autorun( () => {
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });


});



let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

