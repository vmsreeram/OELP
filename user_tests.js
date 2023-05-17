/**
 * fetch('http://localhost:3000/move-dot?x=100&y=200')
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));

 */

      document.getElementById("left").addEventListener('click', function() {
        fetch('http://localhost:8080/test-ui-page.js/move-dot?x=100&y=200')
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.error(error));
      });