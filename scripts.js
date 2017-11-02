$(document).ready(function() { 
  showOnLoad();
});

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
$('.card-display').on('click', '.mark-completed-button', updateCompleted);
$('.filter-cards').on('keyup', searchCards);
$('.none').on('click', showQualityLevel);
$('.low').on('click', showQualityLevel);
$('.normal').on('click', showQualityLevel);
$('.high').on('click', showQualityLevel);
$('.critical').on('click', showQualityLevel);
$('.show-more-button').on('click', showMoreCards);
$('.filter-button').on('click', activeState);
$('.show-completed').on('click', showCompleted);


function activeState() {
  $(this).toggleClass('active');
}

function assignImportance(card) {
  if (card.quality === 1) {
    return 'importance: none';
  } else if (card.quality === 2) {
    return 'importance: low';
  } else if (card.quality === 3) {
    return 'importance: normal';
  } else if (card.quality === 4) {
    return 'importance: high';
  } else if (card.quality === 5) {
    return 'importance: critical';
  }
}

function showMoreCards() {
  $('.card-display article').show();  
}

function prevCarriageReturnTitle() {
  if (event.keyCode === 13) {
    var cardKey = this.closest('article').id;
    var parsedObject = JSON.parse(localStorage.getItem(cardKey));
    parsedObject.title = this.innerText;
    storeCard(parsedObject);
    this.blur();
  }
}
 
function prevCarriageReturnBody() {
  if (event.keyCode === 13) {
    var cardKey = this.closest('article').id;
    var parsedObject = JSON.parse(localStorage.getItem(cardKey));
    parsedObject.body = this.innerText;
    storeCard(parsedObject);
    this.blur();
  }
}



function Card(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = 3;
  this.completed = false;
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
  var parentArticle = this.closest('article').id;
  localStorage.removeItem(parentArticle);
  this.closest('article').remove();
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
  var quality = assignImportance(card);
  $('.card-display').prepend(
    `
    <article id=${card.id} class="card">
      <h2 contenteditable="true">${card.title}</h2>
      <button class="svg delete" title="delete-button" name="delete-button"></button>
      <p contenteditable="true">${card.body}</p>
      <div class="card-bottom-container">
        <div class="quality-container"> 
          <span class="svg upvote" name="up-vote-button"></span>
          <span class="svg downvote" name="down-vote-button"></span>
          <h3 class="quality"><span class=${card.id}>${quality}</span></h3>
        </div>
        <button class="mark-completed-button gray-outline">Mark Completed</button>
      </div>    
    </article>
    `
  )
}

// look into making NOT case sensitive -- check where it's being called and if it's only being called in one place --rewrite
function searchCards() {
  var cardsOnDom = Array.from($('.card'));
    cardsOnDom.forEach(function(card) {
      $("p").closest('article').hide();
      $("h2").closest('article').hide();
      $("p:contains("+$('.filter-cards').val()+")").closest('article').show();
      $("h2:contains("+$('.filter-cards').val()+")").closest('article').show();
    })
}

// function searchCards() {
//   var cardObjectArray = findExistingCards();
//   var userSearchInput = $('.filter-cards').val().toUpperCase();
//   var filteredCards = cardObjectsArray.filter(function(object) {
//     var upperCaseObjBody = object['body'].toUpperCase();
//     var upperCaseObjTitle = object['title'].toUpperCase();
//     return upperCaseObjBody.match(userSearchInput) || upperCaseObjTitle.match(userSearchInput);
//   })
//   $('.card-display').text('');
//   populateExistingCards(filteredCards);
// }

// function findExistingCards() {
//   var keyValues = [];
//   var keys = Object.keys(localStorage);
//   for (var i = 0; i < keys.length; i++) {
//     keyValues.push(JSON.parse(localStorage.getItem(keys[i])));
//   }
//   return keyValues;
// }

// function populateExistingCards(keyValues) {
//   for(var i = 0; i < keyValues.length; i++) {

//   }
// }

function showOnLoad() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    prependCard(parsed);
    if(parsed.completed === true) {
      $(`#${localStorage.key(i)}`).addClass('completed');
      $(`#${localStorage.key(i)}`).addClass('hide');
    }
  }
}

function showCompleted() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    if(parsed.completed === true) {
      $('.card-display').prepend($(`#${localStorage.key(i)}`).toggleClass('hide'));
    }
  }
  $(this).text($(this).text() == 'Show Completed Tasks' ? 'Hide Completed Tasks' : 'Show Completed Tasks');
}

function showQualityLevel() {
  for (var i = 0; i < localStorage.length; i++) {
    var retrieved = localStorage.getItem(localStorage.key(i));
    var parsed = JSON.parse(retrieved);
    var num = parseInt(this.id);
    if(parsed.quality !== num) {
      $(`#${localStorage.key(i)}`).toggleClass('hide-quality');
    } 
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
  var parentArticle = this.closest('article').id;
  var newTitle = this.innerHTML;
  var parsedObject = JSON.parse(localStorage.getItem(parentArticle));
  parsedObject.title = newTitle;
  storeCard(parsedObject);
}

function updateBody() {
  var parentArticle = this.closest('article').id;
  var newBody = this.innerHTML;
  var parsedObject = JSON.parse(localStorage.getItem(parentArticle));
  parsedObject.body = newBody;
  storeCard(parsedObject);
}

function updateCompleted() {
  var parentArticleId = this.closest('article').id;
  var parsedObject = JSON.parse(localStorage.getItem(parentArticleId));
  if(parsedObject.completed === false) {
    parsedObject.completed = true;
    $(`#${parentArticleId}`).addClass('completed');
  } else {
    parsedObject.completed = false;
    $(`#${parentArticleId}`).removeClass('completed');
  }
  storeCard(parsedObject);
}

function upvoteQuality() {
  var cardKey = this.closest('article').id;
  var parsedObject = JSON.parse(localStorage.getItem(cardKey));
  if(parsedObject.quality < 5) {
    parsedObject.quality ++;
  } 
  storeCard(parsedObject);
  $(`.${parsedObject.id}`).text(assignImportance(parsedObject));
}

function downvoteQuality() {
  var cardKey = this.closest('article').id;
  var parsedObject = JSON.parse(localStorage.getItem(cardKey));
  if(parsedObject.quality > 1) {
    parsedObject.quality --;
  } 
  storeCard(parsedObject);
  $(`.${parsedObject.id}`).text(assignImportance(parsedObject));
}