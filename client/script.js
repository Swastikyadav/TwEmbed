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

  const imageContainer = document.createElement("div");
  imageContainer.className = "img-container";
  imageContainer.style.backgroundColor = "skyblue";
  imageContainer.style.backgroundImage = `url(${userProfile.profile_banner_url})`;

  const profileImage = document.createElement("img");
  profileImage.className = "profile-img";
  profileImage.setAttribute("src", changeProfileImgUrl(userProfile.profile_image_url_https));

  const profileName = document.createElement("div");
  profileName.className = "profile-name";
  profileName.innerHTML = `<p class="name">${userProfile.name}</p><p class="twitter-handle">@${userProfile.screen_name}</p>`;

  const profileBio = document.createElement("p");
  profileBio.className = "profile-bio";
  profileBio.innerHTML = setDescLinks(userProfile.description);

  const locationAndUrl = document.createElement("p");
  locationAndUrl.className = "location-and-url";
  locationAndUrl.innerHTML = `<span class="location">📍 ${userProfile.location}</span> <span class="url">🔗 <a href="${userProfile.url}" target="_blank">${userProfile.url}</a></span>`;

  const followCount = document.createElement("p");
  followCount.className = "follow-count";
  followCount.innerHTML = `<span class="following"><span class="count">${userProfile.friends_count}</span> Following</span> <span class="followers"><span class="count">${userProfile.followers_count}</span> Followers</span>`;

  imageContainer.appendChild(profileImage);
  profileCard.appendChild(imageContainer);
  profileCard.appendChild(profileName);
  profileCard.appendChild(profileBio);
  profileCard.appendChild(locationAndUrl);
  profileCard.appendChild(followCount);

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

function changeProfileImgUrl(url) {
  const reversedUrl = url.split("").reverse().join("");
  const reversedNewUrl = reversedUrl.replace("lamron", "004x004");
  const newUrl = reversedNewUrl.split("").reverse().join("");

  return newUrl;
}

function setDescLinks(description) {
  const descArr = description.split(" ");
  const updatedDescArr = descArr.map(word => {
    if (word.startsWith("https") || word.startsWith("http")) {
      return `<a href="${word}" target="_blank">${word}</a>`;
    }

    return word;
  });

  return updatedDescArr.join(" ");
}