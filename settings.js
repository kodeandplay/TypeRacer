var App = App || {};

App.setModal = function() {
  this.$modal = $('.modal');
  var timeRemaining = 5;
  
  var self = this;
  var intvl = setInterval(function() {
    self.$modal.find('h2').remove().end()
          .append('<h2>Time Remaining:' + timeRemaining-- + '</h2>');
    if(timeRemaining < 0) {
      self.startTime = new Date();
      clearInterval(intvl);
      self.$modal.detach();
      $('#user-word-box').removeAttr('disabled').focus();
    }
  }, 1000);
};
