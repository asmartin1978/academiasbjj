import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection( 'events' );

if (Meteor.isServer) {
  // This code only runs on the server. 
  //Se publica la coleccion academias. Devuelve todas las academias
  Meteor.publish( 'events', function() { return Events.find(); } );
}



Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'Titulo del enveto.'
  },
  'start': {
    type: String,
    label: 'Hora de comienzo del evento.'
  },
  'end': {
    type: String,
    label: 'Hora de fin del evento'
  },
  'type': {
    type: String,
    label: '¿Que tipo de evento es?',
    allowedValues: [ 'Brazilian Jiu Jitsu', 'Grappling', 'MMA', 'Boxeo' , 'Muay Thai' ]
  },
  'guests': {
    type: Number,
    label: 'Aforo máximo'
  }

});

Events.attachSchema( EventsSchema );


Meteor.methods({
  'addEvent'( event ) {
    check( event, {
      title: String,
      start: String,
      end: String,
      type: String,
      guests: Number
    });

    try {
      return Events.insert( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },



  'editEvent'( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      start: String,
      end: String,
      type: Match.Optional( String ),
      guests: Match.Optional( Number )
    });

    try {
      return Events.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },

  'removeEvent'( event ) {
    check( event, String );
    try {
      return Events.remove( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }


});





