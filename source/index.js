let propertiesArray = [];
document.addEventListener('DOMContentLoaded',function (){
    fetch('https://samuelmwaura.github.io/maki_properties/db.json')  //fetches the data as the single-whole json object.
    .then(response=>response.json())
    .then(propertiesObject=>{
      const properties = [...propertiesObject.properties];     //access the array in  the big json object
      propertiesArray = [...properties];
      displayProperties(properties);
      displayQuestions(properties);
      displayPropertyMenu(properties)
      enableFilter()
      })
    .catch(error=>console.log(error))
});


//Display a list of all frequently asked questions.
function displayQuestions(properties){
    const questionsSection = document.querySelector('#questionsTab');
    properties.forEach(element => {
    element.questions.forEach(question=>{
      const newListItem = document.createElement('p');
      newListItem.textContent = question;
      questionsSection.appendChild(newListItem);
    });
    });
}

//Display details of the properties.
function displayProperties(properties){
  const propertiesDiv = document.querySelector('#properties');
  properties.forEach(property=>{
  const propertyCard = document.createElement('div');
  propertyCard.addEventListener('click',onCardClick);
  propertyCard.setAttribute('class','propertyCard');
  propertyCard.setAttribute('id',property.id);
  const propertyImage = document.createElement('img');
  propertyImage.src = property.image;
  const propertyName = document.createElement('h3');
  propertyName.textContent = property.name;
  const blockType = document.createElement('p');
  blockType.innerHTML = property.blockTypes;
  const location = document.createElement('p');
  location.textContent = property.location; 
  propertyCard.append(propertyImage,propertyName,location,blockType);
  propertiesDiv.appendChild(propertyCard);
  });
}

//display The list of properties.
function displayPropertyMenu(properties){
  const propertiesList = document.querySelector('#propertiesList');
  properties.forEach(property=>{
  const propertyItem = document.createElement('li');
  propertyItem.textContent =property.name;
  propertyItem.addEventListener('mouseover',(event)=> event.target.style.color = 'brown');
  propertyItem.addEventListener('mouseout',(event)=> {event.target.style.color = 'inherit'; event.target.style.backgroundColor = 'inherit'});
  propertyItem.addEventListener('click',function(event){
  const clickedProperty = propertiesArray .find(property=>property.name === event.target.textContent);
  event.target.style.backgroundColor = 'grey'
  displayAProperty(clickedProperty)   //To display the details of the clicked property.
  });
  propertiesList.appendChild(propertyItem);

  //on click to go back to all properties.
  document.querySelector('#allProperties').addEventListener('click',function(){
  document.querySelectorAll('.propertyCard').forEach(card=>card.style.display = 'inline-grid');
  document.querySelector('#propertiesList').style.display = 'none';
  document.querySelector('#onePropertyDetails').style.display = 'none';
  document.querySelector('#filter').disabled = false;
  });
})
};


//When a property card is clicked
function onCardClick(event){
  document.querySelector('#propertiesList').style.display = 'block';
  document.querySelector('#onePropertyDetails').style.display = 'block';
  document.querySelectorAll('.propertyCard').forEach(card=>card.style.display = 'none')
  document.querySelector('#filter').disabled = true;
  const questions = document.querySelector('#questionsTab');
  questions.style.height = '1.4em';
  questions.addEventListener('click',()=>questions.style.height = '15em') 
  const propertyFocused = propertiesArray.find(property=>property.id === event.target.parentNode.id);
  displayAProperty(propertyFocused);
} 

//display Singe Item details in the main area
function displayAProperty(propertyFocused){
document.querySelector('#onePropertyDetails h2').textContent = `${propertyFocused.name} ${propertyFocused.location}`;
document.querySelector('#onePropertyDetails img').src = propertyFocused.image;
document.querySelectorAll('#onePropertyDetails p')[0].textContent = propertyFocused.blockTypes;
document.querySelectorAll('#onePropertyDetails p')[1].textContent = `Located in ${propertyFocused.location}.`;
document.querySelectorAll('#onePropertyDetails p')[2].textContent =  `${propertyFocused.availableUnits} Free Units.`;
document.querySelectorAll('#onePropertyDetails p')[3].textContent =  `${propertyFocused.likes} Likes.`;
document.querySelector('#likeButton').textContent = `♥ ${propertyFocused.likes}`
const commentList = document.querySelector('#PropertyComments');
Array.from(commentList.children).forEach(child=>child.remove());  //remove list created by the previous displayed property.
propertyFocused.comments.forEach(comment=>{
  const newListComment = document.createElement('li')
  newListComment.textContent = comment;
  commentList.appendChild(newListComment)
});
addAcomment(propertyFocused);
addAlike(propertyFocused);
}


//Add and display a comment.
function addAcomment(propertyFocused){
document.querySelector('#commentForm').addEventListener('submit',(event)=>{
event.preventDefault();
const enteredComment = document.querySelector('#comment').value
propertyFocused.comments.unshift(enteredComment);
 fetch(`https://samuelmwaura.github.io/maki_properties/db.json/properties/${propertyFocused.id}`,{
   method:'PATCH',
   headers:{
     'Content-Type':'application/json',
     Accept:'application/json'
   },
   body:JSON.stringify({comments:propertyFocused.comments})
 })
 .then(response=>response.json())
 .then(updatedProperty=>{
  const newComment = document.createElement('li');
  newComment.textContent = enteredComment
  document.querySelector('#PropertyComments').appendChild(newComment);
 })
 .catch(error=>console.log(error))
});

}

function addAlike(propertyFocused){
document.querySelector('#likeButton').addEventListener('click',(event)=>{
  propertyFocused.likes = parseInt(propertyFocused.likes) + 1;
  fetch(`https://samuelmwaura.github.io/maki_properties/db.json/properties/${propertyFocused.id}`,{
    method:'PATCH',
    headers:{
      "Content-Type":'application/json',
       Accept:'application/json'
    },
    body:JSON.stringify({likes:propertyFocused.likes})
  })
  .then(response=>response.json())
  .then(likedProperty=>{
    document.querySelector('#likeButton').textContent = `♥ ${likedProperty.likes}`
    document.querySelectorAll('#onePropertyDetails p')[3].textContent =  `${likedProperty.likes} Likes.`;
  })
  .catch(error=>console.log(error))
})
}

//Functionality to enable a customer to filter just what they want to see.
function enableFilter(){
document.getElementById('filter').addEventListener('change',(event)=>{
if(event.target.value === 'all'){
  Array.from(document.querySelector('#properties').children).forEach(child=>child.remove())
  displayProperties(propertiesArray)}
else{
  const filteredProperties = propertiesArray.filter(property=> property.location === event.target.value);
  Array.from(document.querySelector('#properties').children).forEach(child=>child.remove())
  displayProperties(filteredProperties)
  };
});;
}
