var $ = jQuery;
var container = $('#container');

$(function() {
  container.trigger({type: 'init'});
});
