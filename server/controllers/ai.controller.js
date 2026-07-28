import { askGeminiModel } from "../services/ai.service.js";
import fs from 'fs';
import path from 'path';

const current_directory = process.cwd();

const prompt_guide =   fs.readFileSync(
    path.join(current_directory , 'docs','PromptGuide.md'),
    'utf-8'
)
 const websiteKnowledge  =   fs.readFileSync(
    path.join(current_directory , 'docs','doc.md'),
    'utf-8'
)

export const askToAI = async(req,res)=>{
try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required.",
      });
    }

        const finalPrompt = `
${prompt_guide}

Website Documentation:

${websiteKnowledge}

User Question:
${question}
`;

const answer = await askGeminiModel(finalPrompt);
console.log(answer);
return res.status(200).json({
      success: true,
      answer,
    });

} catch (error) {
     console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response.",
    });
}
}



 