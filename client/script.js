function fetchProfile(event) {
  event.preventDefault();

  // Access input value
  const twitterHandle = document.querySelector(".t-username-input");

  // Fetch Profile
  fetch(`/api/v1/getuser/${twitterHandle.value}`)
  .then(res => res.json())
  .then(data => {
    if (data.name && data.screen_name) {
      console.log(data);
      showProfile(data);
    } else {
      alert("Please provide valid twitter handle.");
    }
  })
  .catch(error => {
    alert(`Something went wrong.
Error: ${error.message}`);
    return;
  })
  .finally(() => {
    // Empty input field
    twitterHandle.value = "";
  });
}

function showProfile(userProfile) {
  // Display none notice-badge
  const noticeBadge = document.querySelector(".notice-badge");
  noticeBadge.style.display = "none";

  // Remove profileCard and embedInfo if exists
  const profile = document.querySelector(".profileCard");
  const info = document.querySelector(".embedInfo");

  if (!!profile || !!info) {
    profile.remove();
    info.remove();
  }

  // Main section
  const mainElement = document.querySelector(".main");
  mainElement.style.cssText = `
    display: block;
  `;
  
  // profile card section
  const profileCard = document.createElement("section");
  profileCard.className = "profileCard";
  profileCard.innerHTML = userProfile.description;

  // Embed info
  const embedInfo = document.createElement("p");
  embedInfo.className="embedInfo"
  embedInfo.innerHTML = "Add the following script tag in your HTML where you want to embed your profile.";

  // Append profileCard and embedCode sections in mainElement.
  // mainElement.removeChild(mainElement.firstElementChild);
  mainElement.insertBefore(profileCard, mainElement.lastElementChild);
  mainElement.insertBefore(embedInfo, mainElement.lastElementChild);

  // Add widget script code snippet
  const snippet = document.querySelector(".snippet");
  snippet.parentElement.style.display = "block";
  snippet.innerHTML = `&lt;script class="profile-embed" src="https://someurl.com" data-username="${userProfile.screen_name}"&gt;&lt;/script&gt;`
}