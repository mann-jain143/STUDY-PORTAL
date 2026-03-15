const API_KEY = "";

/* Fill dropdown into textbox */
function fillQuestion(){
  const dropdown = document.getElementById("faqDropdown").value;
  const textbox = document.getElementById("userQuestion");

  if(dropdown){
    textbox.value = dropdown;
  }
}

async function askAI(){

  const question = document.getElementById("userQuestion").value;

  if(!question){
    alert("Please ask a question");
    return;
  }

  document.getElementById("aiAnswer").innerText = "Thinking... 🤖";

  try{

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + API_KEY
      },
      body:JSON.stringify({
        model:"llama3-8b-8192",
        messages:[
          { role:"system", content:"You are an AI assistant for StudyPortal helping students." },
          { role:"user", content:question }
        ],
        temperature:0.7,
        max_tokens:500
      })
    });

    const data = await response.json();
    console.log("Groq response:", data);

    if(data.choices && data.choices.length > 0){
      const answer = data.choices[0].message.content;
      document.getElementById("aiAnswer").innerText = answer;
    }else{
      document.getElementById("aiAnswer").innerText = "AI did not return a response.";
    }

  }catch(error){

    console.error("API Error:", error);
    document.getElementById("aiAnswer").innerText = "Error contacting AI API.";

  }
}

window.askAI = askAI;
window.fillQuestion = fillQuestion;