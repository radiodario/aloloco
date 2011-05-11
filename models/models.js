/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');


    var Schema = mongoose.Schema;


    mongoose.model('Wish', new Schema({
         id : {type:String, index: {unique:true}},
         message: String,
         name : String,
         from : {name : String, id : String},
         location : { name : {type: String , default: 'undisclosed location'}, id : {type: String, default: '0'}, lat: Number, lng: Number},
         place : String,
         created_time : {type:Date, index: true},
         user_image : String
    }));

    mongoose.model('Token', new Schema({
        access_token : String,
        created_date : Date
    }));
