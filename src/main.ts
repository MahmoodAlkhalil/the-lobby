const terminal_input_form: HTMLFormElement = document.getElementById(
  "terminal-input-form"
) as HTMLFormElement;
const terminal_input: HTMLInputElement = document.getElementById(
  "terminal-input"
) as HTMLInputElement;
terminal_input_form.onsubmit = handleTerminalInput;

const typing_audio = document.getElementById(
  "typing-audio"
) as HTMLAudioElement;
let terminal_output = document.getElementById("terminal") as HTMLUListElement;
let terminal_output_container = document.getElementById(
  "terminal-output-container"
) as HTMLUListElement;

const terminal_cursor: HTMLSpanElement = document.createElement("span");
terminal_cursor.textContent = "█";
terminal_cursor.id = "terminal-cursor";
terminal_cursor.className = "cursor-blink text-xl";
let last_text_index = 0;
let last_list_element_id = 0;

document.fonts.ready.then(async function () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  (document.getElementById("loading") as HTMLDivElement).style.visibility =
    "hidden";
  try {
    const response = await fetch("/terminal-text.json");
    if (!response.ok) {
      throw new Error("Failed to load the JSON file");
    }
    const text = await response.json();
    const stage_1 = type_into_terminal(text[0]);
    const stage_2 = stage_1.then(() => type_into_terminal(text[1]));
    const stage_3 = stage_2.then(() => type_into_terminal(text[2]));
    const stage_4 = stage_3.then(() => type_into_terminal(text[3]));
    stage_4.then(() => type_into_terminal([""]));
  } catch (error) {}
});

function type_into_terminal(terminal_input: string[]) {
  typing_audio.play();
  last_list_element_id++;
  const terminal_line: HTMLDivElement = document.createElement("div");
  terminal_line.id = `terminal-line-${last_list_element_id}`;
  terminal_line.textContent = "› ";
  terminal_line.appendChild(terminal_cursor);
  terminal_output.appendChild(terminal_line);
  return append_to_terminal(terminal_input);
}

async function append_to_terminal(terminal_input: string[]) {
  const terminal_line: HTMLLIElement = document.getElementById(
    `terminal-line-${last_list_element_id}`
  ) as HTMLLIElement;
  while (last_text_index !== terminal_input.length) {
    terminal_line.removeChild(terminal_cursor);
    terminal_line.textContent =
      terminal_line.textContent + terminal_input[last_text_index];
    terminal_line.appendChild(terminal_cursor);
    last_text_index += 1;
    terminal_output_container.scrollTop =
      terminal_output_container.scrollHeight;
    await new Promise((resolve) =>
      setTimeout(resolve, generate_random_timeout_val(50))
    );
  }
  last_text_index = 0;
  return new Promise((resolve) => {
    typing_audio.pause();
    resolve("finished typing");
  });
}

function generate_random_timeout_val(max: number) {
  return Math.floor(Math.random() * max);
}

function handleTerminalInput(e: Event) {
  if (terminal_input == null) return;
  e.preventDefault();
  console.log(terminal_input.value);
  terminal_input.value = "";
}
