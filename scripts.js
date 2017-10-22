$(document).ready(function() { 

var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');

//IDEA CONSTRUCTOR, NEED TO FIGURE OUT HOW TO PUSH THIS TO LOCAL STORAGE
function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date();
}

//SAVE USER INPUT TO OBJECT
$saveButton.on('click', function(e) {
  e.preventDefault();
  var ideaCard = new Idea($ideaTitle.val(),$ideaBody.val())  
  var card = '<div class="card"><h2>'+ideaCard.title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaCard.body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><p>Quality: <span id="quality"></span> </p></div>'
  $('.idea-display').append(card);
})

$('.idea-display').on('click', '.delete', function() {
  this.closest('div').remove();
})


});