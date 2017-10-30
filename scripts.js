// PULL EXISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
$(document).ready(function() { 
  showOnLoad();
  searchIdeas();
});

// SINGLE-LINE EVENT LISTENERS
$('.idea-title').keyup(enableButton);
$('.idea-body').keyup(enableButton);
$('.idea-display').on('blur', 'h2', updateTitle);
$('.idea-display').on('blur', 'p', updateBody);
$('.save-button').on('click', storeAndAppendIdea);
$('.idea-body').on('keypress', enableEnterButton);
$('.idea-display').on('click', '.delete', deleteCards);

function deleteCards() {
  var parentDiv = this.closest('div').id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
}

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA TITLE
$('.idea-display').on('focus', 'h2', function() {
  $(this).on('keypress', function(e) {
    if (e.keyCode === 13) {
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newTitle = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.title = newTitle;
      var stringifiedIdea = JSON.stringify(parsedIdea);
      localStorage.setItem(parentDiv, stringifiedIdea);
      this.blur();
    }
  })
})

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA BODY
$('.idea-display').on('focus', 'p', function() {
  $(this).on('keypress', function(e) {
    if(e.keyCode === 13) {
      var parentDiv = this.closest('div').id;
      var newBody = this.innerHTML;
      var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
      parsedIdea.body = newBody;
      var stringifiedIdea = JSON.stringify(parsedIdea);
      localStorage.setItem(parentDiv, stringifiedIdea);
      this.blur();
    }
  })
})

// EVENT LISTENER FOR UPVOTE BUTTON
$('.idea-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div').id;
  // PULL EXISTING OBJ FROM STORAGE
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
    function store() {
      var stringifiedIdea = JSON.stringify(parsedIdea)
      localStorage.setItem(parentDiv, stringifiedIdea)
    }
  parsedIdea.quality ++;
  // IF/ELSE FOR QUALITY RATINGS & STORE CHANGES
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
})


// EVENT LISTENER FOR DOWNVOTE BUTTON
$('.idea-display').on('click', '.downvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  function store() {
    var stringifiedIdea = JSON.stringify(parsedIdea)
    localStorage.setItem(parentDiv, stringifiedIdea)
  } 
  parsedIdea.quality --;
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
})




// FUNCTIONS




// CONSTRUCTOR FUNCTION
function Idea(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  // ASSIGN NUMBER TO QUALITY RATHER THAN CREATE AN ARRAY
  this.quality = 1;
}

// CLEAR INPUT FIELDS
function clearInputs() {
  $('.idea-title').val('');
  $('.idea-body').val('');
}

function enableEnterButton(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
  storeAndAppendIdea();
  }
}

function storeAndAppendIdea() {
  event.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  disableButton();
  $('.idea-title').focus();
}

// IF IDEA TITLE AND BODY ARE EMPTY DISABLE ENTER BUTTON, IF NOT -> ENABLE
// MH - cleaned up if/else to check first for populated fields, then disable.
function enableButton() {
  var ideaTitleValue = $('.idea-title').val();
  var ideaBodyValue = $('.idea-body').val();

  if ((ideaTitleValue !== '') && (ideaBodyValue !== '')) {
    $('.save-button').removeAttr('disabled', true);
  } else {
    disableButton();
  }
}

// DISABLE BUTTON
function disableButton() {
 $('.save-button').attr('disabled', true);
}

// SEND CARD TO LOCALSTORAGE AS OBJECT
function storeCard() {
  var uniqueId = Date.now();
  var ideaCard = new Idea($('.idea-title').val(), $('.idea-body').val(), uniqueId)
  var stringifiedCard = JSON.stringify(ideaCard);
  localStorage.setItem(uniqueId, stringifiedCard);
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
    // `
    // <div id=${idea.id} class="card">
    //   <h2 contenteditable="true">${idea.title}</h2>
    //   <span class="svg delete" title="delete-button" alt="delete idea"></span>
    //   <p contenteditable="true">${idea.body}</p>
    //   <span class="svg upvote" alt="up vote"></span>
    //   <span class="svg downvote" alt="down vote"></span>
    //   <span id="quality" class=${idea.id}>${qualityWord}</span>
    // </div>
    // `
  return card;
}


function prependCard() {
  $('.idea-display').prepend(
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
  )
}


// SEARCH FUNCTIONALITY
function searchIdeas() {
  // .FROM() METHOD CREATE A NEW ARRAY INSTANCE FROM AN ARRAY-LIKE OR ITERABLE OBJECT
  var cardsOnDom = Array.from($('.card'));
  // COULD POSSIBLY JUST LISTEN FOR KEYUP
  $('.search-ideas').on('change keyup', function(event) {
    cardsOnDom.forEach(function(card) {
      $("p").closest('div').hide();
      $("h2").closest('div').hide();
      $("p:contains("+$('.search-ideas').val()+")").closest('div').show();
      $("h2:contains("+$('.search-ideas').val()+")").closest('div').show();
    })
  })
}

function updateTitle() {
  var parentDiv = this.closest('div').id;
  var newTitle = this.innerHTML;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  parsedIdea.title = newTitle;
  var stringifiedIdea = JSON.stringify(parsedIdea);
  localStorage.setItem(parentDiv, stringifiedIdea);
}

function updateBody() {
  var parentDiv = this.closest('div').id;
  var newBody = this.innerHTML;
  var parsedIdea = JSON.parse(localStorage.getItem(parentDiv));
  parsedIdea.body = newBody;
  var stringifiedIdea = JSON.stringify(parsedIdea);
  localStorage.setItem(parentDiv, stringifiedIdea);
}