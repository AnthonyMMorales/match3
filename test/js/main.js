window.grid = function($) {
  var container = $('#container');

  container.on('RandomEvent', function(e) {
    console.log(e);
    $('<div>').appendTo(container).block();
  });
}(jQuery);

var $ = jQuery;
var container = $('#container');

$('<p id="helloWorld">Hello World!</p>').appendTo(container);
$('#helloWorld').click(function(e) {
  container.trigger({
    type: 'RandomEvent',
    params: e,
    random: 213678920
  });
});

$.fn.block = function() {
  var self = $(this);

  self.attr('class', 'block')
      // .css('width', '50px')
      // .css('height', '50px')
      .css('background-color', 'white')
      .click(function(e) {
        console.log('click!');
      });

  return this;
};
