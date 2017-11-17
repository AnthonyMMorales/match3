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
