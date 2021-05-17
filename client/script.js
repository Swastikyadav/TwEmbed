console.log("Script Loaded!");

fetch("/api/v1/getuser/swastikjsdev")
  .then(res => res.json())
  .then(data => {
    if (data.name && data.screen_name) {
      console.log(data);
    } else {
      alert("Please provide valid twitter handle.");
    }
  })
  .catch(error => {
    alert("Something went wrong!");
  });