
import { GoogleGenAI, Type } from '@google/genai';
import { Teacher, TimetableData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface SubstituteResult {
    substituteTeacherName: string;
    reasoning: string;
}

export const findSubstitute = async (
    absentTeacher: Teacher,
    day: string,
    period: number,
    timetable: TimetableData,
    allTeachers: Teacher[]
): Promise<SubstituteResult> => {

    const availableTeachers = allTeachers.filter(teacher => {
        // Exclude the absent teacher
        if (teacher.id === absentTeacher.id) return false;
        
        // Check if the teacher has a free period at the specified time
        const slot = timetable[day][period - 1];
        // This check is to see if any teacher is scheduled for that slot.
        // A teacher is available if they are not the teacher assigned to ANY class in this slot.
        // A simpler way: Find teachers who are NOT in the timetable for this slot.
        const teachersWithClassesThisPeriod = Object.values(timetable)
            .flatMap(daySchedule => daySchedule[period - 1])
            .map(s => s.teacher)
            .filter(Boolean);
            
        return !teachersWithClassesThisPeriod.includes(teacher.name);
    }).map(t => ({ name: t.name, subjects: t.subjects }));


    if (availableTeachers.length === 0) {
        throw new Error("No teachers are available for substitution at this time.");
    }
    
    const prompt = `
You are an intelligent timetable management assistant for a school.
Your task is to find a suitable substitute teacher for an absent colleague.

CONTEXT:
- Absent Teacher: ${absentTeacher.name}
- Subject of the class: ${timetable[day][period - 1].subject}
- Day and Period of Absence: ${day}, Period ${period}

LIST OF AVAILABLE TEACHERS (who have a free period now):
${JSON.stringify(availableTeachers, null, 2)}

YOUR TASK:
Analyze the list of available teachers and find the best substitute.
Prioritize teachers based on the following criteria:
1.  **Primary Match:** The substitute teacher's subjects include the subject of the class (${timetable[day][period - 1].subject}).
2.  **Secondary Match:** If no primary match is found, select any other available teacher.

Provide a brief reasoning for your choice.
Respond with ONLY a JSON object that matches the required schema.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    substituteTeacherName: {
                        type: Type.STRING,
                        description: 'The full name of the chosen substitute teacher.',
                    },
                    reasoning: {
                        type: Type.STRING,
                        description: 'A brief explanation for why this teacher was chosen.'
                    }
                },
                required: ['substituteTeacherName', 'reasoning'],
            },
        }
    });
    
    const jsonText = response.text.trim();
    try {
        const parsedResult = JSON.parse(jsonText);
        return parsedResult as SubstituteResult;
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonText);
        throw new Error("Received an invalid response from the AI assistant.");
    }
};
