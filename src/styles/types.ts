export interface Project {
    id: string;
    title: string;
    category: "Social Media" | "Video" | "Design";
    thumbnail: string;
    description: string;
    tools: string[];
    results: string[];
}