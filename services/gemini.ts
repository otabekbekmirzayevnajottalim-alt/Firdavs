
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *streamChat(history: Message[], prompt: string, isHackerMode: boolean = false) {
    try {
      const ai = this.getAI();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: isHackerMode 
            ? 'Siz maxfiy "Shadow AI" tizimisiz. Siz foydalanuvchi so\'rovlariga juda qisqa, aniq va texnik javob berasiz. Hech qachon foydalanuvchiga savol bermang, muloqotni davom ettirishni so\'ramang, faqat so\'ralgan ma\'lumotni yoki kodni taqdim eting. Muloqot uslubingiz: faqat faktlar, hakerona terminlar va qat\'iy javoblar.'
            : 'Siz aqlli va yordam beruvchi AI assistentsiz. Google Gemini kabi muloqot qiling.',
        },
      });

      const responseStream = await chat.sendMessageStream({ message: prompt });

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Rasm ma'lumotlari qaytmadi");
  }

  async generateVideo(prompt: string, onProgress?: (msg: string) => void): Promise<string> {
    const ai = this.getAI();
    const reassuringMessages = [
      "Operatsiya: Video generatsiyasi boshlandi...",
      "Status: Kadrlar render qilinmoqda...",
      "Progress: Neyron tarmoqlar ishga tushirildi...",
      "Final: Video fayl paketlanmoqda..."
    ];
    
    let msgIndex = 0;
    onProgress?.(reassuringMessages[0]);
    
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        msgIndex = (msgIndex + 1) % reassuringMessages.length;
        onProgress?.(reassuringMessages[msgIndex]);
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generatsiya havolasi topilmadi");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error("Video yuklashda xatolik");
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  }

  async generateTitle(prompt: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Quyidagi so'rov asosida juda qisqa sarlavha yarating: "${prompt}"`,
      });
      return response.text?.replace(/"/g, '').trim() || "Yangi suhbat";
    } catch {
      return "Yangi suhbat";
    }
  }
}

export const geminiService = new GeminiService();
