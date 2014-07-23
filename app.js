var App = {
  Models: {},
  Views: {},
  Collections: {},
  init: function() {
    this.wordCollection = new App.Views.Words(this.setPrompt());
  }
};

App.setPrompt = function() {
  var idx = Math.floor(Math.random() * App.prompts.length);
  this.prompt = App.prompts[idx];
  this.data = _.map(this.prompt.split(' '), function(text) {
    return {text: text}
  });
  return this.data;
}

App.Models.Word = Backbone.Model.extend({
  defaults: {text: 'blank'}
});


App.Views.WordBox = Backbone.View.extend({
  el: '#user-word-div',
  
  events: {
    'keyup #user-word-box' : 'keyCheck',
    'focus #user-word-box' : 'removePlaceHolder'
  },
  
  removePlaceHolder: function() {
    this.$el.find('#user-word-box').removeAttr('placeholder');
  },
  
  keyCheck: function(e) {
    var value = this.$el.find('#user-word-box').val();
    this.trigger('currentValue', value);
  },
  
  wordError: function(data) {
    this.$el.find('#user-word-box').addClass('word-box-error');
  },
  
  wordFine: function(data) {
    this.$el.find('#user-word-box').removeClass('word-box-error');
  },
  
  clear: function() {
    this.$el.find('#user-word-box').val('');
  },
  
  disable: function() {
    this.$el.find('#user-word-box').attr('disabled', 'disabled');
  }
});


App.Views.Word  = Backbone.View.extend({
  tagName:    'span',
  className:  'word',
    
  initialize: function() {
    this.listenTo(this.model, 'underlineWord' ,   this.addClass);
    this.listenTo(this.model, 'wordError',        this.addClass);
    this.listenTo(this.model, 'promptWordFine',   this.removeClass);
    this.listenTo(this.model, 'removeUnderline',  this.removeClass);
  },
  
  render: function() {
    this.$el.html(this.model.get('text'));
    return this;
  },
  
  removeClass: function(klass) {
    this.$el.removeClass(klass);
  },
  
  addClass: function(klass) {
    this.$el.addClass(klass);
  }
});

App.Collections.Words = Backbone.Collection.extend({
  model: App.Models.Word 
});

App.Views.Words = Backbone.View.extend({
  el: '#prompt',
  
  extView: new App.Views.WordBox(),
  
  initialize: function(words) {
    this.count = 0;
    this.collection = new App.Collections.Words(words);
    this.render();
    this.listenTo(this.extView, 'underline', this.triggerUnderline);
    this.listenTo(this.extView, 'currentValue', this.currentValue)
    this.nextWord(0);
    this.extView.trigger('underline');
  },
  
  currentValue: function(value) {
    this.count++;
    // as per StackOverflow 494035
    RegExp.quote = function(str) {
      return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    };
    
    var re = new RegExp('^' + RegExp.quote(value));
    
    if(!re.test(this.cv)) {
      this.triggerError();
      this.extView.wordError(); 
    } else if(value == this.cv) {
      this.currentWordModel.trigger('promptWordFine', 'word-error');
      this.currentWordModel.trigger('removeUnderline', 'current-word');
      this.nextWord();      
    } else if(re.test(this.cv)) {
      this.extView.wordFine();
      this.currentWordModel.trigger('promptWordFine', 'word-error');
    }    
  },
  
  setWord: function() {
    var word =  this.currentWordModel.get('text'); 
    this.cv = (this.idx === this.collection.length - 1) ? word : word + ' ';
  },
  
  nextWord: function(idx) {
    if(!idx) this.extView.clear();
    
    this.idx = ++this.idx || idx;
    
    if(this.idx >= this.collection.length) {
      this.extView.disable();
      this.results();
      return;
    }
    
    this.currentWordModel = this.collection.models[this.idx];
    this.setWord();
    this.triggerUnderline();
    this.extView.wordFine();
  },
  
  results: function() {
    var percent = App.prompt.length / this.count;
    var seconds = ((new Date() - App.startTime)/1000);
    var minutes = Math.floor(seconds / 60);
    var wpm = ((App.prompt.length/5)/seconds) * 60;
    var html = '<h2>Great Job!</h2>' +
               '<h4>' + parseFloat(percent).toFixed(2) + '% accuracy</h4>' +
               '<h4>' + parseInt(wpm) + ' words/minute.</h4>';
    this.$el.append(App.$modal.html(html));
  },
  
  triggerUnderline: function() {
    this.currentWordModel.trigger('underlineWord', 'current-word');
  },
  
  triggerError: function() {
    this.currentWordModel.trigger('wordError', 'word-error');
  },

  render: function() {
    this.collection.each(function(model) {
      var wordView = new App.Views.Word({model: model});
      this.$el.append(wordView.render().el).append(' ');
    }, this);
    return this;
  }
  
});