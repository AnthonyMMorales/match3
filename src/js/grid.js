window.grid = function($) {
  var container = $('#container');

  var grid = $('<div id="grid" class="grid" />');

  grid.appendTo(container);

  container.on('init', function(e) {
    container.trigger({
      type: 'makeGrid',
      params: {
        parent: grid
      }
    });
  });

}(jQuery);
