import axios from 'axios'
import { ContentType } from '@/app/settings/knowledge-base/types'
import { YoutubeTranscript } from 'youtube-transcript'
import { load } from 'cheerio'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { TextLoader } from 'langchain/document_loaders/fs/text'

export class ContentProcessor {
  async processContent(type: ContentType, source: string): Promise<string> {
    switch (type) {
      case 'url':
        return this.processUrl(source)
      case 'youtube':
        return this.processYoutubeVideo(source)
      case 'pdf':
        return this.processPdf(source)
      case 'doc':
        return this.processDoc(source)
      case 'txt':
        return this.processTxt(source)
      default:
        return source
    }
  }

  private async processUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url)
      const $ = load(response.data)
      
      // Remove elementos não relevantes
      $('script').remove()
      $('style').remove()
      $('nav').remove()
      $('header').remove()
      $('footer').remove()
      $('iframe').remove()
      
      // Extrai o texto do conteúdo principal
      const mainContent = $('main').text() || $('article').text() || $('body').text()
      
      return this.cleanText(mainContent)
    } catch (error) {
      throw new Error(`Erro ao processar URL: ${error.message}`)
    }
  }

  private async processYoutubeVideo(url: string): Promise<string> {
    try {
      const videoId = this.extractYoutubeId(url)
      if (!videoId) {
        throw new Error('ID do vídeo do YouTube inválido')
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId)
      const text = transcript
        .map(item => item.text)
        .join(' ')
      
      return this.cleanText(text)
    } catch (error) {
      throw new Error(`Erro ao processar vídeo do YouTube: ${error.message}`)
    }
  }

  private async processPdf(filePath: string): Promise<string> {
    try {
      const loader = new PDFLoader(filePath)
      const docs = await loader.load()
      return docs.map(doc => doc.pageContent).join('\n')
    } catch (error) {
      throw new Error(`Erro ao processar PDF: ${error.message}`)
    }
  }

  private async processDoc(filePath: string): Promise<string> {
    try {
      const loader = new DocxLoader(filePath)
      const docs = await loader.load()
      return docs.map(doc => doc.pageContent).join('\n')
    } catch (error) {
      throw new Error(`Erro ao processar documento Word: ${error.message}`)
    }
  }

  private async processTxt(filePath: string): Promise<string> {
    try {
      const loader = new TextLoader(filePath)
      const docs = await loader.load()
      return docs.map(doc => doc.pageContent).join('\n')
    } catch (error) {
      throw new Error(`Erro ao processar arquivo de texto: ${error.message}`)
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Remove espaços extras
      .replace(/[^\S\r\n]+/g, ' ') // Normaliza espaços
      .trim()
  }

  private extractYoutubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    const match = url.match(regex)
    return match ? match[1] : null
  }
} 