import axios from 'axios'
import { VoiceSettings } from '@/app/settings/knowledge-base/types'

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1'

export class ElevenLabsService {
  private apiKey: string
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async textToSpeech(text: string, voiceSettings: VoiceSettings): Promise<ArrayBuffer> {
    if (!voiceSettings.enabled) {
      throw new Error('Text-to-speech is not enabled')
    }

    const response = await axios.post(
      `${ELEVEN_LABS_API_URL}/text-to-speech/${voiceSettings.voice_id}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          style: voiceSettings.style,
          use_speaker_boost: voiceSettings.use_speaker_boost,
          speed: voiceSettings.speed,
        },
      },
      {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    )

    return response.data
  }

  async getVoices(): Promise<any[]> {
    const response = await axios.get(`${ELEVEN_LABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    })

    return response.data.voices
  }

  async getVoice(voiceId: string): Promise<any> {
    const response = await axios.get(`${ELEVEN_LABS_API_URL}/voices/${voiceId}`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    })

    return response.data
  }
} 