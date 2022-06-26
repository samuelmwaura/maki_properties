document.addEventListener('DOMContentLoaded',function (){
    fetch('http://localhost:3000/properties')
    .then(response=>response.json())
    .then(properties=>{
      displayProperties(properties);
      displayQuestions(properties);
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
  const propertyImage = document.createElement('img');
  propertyImage.src = property.image;
  const propertyName = document.createElement('h3');
  propertyName.textContent = property.name;
  const blockType = document.createElement('p');
  blockType.innerHTML = `${property.blockTypes} <br>Available units: ${property.availableUnits}`;
  const location = document.createElement('p');
  location.textContent = property.location;
  const propertyComments = document.createElement('div');
  propertyComments.textContent = property.comments;  
  propertyCard.append(propertyImage,propertyName,location,blockType,propertyComments);
  propertiesDiv.appendChild(propertyCard);
  });
}

//function oncard click
function onCardClick(event){
alert();  
} 

//Function 