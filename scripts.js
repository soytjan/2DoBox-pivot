// PULL EXISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
$(document).ready(function() { 
  showOnLoad();
  searchCards();
});

// SINGLE-LINE EVENT LISTENERS
$('.card-title').keyup(enableButton);
$('.card-body').keyup(enableButton);
$('.card-display').on('blur', 'h2', updateTitle);
$('.card-display').on('blur', 'p', updateBody);
$('.save-button').on('click', storeAndAppend);
$('.card-body').on('keypress', enableEnterButton);
$('.card-display').on('click', '.delete', deleteCards);

function deleteCards() {
  var parentDiv = this.closest('div').id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
}

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA TITLE
$('.card-display').on('focus', 'h2', function() {
  $(this).on('keypress', function(e) {
    if (e.keyCode === 13) {
      var parentDiv = this.closest('div');
      parentDiv = parentDiv.id;
      var newTitle = this.innerHTML;
      var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
      parsedObject.title = newTitle;
      var stringifiedObject = JSON.stringify(parsedObject);
      localStorage.setItem(parentDiv, stringifiedObject);
      this.blur();
    }
  })
})

// EVENT LISTENER FOR ENTER KEYPRESS ON EDITABLE CONTENT OF IDEA BODY
$('.card-display').on('focus', 'p', function() {
  $(this).on('keypress', function(e) {
    if(e.keyCode === 13) {
      var parentDiv = this.closest('div').id;
      var newBody = this.innerHTML;
      var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
      parsedObject.body = newBody;
      var stringifiedObject = JSON.stringify(parsedObject);
      localStorage.setItem(parentDiv, stringifiedObject);
      this.blur();
    }
  })
})

// EVENT LISTENER FOR UPVOTE BUTTON
$('.card-display').on('click', '.upvote', function() {
  var parentDiv = this.closest('div').id;
  // PULL EXISTING OBJ FROM STORAGE
  var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
    function store() {
      var stringifiedObject = JSON.stringify(parsedObject)
      localStorage.setItem(parentDiv, stringifiedObject)
    }
  parsedObject.quality ++;
  // IF/ELSE FOR QUALITY RATINGS & STORE CHANGES
  if (parsedObject.quality > 3) {
    parsedObject.quality = 3;
    store();
    return;
  }
  else if (parsedObject.quality === 2) {
    $('.'+parentDiv+'').text("Quality: Plausible");
    store();
  }
  else if (parsedObject.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store();
  } 
})


// EVENT LISTENER FOR DOWNVOTE BUTTON
$('.card-display').on('click', '.downvote', function() {
  var parentDiv = this.closest('div');
  parentDiv = parentDiv.id;
  var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
  function store() {
    var stringifiedObject = JSON.stringify(parsedObject)
    localStorage.setItem(parentDiv, stringifiedObject)
  } 
  parsedObject.quality --;
  store();
  if (parsedObject.quality <= 1) {
    parsedObject.quality = 1;
    $('.'+parentDiv+'').text("Quality: Swill");
    store();
    return;
  }   
  else if (parsedObject.quality === 2) {
    $('.'+parentDiv+'').text("Quality: Plausible");
    store()
  }
  else if (parsedObject.quality === 3){
    $('.'+parentDiv+'').text("Quality: Genius");
    store()
  } 
})




// FUNCTIONS




// CONSTRUCTOR FUNCTION
function Card(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  // ASSIGN NUMBER TO QUALITY RATHER THAN CREATE AN ARRAY
  this.quality = 1;
}

// CLEAR INPUT FIELDS
function clearInputs() {
  $('.card-title').val('');
  $('.card-body').val('');
}

function enableEnterButton(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
  storeAndAppend();
  }
}

function storeAndAppend() {
  event.preventDefault();
  storeCard();
  showStorage();
  clearInputs();
  disableButton();
  $('.card-title').focus();
}

// IF IDEA TITLE AND BODY ARE EMPTY DISABLE ENTER BUTTON, IF NOT -> ENABLE
// MH - cleaned up if/else to check first for populated fields, then disable.
function enableButton() {
  var cardTitleValue = $('.card-title').val();
  var cardBodyValue = $('.card-body').val();

  if ((cardTitleValue !== '') && (cardBodyValue !== '')) {
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
  var card = new Card($('.card-title').val(), $('.card-body').val(), uniqueId)
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(uniqueId, stringifiedCard);
}



// PULL EXISISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
function showOnLoad() {
  var cardArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    cardArray.push(parsed)
    assignQuality(cardArray[i]);
    $('.card-display').append(assignQuality(cardArray[i]));
  }
}

// ASSIGN QUALITY TO CARD AND SHOW
// QUALITYS ARE ASSOCIATED WITH A NUMBER (1,2,3) AND WILL ITERATE THRU NUMBERS RATHER THAN ARRAY
function assignQuality(card) {
  var qualityWord = '';
  if (card.quality == 1) {
    qualityWord = 'Quality: Swill'
  } else if (card.quality == 2) {
    qualityWord = 'Quality: Plausible'
  } else if (card.quality == 3) {
    qualityWord = 'Quality: Genius'
  }
  // var card = 
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
  // return card;
}


function prependCard() {
  $('.card-display').prepend(
    `
    <div id=${card.id} class="card">
      <h2 contenteditable="true">${card.title}</h2>
      <span class="svg delete" title="delete-button" alt="delete card"></span>
      <p contenteditable="true">${card.body}</p>
      <span class="svg upvote" alt="up vote"></span>
      <span class="svg downvote" alt="down vote"></span>
      <span id="quality" class=${card.id}>${qualityWord}</span>
    </div>
    `
  )
}


// SEARCH FUNCTIONALITY
function searchCards() {
  // .FROM() METHOD CREATE A NEW ARRAY INSTANCE FROM AN ARRAY-LIKE OR ITERABLE OBJECT
  var cardsOnDom = Array.from($('.card'));
  // COULD POSSIBLY JUST LISTEN FOR KEYUP
  $('.search-cards').on('change keyup', function(event) {
    cardsOnDom.forEach(function(card) {
      $("p").closest('div').hide();
      $("h2").closest('div').hide();
      $("p:contains("+$('.search-cards').val()+")").closest('div').show();
      $("h2:contains("+$('.search-cards').val()+")").closest('div').show();
    })
  })
}

function updateTitle() {
  var parentDiv = this.closest('div').id;
  var newTitle = this.innerHTML;
  var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
  parsedObject.title = newTitle;
  var stringifiedObject = JSON.stringify(parsedObject);
  localStorage.setItem(parentDiv, stringifiedObject);
}

function updateBody() {
  var parentDiv = this.closest('div').id;
  var newBody = this.innerHTML;
  var parsedObject = JSON.parse(localStorage.getItem(parentDiv));
  parsedObject.body = newBody;
  var stringifiedObject = JSON.stringify(parsedObject);
  localStorage.setItem(parentDiv, stringifiedObject);
}