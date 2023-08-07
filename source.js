//Use URL parameters to load the page entity
let params = new URLSearchParams(document.location.search);
let url = params.get("page");

// Request pages.json
function getPageContent(url) {
  // Load JSON data from external file
  return fetch('pages.json')
    .then(response => response.json())
    .then(data => {
      // Loop through each id entity
      for (const id in data) {
        if (data.hasOwnProperty(id)) {
          const entity = data[id];
          // Check if entity's url matches the specified url
          if (entity.url === url) {
            return entity.content;
          }
        }
      }
      // Return null if no matching entity is found
      return null;
    })
    .catch(error => console.error(error));
}

// Update DOM with page content
getPageContent(url)
  .then(content => {
    if (content) {
      for (const id in content) {
        if (content.hasOwnProperty(id)) {
          const element = document.getElementById(id);
          if (element) {
            element.innerHTML = parseMarkdown(content[id]);
          }
        }
      }
    } else {
      document.getElementById("title").innerText = "Page not found";
      document.getElementById("body").innerText = "";
    }
  });

  function parseMarkdown(text) {
    // Bold syntax: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Italic syntax: *text*
    text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
    // Underline syntax: _text_
    text = text.replace(/_(.*?)_/g, '<u>$1</u>');
    // Strikethrough syntax: -text-
    text = text.replace(/-(.*?)-/g, '<s>$1</s>');
    // Hyperlink syntax: [text](url:text)
    text = text.replace(/\[(.*?)]\(url:(.*?)\)/g, 'TEMPORARILY DISABLED');
    // Color syntax: [text](rgb:r,g,b)
    text = text.replace(/\[(.*?)\]\(rgb:(\d{1,3}),(\d{1,3}),(\d{1,3})\)/g, '<span style="color:rgb($2,$3,$4)">$1</span>');
    // Divider syntax: ===
    text = text.replace(/===/g, '<hr>');
    // Newline syntax: ;;
    text = text.replace(/;;/g, '<br>');
    // List Syntax: >>
    text = text.replace(/{(.*?)}/g, '<ul><li>$1</li></ul>');
    // Code block syntax: ```code```
    text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
    return text;
  }
  
