$(document).ready(function() { 

var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');

//IDEA CONSTRUCTOR, NEED TO FIGURE OUT HOW TO PUSH THIS TO LOCAL STORAGE
function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
}

Idea.prototype.showCard = function() {
  console.log("Hi, I'm a method added on with prototype");
}

function storeCard() {
  var ideaCard = new Idea($ideaTitle.val(),$ideaBody.val())
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(Date.now(), stringifiedCard);
}

function showStorage () {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = '<div id="'+ideaArray[i].id+'" class="card"><h2>'+ideaArray[i].title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaArray[i].body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><p>Quality: <span id="quality"></span> </p></div>'   
  }
  $('.idea-display').append(card);
    
    console.log(ideaArray)    
}

//SAVE USER INPUT TO OBJECT
$saveButton.on('click', function(e) {
  e.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  // ideaCard.showCard();
})

function clearInputs() {
  $ideaTitle.val('');
  $ideaBody.val('');
};

});


$('.idea-display').on('click', '.delete', function() {
  this.closest('div').remove();
})