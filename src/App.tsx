import { useEffect, useState } from "react";
import { files } from "./files";

export type fileType = {
    name: string;
    files: (string | fileType)[];
};

function findDirectory(dirName: (typeof files)["name"]): false | fileType {
    let foundDirectory: false | fileType = false;
    JSON.stringify(files, (_, nestedValue) => {
        if (nestedValue && nestedValue["name"] === dirName) {
            foundDirectory = nestedValue;
        }
        return nestedValue;
    });
    return foundDirectory;
}

function findParentDirectory(
    dirName: (typeof files)["name"]
): false | fileType {
    let foundParentDirectory = false;
    JSON.stringify(files, (_, nestedValue) => {
        if (
            nestedValue &&
            nestedValue["files"] &&
            nestedValue["files"].some(
                (obj: { name: string }) => obj.name === dirName
            )
        ) {
            foundParentDirectory = nestedValue;
        }
        return nestedValue;
    });
    return foundParentDirectory;
}

function App() {
    const [terminalState, setTerminalState] = useState<string[]>([
        "Type 'help' for a list of commands",
    ]);
    const [path, setPath] = useState("~");

    function handleCommand(e: React.FormEvent<HTMLFormElement>) {
        function pushToTerminalState(text: string[]) {
            setTerminalState((s) => [
                ...s,
                `admin@laptop ${path} % ${formJson.terminalInput}`,
                ...text,
            ]);
        }
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        form.reset();
        const formJson = Object.fromEntries(formData.entries());

        const command = formJson.terminalInput as string;
        const splitCommand: string[] = command.split(" ");
        const currDir = findDirectory(path);
        if (!currDir) return;
        switch (splitCommand[0].toLocaleLowerCase()) {
            case "":
                setTerminalState((s) => [...s, `admin@laptop ${path} % `]);
                break;

            case "help":
                pushToTerminalState([
                    "Available commands:",
                    "clear - Clear the terminal screen",
                    "pwd - Print the current working directory",
                    "ls - List the contents of the current directory",
                    "cd [directory] - Change the current directory",
                    "rm -rf ./ - Empty the current directory",
                ]);
                break;

            case "clear":
                setTerminalState(() => []);
                break;

            case "pwd":
                pushToTerminalState([path]);
                break;

            case "ls":
                pushToTerminalState(
                    currDir.files.map((file) =>
                        typeof file === "string" ? file : file.name
                    )
                );
                break;

            case "cd":
                if (splitCommand[1] === "..") {
                    const parentDir = findParentDirectory(path);
                    if (parentDir) setPath(parentDir.name);
                    return;
                }
                if (findDirectory(splitCommand[1])) setPath(splitCommand[1]);
                break;

            case "rm":
                if (command !== "rm -rf ./") {
                    pushToTerminalState([
                        `rm: command not found: ${command}, did you mean 'rm -rf ./'?`,
                    ]);
                    return;
                }
                pushToTerminalState([]);
                currDir.files = [];
                break;

            default:
                pushToTerminalState([
                    `zsh: command not found: ${splitCommand[0]}`,
                ]);
                break;
        }

        const terminalForm = document.getElementById("terminal-form");
        if (terminalForm) {
            terminalForm.scrollIntoView({ block: "center" });
        }
    }

    useEffect(() => {
        function handleClick() {
            const selection = window.getSelection();
            if (!selection || selection.toString() === "") {
                const terminalInput = document.getElementById("terminal-input");
                if (terminalInput) {
                    terminalInput.focus();
                }
            }
        }

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <>
            {terminalState.map((s) => (
                <p key={crypto.randomUUID()}>{s}</p>
            ))}

            <form id="terminal-form" onSubmit={handleCommand}>
                <label htmlFor="terminalInput">admin@laptop {path} % </label>
                <input
                    id="terminal-input"
                    name="terminalInput"
                    type="text"
                    autoFocus
                />
            </form>
        </>
    );
}

export default App;
