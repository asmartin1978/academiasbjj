import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Academias = new Mongo.Collection('academias');


if (Meteor.isServer) {
  // This code only runs on the server. 
  //Se publica la coleccion academias. Devuelve todas las academias
  Meteor.publish('academias', function academiasPublication() {
    return Academias.find();
  });

  // publish dependent documents and simulate joins
  Meteor.publish("detalleacademia", function (academiaId) {
    check(academiaId, String);
    return Academias.find({_id: academiaId}); 
  });

  // This code only runs on the server. 
  //Se publica la coleccion academias. Devuelve todas las academias
  Meteor.publish('misacademias', function academiasPublication() {
    return Academias.find({ owner: this.userId });
  });
}


Meteor.methods({
  'academias.insert'(nombre, anyo, direccion, ) {
    check(nombre, String);
 	  check(anyo, String);
 	  check(direccion, String);

    // tiene que estar logado ...
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Academias.insert({
      nombre,
      anyo,
      direccion,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },

  'academias.remove'(academiaId) {
    check(academiaId, String);
    
    // tiene que estar logado ...
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const acad = Academias.findOne(academiaId);
    if (acad.owner !== Meteor.userId()) {
      // solo puede borrar el propietario
      throw new Meteor.Error('not-authorized');
    }
    Academias.remove(academiaId);
  },
  
});



