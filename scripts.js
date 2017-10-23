$(document).ready(function() { 
  showOnLoad();

var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');

//IDEA CONSTRUCTOR, NEED TO FIGURE OUT HOW TO PUSH THIS TO LOCAL STORAGE
function Idea(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = 1;
}

Idea.prototype.showQuality = function() {
  console.log("Hi, I'm a method added on with prototype");

}

function storeCard() {
  var ideaCard = new Idea($ideaTitle.val(),$ideaBody.val(), Date.now())
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(Date.now(), stringifiedCard);
}

function showStorage () {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = '<div id="'+ideaArray[i].id+'" class="card"><h2>'+ideaArray[i].title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaArray[i].body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><p>Quality: <span id="quality">Swill</span> </p></div>'   
  }
  $('.idea-display').append(card);
    console.log(ideaArray)    
}

function showOnLoad() {
    var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = '<div id="'+ideaArray[i].id+'" class="card"><h2>'+ideaArray[i].title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaArray[i].body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><p>Quality: <span id="quality">Swill</span> </p></div>'   
    $('.idea-display').append(card);
  }
}

Idea.prototype.showCard = function() {
  console.log("Hi, I'm a method added on with prototype");
}

//SAVE USER INPUT TO OBJECT
$saveButton.on('click', function(e) {
  e.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  // ideaCard.showQuality();
})
  
function clearInputs() {
  $ideaTitle.val('');
  $ideaBody.val('');
};

}); //CLOSER OF THE DOCUMENT .READY FUNCTION

$('.idea-display').on('click', '.delete', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
});

$('.idea-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div');
  console.log(this);
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  console.log(parsedIdea.quality)
  parsedIdea.quality++
  console.log(parsedIdea.quality)
  var stringifiedIdea = JSON.stringify(parsedIdea)
  console.log(stringifiedIdea)
  localStorage.setItem(parentDiv, stringifiedIdea)
  // this.closest('div').remove();
});