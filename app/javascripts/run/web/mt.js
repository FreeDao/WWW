// Parse init
Parse.initialize("bcppZuYYybnP4KKOG1AYC8Nn8DKuJolyT3aF5Oji", "Kk2CfHJfy6mVgqWOAUtOV9dB5P0G4l9LvUEgtSCv");
var Player = Parse.Object.extend('Player');

$(window).load(function() {
  $('body').addClass('loaded');
  var query = new Parse.Query(Player);
  query.count({
    success: function(count) {
      $('#players-count-num').html(count);
    }
  })
});

$('#join-btn').click(function() {
  // save device id to Parse datastore
  // $('#join-modal').modal();
  var player = new Player();
  var query = new Parse.Query(Player);
  query.count({
    success: function(count) {
      position = count + 1;
      player.save({position: position, deviceID: getUDID()}, {success: console.log('排队成功.')});
      $('#join-btn').hide();
      $('#join-status').html('<var>' + position + '</var>');
      $('#join-status').show();
      // $('#players-count').hide();
      // $('#players-count-joined').show();
    }
  });

});

$(function() {
  $('#countdown').countdown({
    date: "April 6, 2013 15:03:26",
    render: function(data) {
      var el = $(this.el);
      el.empty()
        // .append("<div class=cd-y>" + this.leadingZeros(data.years, 2) + " <span>years</span></div>")
        .append("<div class=cd-d>" + this.leadingZeros(data.days, 1) + " <span>days</span></div>")
        .append("<div class=cd-h>" + this.leadingZeros(data.hours, 2) + " <span>hrs</span></div>")
        .append("<div class=cd-m>" + this.leadingZeros(data.min, 2) + " <span>min</span></div>")
        .append("<div class=cd-s>" + this.leadingZeros(data.sec, 2) + " <span>sec</span></div>");
    }
  });
});

function getCookie() {
    var cookies = document.cookie.toString().split(';');
    var i = 0;
    var length = cookies.length;
    var result =  {};
    var temp;
    for (i; i < length; i++) {
        temp = cookies[i].split('=');
        if (temp[0]) {
          result[temp[0].trim()] = temp[1] ? temp[1].trim() : '';
        }
    }
    return result;
}

function getUDID() {
  return getCookie().udid;
}
