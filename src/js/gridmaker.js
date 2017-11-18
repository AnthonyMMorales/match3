window.gridmaker = function($) {
  var container = $('#container');

  var grid = [];

  container.on('makeGrid', function(e) {
    makeGrid(e.params.parent, 5, 5, 5, 5);
  });

  function makeGrid(parent, width, height, widthpadding, heightpadding) {
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {

        var item = $('<div />').block();
        item.css('top', y*70+'px')
             .css('left', x*70+'px')
             .appendTo(parent);

        grid.push(item);
      }
    }
  }

}(jQuery);
