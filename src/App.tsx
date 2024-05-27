import { useState } from "react";

type fileType = {
    name: string;
    files: (string | fileType)[];
};

const files: fileType = {
    name: "~",
    files: [
        "Resume.pdf",
        "PassportScan.jpg",
        "TaxReturns2023.pdf",
        {
            name: "Work",
            files: [
                "ProjectProposal.docx",
                "MeetingNotes.txt",
                "ClientPresentation.pptx",
                {
                    name: "Archives",
                    files: [
                        "OldProject1.zip",
                        "OldProject2.zip",
                        {
                            name: "FinancialReports",
                            files: ["Report_Q1_2022.pdf", "Report_Q2_2022.pdf"],
                        },
                    ],
                },
            ],
        },
        {
            name: "Personal",
            files: [
                {
                    name: "FamilyVacations",
                    files: [
                        {
                            name: "Hawaii2022",
                            files: [
                                "BeachDay1.jpg",
                                "LuauNight.mp4",
                                "SunsetHike.jpg",
                            ],
                        },
                        {
                            name: "Europe2021",
                            files: [
                                "EiffelTower.jpg",
                                "GondolaRide.mp4",
                                "ColosseumTour.jpg",
                            ],
                        },
                    ],
                },
                "RecipeCollection.docx",
                {
                    name: "HealthRecords",
                    files: ["BloodTestResults.pdf", "VaccinationRecord.pdf"],
                },
                {
                    name: "Kids",
                    files: [
                        "FirstSteps.mp4",
                        "FirstDayOfSchool.jpg",
                        "ArtProjects.pdf",
                    ],
                },
            ],
        },
        {
            name: "Administrative",
            files: [
                "LeaseAgreement.pdf",
                "InsurancePolicy2024.pdf",
                "CarRegistration.jpg",
                {
                    name: "Utilities",
                    files: [
                        "ElectricBill_April2024.pdf",
                        "WaterBill_April2024.pdf",
                        "InternetBill_April2024.pdf",
                    ],
                },
            ],
        },
    ],
};

function findDirectory(dirName: (typeof files)["name"]): false | fileType {
    let foundObj = false;
    JSON.stringify(files, (_, nestedValue) => {
        if (nestedValue && nestedValue["name"] === dirName) {
            foundObj = nestedValue;
        }
        console.log(JSON.stringify(foundObj));
        return nestedValue;
    });
    return foundObj;
}

function findParentDirectory(
    dirName: (typeof files)["name"]
): false | fileType {
    let foundObj = false;
    JSON.stringify(files, (_, nestedValue) => {
        if (
            nestedValue &&
            nestedValue["files"] &&
            nestedValue["files"].some(
                (obj: { name: string }) => obj.name === dirName
            )
        ) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
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
        switch (splitCommand[0]) {
            case "":
                setTerminalState((s) => [...s, `user@laptop ${path} % `]);
                break;
            case "help":
                setTerminalState((s) => [
                    ...s,
                    `user@laptop ${path} % ${formJson.terminalInput}`,
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
                    `user@laptop ${path} % ${formJson.terminalInput}`,
                    path,
                ]);
                break;
            case "ls":
                if (currDir)
                    setTerminalState((s) => [
                        ...s,
                        `user@laptop ${path} % ${formJson.terminalInput}`,
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
                if (findDirectory(splitCommand[1])) {
                    setPath(splitCommand[1]);
                }
                break;
            case "rm":
                if (formJson.terminalInput === "rm -rf ./") {
                    if (currDir) currDir.files = [];
                }
                break;
            default:
                setTerminalState((s) => [
                    ...s,
                    `user@laptop ${path} % ${formJson.terminalInput}`,
                    `zsh: command not found: ${splitCommand[0]}`,
                ]);
                break;
            // Scroll #terminal-form into view
        }
        const terminalForm = document.getElementById("terminal-form");
        if (terminalForm) {
            terminalForm.scrollIntoView({ block: "center" });
        }
    }

    return (
        <>
            {terminalState.map((s) => (
                <p id="terminal-log">{s}</p>
            ))}
            <form id="terminal-form" onSubmit={handleCommand}>
                <label id="terminal-label">
                    user@laptop {path} %{" "}
                    <input
                        id="terminal-input"
                        name="terminalInput"
                        type="text"
                        autoFocus
                    />
                </label>
            </form>
        </>
    );
}

export default App;
