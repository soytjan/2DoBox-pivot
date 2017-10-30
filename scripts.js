// PULL EXISTING IDEAS OUT OF STORAGE AND APPEND ON PAGE
$(document).ready(function() { 
  showOnLoad();
});

// SINGLE-LINE EVENT LISTENERS
$('.card-title').keyup(enableSaveButton);
$('.card-body').keyup(enableSaveButton);
$('.card-body').on('keypress', enableEnterButton);
$('.save-button').on('click', storeAndAppend);
$('.card-display').on('blur', 'h2', updateTitle);
$('.card-display').on('blur', 'p', updateBody);
$('.card-display').on('keypress', 'h2', prevCarriageReturnTitle);
$('.card-display').on('keypress', 'p', prevCarriageReturnBody);
$('.card-display').on('click', '.upvote', upvoteQuality);
$('.card-display').on('click', '.downvote', downvoteQuality);
$('.card-display').on('click', '.delete', deleteCards);
$('.search-cards').on('keyup', searchCards);


function prevCarriageReturnTitle() {
  if (event.keyCode === 13) {
    var cardKey = this.closest('div').id;
    var parsedObject = JSON.parse(localStorage.getItem(cardKey));
    parsedObject.title = this.innerText;
    storeCard(parsedObject);
    this.blur();
  }
}

function prevCarriageReturnBody() {
  if (event.keyCode === 13) {
    var cardKey = this.closest('div').id;
    var parsedObject = JSON.parse(localStorage.getItem(cardKey));
    parsedObject.body = this.innerText;
    storeCard(parsedObject);
    this.blur();
  }
}

// Should we make another function that assigns the input? i.e. title or body
// function prevCarriageReturn(input) {
//     if (event.keyCode === 13) {
//     var cardKey = this.closest('div').id;
//     var parsedObject = JSON.parse(localStorage.getItem(cardKey));
//     parsedObject['input'] = this.innerText;
//     storeCard(parsedObject);
//     this.blur();
//   }
// }

function assignQuality(card) {
  if (card.quality == 1) {
    return 'Quality: Swill';
  } else if (card.quality == 2) {
    return 'Quality: Plausible';
  } else if (card.quality == 3) {
    return 'Quality: Genius';
  }
}

function Card(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = 1;
}

function clearInputs() {
  $('.card-title').val('');
  $('.card-body').val('');
}

function createCard() {
  var uniqueId = Date.now();
  var card = new Card($('.card-title').val(), $('.card-body').val(), uniqueId);
  storeCard(card);
  prependCard(card);
}

function deleteCards() {
  var parentDiv = this.closest('div').id;
  localStorage.removeItem(parentDiv);
  this.closest('div').remove();
}

function disableButton() {
 $('.save-button').attr('disabled', true);
}

function enableEnterButton(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    storeAndAppend();
  }
}

function enableSaveButton() {
  var cardTitleValue = $('.card-title').val();
  var cardBodyValue = $('.card-body').val();
  if ((cardTitleValue !== '') && (cardBodyValue !== '')) {
    $('.save-button').removeAttr('disabled', true);
  } else {
    disableButton();
  }
}

function prependCard(card) {
  var quality = assignQuality(card);
  $('.card-display').prepend(
    `
    <div id=${card.id} class="card">
      <h2 contenteditable="true">${card.title}</h2>
      <span class="svg delete" title="delete-button" alt="delete card"></span>
      <p contenteditable="true">${card.body}</p>
      <span class="svg upvote" alt="up vote"></span>
      <span class="svg downvote" alt="down vote"></span>
      <span id="quality" class=${card.id}>${quality}</span>
    </div>
    `
  )
}

// look into making NOT case sensitive
function searchCards() {
  var cardsOnDom = Array.from($('.card'));
    cardsOnDom.forEach(function(card) {
      $("p").closest('div').hide();
      $("h2").closest('div').hide();
      $("p:contains("+$('.search-cards').val()+")").closest('div').show();
      $("h2:contains("+$('.search-cards').val()+")").closest('div').show();
    })
}

function showOnLoad() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    prependCard(parsed);
  }
}

function storeAndAppend() {
  event.preventDefault();
  createCard();
  clearInputs();
  disableButton();
  $('.card-title').focus();
}

function storeCard(card) {
  var stringifiedCard = JSON.stringify(card);
  localStorage.setItem(card.id, stringifiedCard);
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

function upvoteQuality() {
  var cardKey = this.closest('div').id;
  var parsedObject = JSON.parse(localStorage.getItem(cardKey));
  if(parsedObject.quality < 3) {
    parsedObject.quality ++;
  } 
  storeCard(parsedObject);
  $(`.${parsedObject.id}`).text(assignQuality(parsedObject));
}

function downvoteQuality() {
  var cardKey = this.closest('div').id;
  var parsedObject = JSON.parse(localStorage.getItem(cardKey));
  if(parsedObject.quality > 1) {
    parsedObject.quality --;
  } 
  storeCard(parsedObject);
  $(`.${parsedObject.id}`).text(assignQuality(parsedObject));
}