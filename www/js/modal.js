// Get the modal
var modal = document.getElementById("connectModal");
var smodal = document.getElementById("signupModal");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


function showModal(){
    modal.style.display = "block";
}

function hideModal(){
    modal.style.display = "none";
}

function showSModal(){
  smodal.style.display = "block";
}

function hideSModal(){
  smodal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  smodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    smodal.style.display = "none";
  }
}