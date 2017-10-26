$(document).ready(function() { 
showOnLoad();

var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');
$('.idea-title').keyup(enableButton);
$('.idea-body').keyup(enableButton);

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

//PUSH CARDS TO LOCAL STORAGE
function storeCard() {
  var uniqueId = Date.now();
  var ideaCard = new Idea($ideaTitle.val(),$ideaBody.val(), uniqueId)
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(uniqueId, stringifiedCard);
}

//CREATE CARD FROM STORAGE
function showStorage () {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = `<div id=${ideaArray[i].id} class="card">
                  <h2 contenteditable="true">${ideaArray[i].title}</h2>
                  <span class="svg delete" title="delete-button" alt="delete idea"></span>
                  <p contenteditable="true">${ideaArray[i].body}</p>
                  <span class="svg upvote" alt="up vote"></span>
                  <span class="svg downvote" alt="down vote"></span>
                  <span id="quality" class=${ideaArray[i].id}>Quality: Swill</span>
                </div>`   
  }
  $('.idea-display').append(card);
}

function prependCard(idea) {
  console.log(idea);
  var qualityWord = '';
  if (idea.quality == 1) {
    qualityWord = 'Quality: Swill'
  } else if (idea.quality == 2) {
    qualityWord = 'Quality: Plausible'
  } else if (idea.quality == 3) {
    qualityWord = 'Quality: Genius'
  }

 var card = `<div id=${idea.id} class="card">
                <h2 contenteditable="true">${idea.title}</h2>
                <span class="svg delete" title="delete-button" alt="delete idea"></span>
                <p contenteditable="true">${idea.body}</p>
                <span class="svg upvote" alt="up vote"></span>
                <span class="svg downvote" alt="down vote"></span>
                <span id="quality" class=${idea.id}>${qualityWord}</span>
              </div>`
  return card;
}

//SHOWS STORAGE ON LOAD
function showOnLoad() {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    prependCard(ideaArray[i]);
    $('.idea-display').append(prependCard(ideaArray[i]));
  }
}

//SAVE USER INPUT TO OBJECT
$saveButton.on('click', function(e) {
  e.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  disableButton();
})

//UMM... CLEARS INPUTS
function clearInputs() {
  $ideaTitle.val('');
  $ideaBody.val('');
};

function enableButton() {
  if ($('.idea-title').val() === "" || $('.idea-body').val() === "") {
    $('.save-button').attr('disabled', true);
  }
  else {
    $('.save-button').removeAttr('disabled', false);
  }
}

function disableButton() {
 $('.save-button').attr('disabled', true);
}

}); //CLOSER OF THE DOCUMENT .READY FUNCTION

//LISTENER TO DELETE CARDS
$('.idea-display').on('click', '.delete', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
});

//HOLY FUCK THIS MAY BE THE UGLIEST CODE IVE EVER WRITTEN BUT IT GOD DAMN WORKS FOR NOW
//UPVOTE CHANGE QUALITY
$('.idea-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  //PUSH UPDATED QUALITY TO LOCAL STORAGE
  function store() {
    var stringifiedIdea = JSON.stringify(parsedIdea)
    localStorage.setItem(parentDiv, stringifiedIdea)
  }  
  parsedIdea.quality++;
  store();
  //MAKES ANY VOTE OVER 3 REMAIN 3 THEN RETURNS
  if (parsedIdea.quality > 3) {
    parsedIdea.quality = 3;
    store();
    return;
  } //UPVOTES TO GOOD
  else if (parsedIdea.quality === 2) {
    $('.'+parentDiv+'').text("Quality: Good");
    store()
  } //UPVOTES TO GENIUS
  else if (parsedIdea.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store()
  } 
});

$('.idea-display').on('click', '.downvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  function store() {
    var stringifiedIdea = JSON.stringify(parsedIdea)
    localStorage.setItem(parentDiv, stringifiedIdea)
  } 
  parsedIdea.quality--;
  store();
  if (parsedIdea.quality <= 1) {
    parsedIdea.quality = 1;
    $('.'+parentDiv+'').text("Quality: Swill");
    store();
    return;
  }   
  else if (parsedIdea.quality === 2) {
    $('.'+parentDiv+'').text("Quality: Good");
    store()
  } //UPVOTES TO GENIUS
  else if (parsedIdea.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store()
  } 
});


//CHANGE THE TITLE AND SAVE TO LOCAL STORAGE
$('.idea-display').on('click', 'h2', function() {
  $(this).on('keypress', function(e) {
    var key = e.which || e.keyCode;
        var key = e.which || e.keyCode;
    if (key === 13 && e.shiftKey) {
      console.log("enter and shift pressed")
    }
    else if (key === 13 || this.blur === true) {
      e.preventDefault();
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newTitle = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.title = newTitle;
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
    }
  })
  $(this).on('blur', function(event) {
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newTitle = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.title = newTitle;
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
  })
})

//CHANGE THE BODY AND SAVE TO LOCAL STORAGE
$('.idea-display').on('click', 'p', function() {
  $(this).on('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13 && e.shiftKey) {
      console.log("enter and shift pressed")
    }
    else if(key === 13) {
      e.preventDefault();
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newBody = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.body = newBody;
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
    }
  })
  $(this).on('blur', function(event) {
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newBody = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.body = newBody;
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
  })
})

