$(document).ready(function() { 

// PULL EXISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
showOnLoad();
searchIdeas();

// GLOBAL VARIABLES - DECLARE THESE LOCALLY INSTEAD
var $ideaTitle = $('.idea-title');
var $ideaBody = $('.idea-body');
var $saveButton = $('.save-button');
var $searchIdeas = $('.search-ideas');

// EVENT LISTENERS REFERENCING FUNCTION ENABLEBUTTON
$('.idea-title').keyup(enableButton);
$('.idea-body').keyup(enableButton);

// CONSTRUCTOR FUNCTION
function Idea(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  // ASSIGN NUMBER TO QUALITY RATHER THAN CREATE AN ARRAY
  this.quality = 1;
}

// EVENT LISTENER TO STORE AND APPEND
$saveButton.on('click', function(e) {
  // PREVENT REFRESH
  e.preventDefault();
  // SEND TO STORAGE
  storeCard();
  // RETRIEVE FROM STORAGE AND APPEND
  showStorage();
  clearInputs();
  disableButton();
  // MOVE FOCUS TO IDEA TITLE INPUT
  $ideaTitle.focus();
})

// EVENT LISTENER ENABLING ENTER KEY FOR SAVE BUTTON THEN STORE AND APPEND
$ideaBody.on('keydown', function(e) {
  if (e.keyCode == 13 && !e.shiftKey){
    e.preventDefault();
    storeCard();
    showStorage();
    clearInputs();
    disableButton();
    $ideaTitle.focus();
  }
});

// CLEAR INPUTS FIELDS
function clearInputs() {
  $ideaTitle.val('');
  $ideaBody.val('');
};

// IF IDEA TITLE AND BODY ARE EMPTY DISABLE ENTER BUTTON, IF NOT -> ENABLE
// MH - declared values as variables to shorten line length.
function enableButton() {
  var ideaTitleValue = $('.idea-title').val();
  var ideaBodyValue = $('.idea-body').val();

  if (ideaTitleValue === "" || ideaBodyValue === "") {
    $('.save-button').attr('disabled', true);
  }
  else {
    $('.save-button').removeAttr('disabled', false);
  }
}

// DISABLE BUTTON ON PAGE LOAD
function disableButton() {
 $saveButton.attr('disabled', true);
}

// SEND CARD TO LOCALSTORAGE AS OBJECT
function storeCard() {
  var uniqueId = Date.now();
  var ideaCard = new Idea($ideaTitle.val(), $ideaBody.val(), uniqueId)
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(uniqueId, stringifiedCard);
}

// RETRIEVE OBJECT FROM LOCALSTORAGE AND APPEND ON PAGE WITH QUALITY OF SWILL
function showStorage () {
  var ideaArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    ideaArray.push(parsed)
    var card = 
      `
      <div id=${ideaArray[i].id} class="card">
        <h2 contenteditable="true">${ideaArray[i].title}</h2>
        <span class="svg delete" title="delete-button" alt="delete idea"></span>
        <p contenteditable="true">${ideaArray[i].body}</p>
        <span class="svg upvote" alt="up vote"></span>
        <span class="svg downvote" alt="down vote"></span>
        <span id="quality" class=${ideaArray[i].id}>Quality: Swill</span>
      </div>
      `   
  }
  $('.idea-display').append(card);
}

// PULL EXISISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
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

// ASSIGN QUALITY TO CARD AND SHOW
// QUALITYS ARE ASSOCIATED WITH A NUMBER (1,2,3) AND WILL ITERATE THRU NUMBERS RATHER THAN ARRAY
function assignQuality(idea) {
  var qualityWord = '';
  if (idea.quality == 1) {
    qualityWord = 'Quality: Swill'
  } else if (idea.quality == 2) {
    qualityWord = 'Quality: Plausible'
  } else if (idea.quality == 3) {
    qualityWord = 'Quality: Genius'
  }
  var card = 
    `
    <div id=${idea.id} class="card">
      <h2 contenteditable="true">${idea.title}</h2>
      <span class="svg delete" title="delete-button" alt="delete idea"></span>
      <p contenteditable="true">${idea.body}</p>
      <span class="svg upvote" alt="up vote"></span>
      <span class="svg downvote" alt="down vote"></span>
      <span id="quality" class=${idea.id}>${qualityWord}</span>
    </div>
    `
  return card;
}

// SEARCH FUNCTIONALITY
function searchIdeas(){
  // .FROM() METHOD CREATE A NEW ARRAY INSTANCE FROM AN ARRAY-LIKE OR ITERABLE OBJECT
  var cardsOnDom = Array.from($('.card'));
  // COULD POSSIBLY JUST LISTEN FOR KEYUP
  $('.search-ideas').on('change keyup', function(event) {
    cardsOnDom.forEach(function(card) {
      $("p").closest('div').hide();
      $("h2").closest('div').hide();
      $("p:contains("+$searchIdeas.val()+")").closest('div').show();
      $("h2:contains("+$searchIdeas.val()+")").closest('div').show();
    })
  })
}
});

// EVENT LISTENER FOR DELETING CARDS
$('.idea-display').on('click', '.delete', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
});

// EVENT LISTENER FOR UPVOTE BUTTON
$('.idea-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  // PULL EXISTING OBJ FROM STORAGE
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  // setItem() method of the Storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
    function store() {
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
    }
  parsedIdea.quality++;
  // CHANGE VALUES OF OBJ
  store();
  // IF/ELSE FOR QUALITY RATINGS
  if (parsedIdea.quality > 3) {
    parsedIdea.quality = 3;
    store();
    return;
  }
  else if (parsedIdea.quality === 2) {
    $('.'+parentDiv+'').text("Quality: Plausible");
    store();
  }
  else if (parsedIdea.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store();
  } 
});

// EVENT LISTENER FOR DOWNVOTE BUTTON
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
  }
  else if (parsedIdea.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store()
  } 
});

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA TITLE
$('.idea-display').on('focus', 'h2', function() {
  $(this).on('keypress', function(e) {
    var key = e.which || e.keyCode;
        var key = e.which || e.keyCode;
    if (key === 13 && e.shiftKey) {
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

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA BODY
$('.idea-display').on('focus', 'p', function() {
  $(this).on('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key === 13 && e.shiftKey) {
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