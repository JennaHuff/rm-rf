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
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        form.reset();
        const formJson = Object.fromEntries(formData.entries());

        const splitCommand: string[] = (formJson.terminalInput as string).split(
            " "
        );
        const currDir = findDirectory(path);
        switch (splitCommand[0].toLocaleLowerCase()) {
            case "":
                setTerminalState((s) => [...s, `admin@laptop ${path} % `]);
                break;
            case "help":
                setTerminalState((s) => [
                    ...s,
                    `admin@laptop ${path} % ${formJson.terminalInput}`,
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
                setTerminalState((s) => [
                    ...s,
                    `admin@laptop ${path} % ${formJson.terminalInput}`,
                    path,
                ]);
                break;
            case "ls":
                if (currDir)
                    setTerminalState((s) => [
                        ...s,
                        `admin@laptop ${path} % ${formJson.terminalInput}`,
                        ...currDir.files.map((file) =>
                            typeof file === "string" ? file : file.name
                        ),
                    ]);
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
                if (formJson.terminalInput === "rm -rf ./") {
                    if (currDir) currDir.files = [];
                }
                break;
            default:
                setTerminalState((s) => [
                    ...s,
                    `admin@laptop ${path} % ${formJson.terminalInput}`,
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
