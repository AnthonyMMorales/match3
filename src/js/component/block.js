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
