const time = {
    second: 0,
    minute: 0,
    hour: 0,
};
var startTimer = false;
var questionEditEnable = true;
const timerText = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const saveButton = document.getElementById("save");
const clearButton = document.getElementById("clearLocal");
const setQuestionButton = document.getElementById("setQuestion");
const inputImageButton = document.getElementById("inputImage");
const wordCountText = document.getElementById("wordCount");
const charCountText = document.getElementById("characterCount");
const questionTextArea = document.getElementById("questionText");
const answerTextArea = document.getElementById("answerText");
const titleArea = document.getElementById("title");
function formateTime({ second, minute, hour }) {
    let formattedTime = "";
    if (hour < 10)
        formattedTime += "0" + hour;
    else
        formattedTime += hour;
    if (minute < 10)
        formattedTime += ":0" + minute;
    else
        formattedTime += ":" + minute;
    if (second < 10)
        formattedTime += ":0" + second;
    else
        formattedTime += ":" + second;
    return formattedTime;
}
timerText.innerText = formateTime(time);
function stopWatch() {
    if (startTimer) {
        time.second++;
        if (time.second === 60) {
            time.minute++;
            time.second = 0;
        }
        if (time.minute === 60) {
            time.hour++;
            time.minute = 0;
        }
        timerText.innerText = formateTime(time);
        setTimeout(stopWatch, 1000);
    }
}
function getCharCount(text) {
    let count = 0;
    text
        .split("")
        .filter((word) => word.trim().length != 0)
        .map((word) => count++);
    return count;
}
function getWordCount(text) {
    let count = 0;
    text
        .split(" ")
        .filter((word) => word.trim().length != 0)
        .map((word) => count++);
    return count;
}
function updateCounts() {
    const text = answerTextArea.value;
    const charCount = getCharCount(text);
    const wordCount = getWordCount(text);
    wordCountText.querySelector("span").innerText = wordCount;
    charCountText.querySelector("span").innerText = charCount;
}
function handleSelectedImage() {
    const input = document.getElementById("inputImage");
    const display = document.getElementById("displayImage");
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            display.src = e.target.result.toString();
            console.log(e.target.result.toString());
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function saveToLocalStorage() {
    let dataObject = {
        title: titleArea.value,
        question: questionTextArea.value,
        response: answerTextArea.value,
        timerState: time,
        change: new Date().toString(),
    };
    localStorage.setItem("data", JSON.stringify(dataObject));
}
function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem("data"));
}
function updateTime(timerState) {
    time.hour = timerState.hour;
    time.minute = timerState.minute;
    time.second = timerState.second;
}
function onLoadHandler() {
    var data = loadFromLocalStorage();
    titleArea.value = data.title;
    questionTextArea.value = data.question;
    answerTextArea.value = data.response;
    updateTime(data.timerState);
    timerText.innerHTML = formateTime(time);
    updateCounts();
}
startButton.addEventListener("click", (event) => {
    if (startTimer) {
        return;
    }
    startTimer = true;
    stopWatch();
});
stopButton.addEventListener("click", (event) => {
    startTimer = false;
});
resetButton.addEventListener("click", (event) => {
    time.hour = 0;
    time.second = 0;
    time.minute = 0;
    startTimer = false;
    timerText.innerText = formateTime(time);
});
setQuestionButton.addEventListener("click", (event) => {
    if (questionEditEnable) {
        questionTextArea.setAttribute("disabled", "false");
        titleArea.setAttribute("disabled", "true");
        setQuestionButton.innerText = "Edit Question";
    }
    else {
        questionTextArea.removeAttribute("disabled");
        titleArea.removeAttribute("disabled");
        setQuestionButton.innerText = "Set Question";
    }
    questionEditEnable = !questionEditEnable;
});
questionTextArea.addEventListener("input", () => {
    questionTextArea.style.height = "auto";
    questionTextArea.style.height = questionTextArea.scrollHeight + "px";
    saveToLocalStorage();
});
answerTextArea.addEventListener("input", () => {
    updateCounts();
    saveToLocalStorage();
});
saveButton.addEventListener("click", () => {
    const question = questionTextArea.value;
    const respone = answerTextArea.value;
    const title = titleArea.value;
    var data = {};
    data[title] = {
        title: title,
        question: question,
        response: respone,
        time: time,
    };
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${title ? title : "response"}.json`;
    downloadLink.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(downloadLink.href);
});
inputImageButton.addEventListener("change", handleSelectedImage);
clearButton.addEventListener('click', () => {
    if (window.confirm("Clear local storage? "))
        localStorage.clear();
});
window.onload = onLoadHandler;
