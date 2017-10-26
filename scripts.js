$(document).ready(function() { 

showOnLoad();
searchIdeas();

var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');
var $searchIdeas = $('.search-ideas');

$('.idea-title').keyup(enableButton);
$('.idea-body').keyup(enableButton);

//IDEA CONSTRUCTOR, NEED TO FIGURE OUT HOW TO PUSH THIS TO LOCAL STORAGE
function Idea(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = 1;
}

//SAVE USER INPUT TO OBJECT
$saveButton.on('click', function(e) {
  e.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  disableButton();
  $ideaTitle.focus();
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
 $saveButton.attr('disabled', true);
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

//SHOWS STORAGE ON LOAD
function showOnLoad() {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    assignQuality(ideaArray[i]);
    $('.idea-display').append(assignQuality(ideaArray[i]));
  }
}

//ASSIGNS QUALITY BRINGS IT BACK TO ^^^ FUNCTION
function assignQuality(idea) {
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

function searchIdeas(){
  var cardsOnDom = Array.from($('.card'));
  $('.search-ideas').on('change keyup', function(event) {
     cardsOnDom.forEach(function(card) {
      if ($searchIdeas.val() === '') {
        $("p").closest('div').show();
        $("h2").closest('div').show();
      } 
      else {
        ($("p:contains("+$searchIdeas.val()+")") === $searchIdeas.val() || $("h2:contains("+$searchIdeas.val()+")") === $searchIdeas.val());
        $("p").closest('div').hide();
        $("h2").closest('div').hide();
        $("p:contains("+$searchIdeas.val()+")").closest('div').show();
        $("h2:contains("+$searchIdeas.val()+")").closest('div').show();
      }
    })
  })
}

}); //CLOSER OF THE DOCUMENT .READY FUNCTION

//LISTENER TO DELETE CARDS
$('.idea-display').on('click', '.delete', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
});

//UPVOTE CHANGE QUALITY
$('.idea-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
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
    $('.'+parentDiv+'').text("Quality: Plausible");
    store();
  } //UPVOTES TO GENIUS
  else if (parsedIdea.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store();
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
    $('.'+parentDiv+'').text("Quality: Plausible");
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

