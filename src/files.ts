import { fileType } from "./App";

export const files: fileType = {
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
        {
            name: "ImportantDatabase",
            files: [
                "Database.sql",
                "DatabaseConfig.json",
                "DatabaseBackup.zip",
            ],
        },
    ],
};
