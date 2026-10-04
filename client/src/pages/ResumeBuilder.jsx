import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOff, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkle, User } from "lucide-react";
import PersonalInfoForm from "../components/PersonalInforForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import SummarySection from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import Skills from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder =()=>{
    const {resumeId} = useParams();

    const {token} = useSelector(state=>state.auth);

    const[resumeData, setResumeData]=useState({
        _id:'',
        title:'',
        personal_info:{},
        professional_summary:'',
        experience:[],
        education:[],
        project:[],
        skills:[],
        template:"classic",
        accent_color:"#3B82F6",
        public:false,
    });

    const [activeSessionIndex, setActiveSectionIndex] = useState(0);
    const [removeBackground, setRemoveBackground] = useState(false);


    const sections=[
        {id:"Personal", name:"Personal Info", icon: User},
        {id:"Summary", name:"Summary", icon: FileText},
        {id:"Experience", name:"Experience", icon: Briefcase},
        {id:"Education", name:"Education", icon: GraduationCap},
        {id:"Projects", name:"Projects", icon: FolderIcon},
        {id:"Skills", name:"Skills", icon: Sparkle},
    ]

    const activeSection = sections[activeSessionIndex]

    useEffect(()=>{
        const loadExistingResume = async()=>{
            try {
                const {data} = await api.get('/api/resumes/get/'+ resumeId, {headers:{Authorization:token}})
                if(data.resume){
                    setResumeData(data.resume);
                    document.title = data.resume.title;
                }
            } catch (error) {
                console.log(error.message)
            }
        }

        loadExistingResume()
    }, [resumeId, token])

    const changeResumeVisibity = async ()=>{
       try {
        const formData  = new FormData();
        formData.append("resumeId", resumeId);
        formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

        const {data} = await api.put('/api/resumes/update', formData, {headers:{Authorization:token}})
        setResumeData({...resumeData, public: !resumeData.public});
        toast.success(data.message)        
       } catch (error) {
        toast.error("Error saving resume", error.message)
       }
    }

    const handleShare =()=>{
        const frontendURL = window.location.href.split('/app/')[0];
        const resumeURL = frontendURL + "/view/"+   resumeId;

        if(navigator.share){
            navigator.share({url:resumeURL, text:"My Resume",})
        }else{
            alert("Share not Supported")
        }
    }

    const downloadResume=()=>{
        window.print();
    }

    const saveResume = async()=>{
        let updatedResumeData = structuredClone(resumeData)
        //remove Image from updated image data
        if(typeof resumeData.personal_info.image === 'object'){
            delete updatedResumeData.personal_info.image
        }

        const formData = new FormData();
        formData.append("resumeId", resumeId);
        formData.append("resumeData", JSON.stringify(updatedResumeData));
        removeBackground && formData.append("removeBackground","yes");
        typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

        const {data} = await api.put('/api/resumes/update', formData, {headers:{Authorization:token}});

        setResumeData(data.resume);
        return data.message;
    }

    return(
    <div>
        {/* Icon for to back  */}
        <div className="max-w-7xl mx-auto px-4 py-6">
         <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
         <ArrowLeftIcon className="size-4 "/> Back to Dashboard
         </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 pv-8">
            <div className="grid  lg:grid-cols-12 gap-8 ">
                {/* Left panel form  */}
                <div className="relative lg:col-span-5 rounded-lg">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
                        {/* Progress bar using active session  */}
                        <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
                        <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width:`${activeSessionIndex * 100 / (sections.length-1)}%`}}/>

                        {/* Section navigation */}

                    <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
        {/* Template selector  */}
                        <div className="flex items-center gap-2">
                            <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev, template}))}/>
                            <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev, accent_color:color}))}/>
                        </div>

                        <div className="flex items-center">{activeSessionIndex !== 0 && (
                            <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1,0))} className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSessionIndex === 0}>
                                <ChevronLeft className="size-4"/> Previous 
                            </button>
                        )}
                        <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1,sections.length-1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSessionIndex === sections.length-1 && 'opacity-50' }`} disabled={setActiveSectionIndex === sections.length-1}>
                                Next<ChevronRight/> 
                            </button>
                        </div>
                    </div>
                        {/* Form content */}
                    <div className="space-y-6">
                        {activeSection.id === "Personal" && (
                            <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                        )}
                        {activeSection.id === "Summary" && (
                            <SummarySection data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=>({...prev, professional_summary:data}))} setResumeData={setResumeData}/>
                        )}

                        {activeSection.id === "Experience" && (
                            <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev, experience:data}))}/>
                        )}

                        {activeSection.id === "Education" && (
                            <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev, education:data}))}/>
                        )}

                        {activeSection.id === "Projects" && (
                            <ProjectForm data={resumeData.project} onChange={(data)=>setResumeData(prev=>({...prev, project:data}))}/>
                        )}

                        {activeSection.id === "Skills" && (
                            <Skills data={resumeData.skills} onChange={(data)=>setResumeData(prev=>({...prev, skills:data}))}/>
                        )}

                    </div>
                    <button onClick={()=>toast.promise(saveResume(), {
                        loading: 'Saving...',
                        success: (message) => message,
                        error: (error) => error?.response?.data?.message || error.message || 'Error saving resume',
                    })} className="bg-gradient-to-r from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-500 transition-all rounded-md px-6 mt-6 twxt-sm">
                        Save Changes
                    </button>
                    </div>
                </div>
                {/* Right Panel Preview  */}
                <div className="lg:col-span-7 max-lg:mt-6">
                    <div className="relative w-full">
                        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                            {resumeData.public &&(
                                <button onClick={handleShare} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors">
                                    <Share2Icon className="size-4"/> Share
                                </button>
                            )}
                            <button onClick={changeResumeVisibity} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors">
                                {resumeData.public? <EyeIcon className="size-4"/>:<EyeOffIcon className="size-4"/>}
                                {resumeData.public?"Public":"Private"}
                            </button>
                            <button onClick={downloadResume} className="flex items-center py-2 px-6 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors">
                                <DownloadIcon className="size-4"/>Download
                            </button>
                        </div>
                        
                    </div>
                    {/* Resume Preview  */}
                    <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>

                </div>
            </div>

        </div>

    </div>
    )
}
export default ResumeBuilder;