import { PlusIcon, SparkleIcon, X } from "lucide-react";
import { useState } from "react";

const Skills = ({data, onChange})=>{
    const [newSkills,setNewSkills]= useState("");

    const addSkill =()=>{
        if(newSkills.trim() && !data.includes(newSkills.trim())){
            onChange([...data, newSkills.trim()])
            setNewSkills("")
        }
    }

    const removeSkills=(indexToRemove)=>{
         onChange(data.filter((_,index)=> index !== indexToRemove))
    }

    const handleKeyPress=(e)=>{
        if(e.key === "Enter"){
            e.preventDefault();
            addSkill();
        }
    }

    return(
        <div className="space-y-4 ">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 ">
                <h3>Skills</h3>
                <p className="text-sm text-gray-500">Add your Technical and Soft Skills</p>
            </div>

            <div className="flex gap-2">
                <input type="text" placeholder="Enter a skill (e.g.,JavaScript,Project Management)" className="flex-1 px-3 py-2 text-sm" onChange={(e)=>setNewSkills(e.target.value)} value={newSkills} onKeyDown={handleKeyPress}/>

                <button onClick={addSkill} disabled={!newSkills.trim()} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <PlusIcon size={14}/> Add
                </button>
            </div>
            {data.length > 0 ? (
                <div className="flex flex-wrap gap-2">{data.map((skill,index)=>(
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {skill}
                        <button onClick={()=>removeSkills(index)} className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3"/>
                        </button>
                    </span>
                ))}</div>
            ):(
                <div className="text-center py-6 text-gray-500">
                    <SparkleIcon className="w-10 h-10 mx-auto mb-2 text-gray-300"/>
                    <p>No Skills added yet</p>
                    <p className="text-sm">Add your Technical and Soft Skills above</p>
                </div>
            )}

            <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800"><strong>Tip:</strong>Add 8-12 relevent skills. Include both Technical skills (programming language, tools) and soft skills (leadership, communication).</p>
            </div>
        </div>

    )
}

export default Skills;