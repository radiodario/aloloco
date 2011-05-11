/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


// GLOBAL VARS
var client_id = '167445789978391';
var client_secret = '14c8f4eb0920dabdb6a3362f95c630a3';
var api_key = '11ac0d9844fbab2df4332d5f0c92a428';
var access_token = '167445789978391%7Ca8aa509f496bc73f9f643d49.1-61003504%7C7zXhzuS0qxPqukBMBZ5t4nkS0sY';
var img_url

string = "https://www.facebook.com/dialog/oauth?client_id=" + client_id + "&redirect_uri=" + "http://localhost:3000/updateToken" + "&scope=email,read_stream,user_status,publish_stream,user_location,friends_location&response_type=token"
console.log(string);


var https = require('https');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');
var models = require('./models/models.js');
var Wish = db.model('Wish');
var Token = db.model('Token');
var facebook = require('facebook-graph');
var accessToken = access_token;
var geo = require('geo');

var graph = new facebook.GraphAPI(accessToken);
var latestTimestamp = new Date(Date.now() - 30000000).toISOString();
latestTimestamp = '2011-04-25T22:38:00'
console.log("starting from: " + latestTimestamp);


function loadmsgs(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            if (data.data[0]) {
                latestTimestamp = data.data[0].created_time.slice(0,-5);
                for (i in data.data) {
                    var thisdata = data.data[i];
                    if (thisdata.message) {
                        graph.getObject(thisdata.from.id, composeMessage(thisdata));
                    }

                }
            } else {
                console.log('No new posts!');
            }

            
        }
}

var composeMessage = function(thisdata) {
    // closure for scope
    return function(error, user) {
        if (error) {
            console.log(error);
            return '';
        } else {
            if (user.location) {
                var location = user.location;
                geo.geocoder(geo.google, location.name, false, function(formattedAddress, latitude, longitude) {
                 var wish = new Wish({
                    id : thisdata.id,
                    name: user.name,
                    message:thisdata.message,
                    location : {name : location.name, id: location.id, lat:latitude, lng:longitude}|| {name : location , id : '0'},
                    place: location.name,
                    from : thisdata.from,
                    created_time: thisdata.created_time,
                    user_image: 'https://graph.facebook.com/'+ thisdata.from.id + '/picture?access_token='+ access_token
                });

                console.log('address: ' + wish.location.name + " resolved to " + formattedAddress + " (" + latitude + ', ' + longitude + ")" );
                console.log('\t->' + wish.doc.location.lat + ', ' + wish.doc.location.lng);
                wish.save(function(err) {
                  if (err)
                    console.log('error: ' + err)
                  else
                    console.log('success!')
                });
            });



            } else {
                location = {name:'undisclosed location', id:0};
                var wish = new Wish({
                    id : thisdata.id,
                    name: user.name,
                    message:thisdata.message,
                    location : {name : location.name, id: location.id, lat:50, lng:0}|| {name : location , id : '0'},
                    place: location.name,
                    from : thisdata.from,
                    created_time: thisdata.created_time,
                    user_image: 'https://graph.facebook.com/'+ thisdata.from.id + '/picture?access_token='+ access_token
                });
                 wish.save(function(err) {
                  if (err)
                    console.log('error: ' + err)
                  else
                    console.log('success!')
                });

            }
            console.log(thisdata.message + ' by: ' + user.name + ' from: ' + location );
           
            
            
            return '';
        }
    };

}

var updateLocations = function() {
    console.log('updating locations');
    Wish.find({}).sort('created_time', -1).execFind( function(err, data){
        data.forEach( function (wish) {
            console.log(wish.message);
            geo.geocoder(geo.google, wish.location.name, false, function(formattedAddress, latitude, longitude) {
                console.log('address: ' + wish.location.name + " resolved to " + formattedAddress + " (" + latitude + ', ' + longitude + ")" );
                wish.location.lat = latitude;
                wish.location.lng = longitude;
                console.log('\t->' + wish.location.lat + ', ' + wish.location.lng);
                wish.save(function(err) {
                  if (err)
                    console.log('error: ' + err)
                  else
                    console.log('success!')
                });
            });
        
        });

    });
    
}


// Wish.find({}).sort('created_time', -1).execFind( function(err, data){
//        data.forEach( function (wish) {
//            console.log(wish);
//        });
//    });

graph.getObject('me/feed', {limit: 100,
                            since : latestTimestamp || 0} , loadmsgs);

setInterval( function() {
    //Token.findOne({}).sort('created_time', -1).execFind( function(data){ updateToken(data.access_token)});
    //console.log(accessToken);
    console.log("updating info from: " + latestTimestamp);
    graph.getObject('me/feed', {limit: 100,
                            since : latestTimestamp || 0} , loadmsgs);
}, 30000);


//function updateToken(token) {
//
//    console.log(token)
//    https.get({ host : 'graph.facebook.com',
//                path : '/oauth/access_token?client_id=' + client_id + '&redirect_uri=http://localhost:3000&client_secret=' + client_secret +  '&code='+ token
//               }, function(res) {
//        console.log(res);
//        token = '';
//        res.on('data', function(d) {
//
//        token += d;
//        process.stdout.write(d);
//
//        });
//        res.on('end', function(){
//            accessToken = token;
//        });
//
//    });
//
//}