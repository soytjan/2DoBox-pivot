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
  var uniqueId = Date.now();
  var ideaCard = new Idea($ideaTitle.val(),$ideaBody.val(), uniqueId)
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(uniqueId, stringifiedCard);
}

function showStorage () {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = '<div id="'+ideaArray[i].id+'" class="card"><h2>'+ideaArray[i].title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaArray[i].body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><span class="'+ideaArray[i].id+'">Quality: Swill</span></div>'   
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
    var card = '<div id="'+ideaArray[i].id+'" class="card"><h2>'+ideaArray[i].title+'</h2><img class="svg delete" src="images/delete.svg" title="delete-button" alt="delete idea"><p>'+ideaArray[i].body+'</p><img class="svg upvote" src="images/upvote.svg" alt="up vote"><img class="svg downvote" src="images/downvote.svg" alt="down vote"><span class="'+ideaArray[i].id+'">Quality: Swill</span></div>'   
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
  parentDiv = parentDiv.id;
  console.log(parentDiv)
  $('.'+parentDiv+'').text("hi");
  console.log($(this))
});

// $('.idea-display').on('click', '.upvote', function() {
//   var parentDiv = this.closest('div');
//   parentDiv = parentDiv.id;
//   var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
//   console.log(parsedIdea.quality);
//   if (parsedIdea.quality >= 3) {
//     return;
//   } else if (parsedIdea.quality === 1) {
//     console.log($('img').find('span'))
//     this.closest('#quality').text("Swill");
//   } else if (parsedIdea.quality === 2) {
//     this.closest('#quality').text("good");
//   } else if (parsedIdea.quality === 3) {
//     this.closest('#quality').text("great")
//   } else {
//     parsedIdea.quality++
//     var stringifiedIdea = JSON.stringify(parsedIdea)
//     localStorage.setItem(parentDiv, stringifiedIdea)
//   } 
// });

function upQuality() {


}


$('.idea-display').on('click', '.downvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  console.log(parsedIdea)
  if (parsedIdea.quality <= 1) {
    return;
  } 
  else {
    parsedIdea.quality--
    var stringifiedIdea = JSON.stringify(parsedIdea)
    localStorage.setItem(parentDiv, stringifiedIdea)
  }

});