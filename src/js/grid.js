window.grid = function($) {
  var container = $('#container');

  container.on('RandomEvent', function(e) {
    console.log(e);
    $('<div>').appendTo(container).block();
  });
}(jQuery);
