const text =
  "Hi, welcome to The Lobby, hope you enjoy your stay here while listening to Quran Veres to sooth your day.".split(
    "",
  );
let termial_text_p: HTMLElement | null =
  document.getElementById("terminal-text");
type();
async function type() {
  if (termial_text_p != null)
    for (const letter of text) {
      termial_text_p.innerHTML = termial_text_p?.innerHTML + letter;
    }
}
