# Chatbot UBS 🤖💬

Chatbot baseado em **Inteligência Artificial** para auxiliar a população na obtenção de informações sobre uma **Unidade Básica de Saúde (UBS)** em Pedro II – Piauí.  
Integrado ao **WhatsApp** e à **API Gemini (Google)**, ele responde perguntas sobre atendimentos, horários e serviços, utilizando documentos cadastrados como base.

---

## 🚀 Funcionalidades
- Atendimento automatizado via **WhatsApp**  
- Integração com **API Gemini** para respostas inteligentes  
- Consulta de informações em documentos da UBS  
- Cadastro e gerenciamento de usuários via **API REST**  
- Autenticação com **QR Code**  

---

## 🛠️ Tecnologias
- **Node.js** + **JavaScript**  
- [whatsapp-web.js](https://wwebjs.dev/) + [Puppeteer](https://pptr.dev/)  
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)  
- **API Gemini (Google)**  
- **API REST** com suporte a banco de dados  

---

## ⚙️ Como Executar
```bash
# Clone o repositório
git clone https://github.com/AlanManoel/Chatbot_UBS.git
cd Chatbot_UBS

# Instale as dependências
npm install

# Configure o arquivo .env
GEMINI_API_KEY=your_api_key_here
API_REST_URL=http://localhost:3000
NUMBER_ADM=your_number

# Inicie o chatbot
npm start
