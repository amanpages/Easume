//Controller for creating a new resume
//POST /api/resumes/create

import { json } from "body-parser";
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

export const createResume = async (req, res) => {
    try{
        const userId = req.userId; // Assuming user ID is available in req.userId after authentication middleware
        const {title} = req.body;

        //Create new resume
        const newResume = await Resume.create({userId, title})

        //Retunr success message
        return res.status(201).json({message: "Resume created successfully", resume: newResume});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

//Controller for Deleting the resume
//DELETE /api/resumes/:id

export const deleteResume = async (req, res) => {
    try{
        const userId = req.userId; // Assuming user ID is available in req.userId after authentication middleware
        const {resumeId} = req.params;

        //Check if resume exists
        await Resume.findOneAndDelete({ _id: resumeId, userId });

        //Return success message
        return res.status(200).json({message: "Resume deleted successfully"});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

//Get User Resumes by Id
//GET /api/resumes/get

export const getResumesById = async (req, res) => {
    try{
        const userId = req.userId; // Assuming user ID is available in req.userId after authentication middleware
        const {resumeId} = req.params;

        //Get the resume for the user
        const resume = await Resume.findOne({userId, _id: resumeId});

        if(!resume) {
            return res.status(404).json({message: "Resume not found"});
        }

        resume.__v = undefined; // Hide __v in response
        resume.createdAt = undefined; // Hide createdAt in response
        resume.updatedAt = undefined; // Hide updatedAt in response
        return res.status(200).json({resume});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

//Get resume by ID public
//GET /api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try{
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId});

        if(!resume) {
            return res.status(404).json({message: "Resume not found"});
        }

        return res.status(200).json({resume});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

//Controller for updating the resume
//PUT /api/resumes/update

export const updateResume = async (req, res) => {
    try{
        const userId = req.userId; // Assuming user ID is available in req.userId after authentication middleware
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file ? req.file.path : null;
        
        let resumeDataCopy;
        if(typeof resumeData == 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData);
        }

        if (image) {

            const imageBufferData = fs.createReadStream(image);

          const response = await imageKit.files.upload({
            file: imageBufferData,
            fileName: "resume.png",
            folder: "user-resumes",
            transformation:{
                pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : ''),
            },
          });
          resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate({userId, _id: resumeId},resumeDataCopy, {returnDocument: "after"});
        return res.status(200).json({message: "Resume updated successfully", resume});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}
