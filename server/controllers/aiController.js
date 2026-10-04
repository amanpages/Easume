//Controller to enhane professional summary using AI
//POST /api/ai/enhanceSummary

import openai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const {userContent} = req.body;
        if(!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_API_MODEL,
                max_tokens: 1000,
    messages: [
        {   role: "system",
                        content:"Rewrite the user's professional summary as concise, polished resume text. Return only the rewritten summary, with no heading or explanation. Use no more than 3 sentences and 75 words. Preserve the user's facts and do not invent skills, experience, or achievements."
        },
        {
            role: "user",
            content: userContent,
        },
    ]
        });

            const enhancedContent = response.choices[0].message.content.trim();
            return res.status(200).json({ enhancedContent });
    } catch (error) {
        res.status(400).json({ message: "Error enhancing professional summary", error: error.message });
    }
}

//Controller fro enhancing the resumes job description using AI
//POST /api/ai/enhanceJobDescription

export const enhanceJobDescription = async (req, res) => {
    try {
        const {userContent} = req.body;
        if(!userContent) {
            return res.status(400).json({ message: "User content is required" });
        }

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_API_MODEL,
    messages: [
        {   role: "system",
            content:"You are an expert resume writer. Your task is to enhance the job description provided by the user. The job description should be only in 1-3 sentence also highlight the user's skills, achievements, and professional experience effectively. Make it compelling and ATS-friendly. The enhanced job description should be tailored to the user's industry and career goals and only return text no option or anything else."
        },
        {
            role: "user",
            content: userContent,
        },
    ]
        });

        const enhancedJobDescription = response.choices[0].message.content.trim();
        return res.status(200).json({ enhancedJobDescription });
    } catch (error) {
        res.status(400).json({ message: "Error enhancing job description", error: error.message });
    }
}

//Controller for uploading resume to the database
//POST /api/ai/uploadResume

export const uploadResume = async (req, res) => {
    try {
        
        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText) {
            return res.status(400).json({ message: "Resume text is required" });
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resumes";
        const userPrompt = `Extract the following information from the resume text provided by the user:${resumeText} Provide data in the following JSON format with no additional text before or after:
        {professional_summary:{
        type: String,
        default: ""
    },
    skills: [{
        type: String}],
    personal_info:{
        image:{type: String, default: ''},
        full_name: {type: String, default: ''},
        profession: {type: String, default: ''},
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        location: {type: String, default: ''},
        linkedin: {type: String, default: ''},
        website: {type: String, default: ''},
    },
    experience:[
        {
            company:{type: String},
            position:{type: String},
            start_date:{type: String},
            end_date:{type: String},
            description:{type: String},
            is_current:{type: Boolean},
        }
    ],
    projects:[
        {
            name:{type: String},
            tyep:{type: String},
            description:{type: String},
        }
    ],
    education:[
        {
            institution:{type: String},
            degree:{type: String},
            field:{type: String},
            graduation_date:{type: String},
            gpa:{type: String},
        }
    ],}`;

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_API_MODEL,
    messages: [
        {   role: "system",
            content:systemPrompt
        },
        {
            role: "user",
            content: userPrompt,
        },
    ],
    response_format: {type: "json_object"}
        });

        const extractedData = response.choices[0].message.content.trim();
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({
            userId,title,...parsedData
        });
        res.json({resumeId: newResume._id, message: "Resume uploaded successfully"});

    } catch (error) {
        res.status(400).json({ message: "Error extracting data from resume", error: error.message });
    }
}