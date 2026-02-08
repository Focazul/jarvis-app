# Design do Aplicativo Jarvis

## Visão Geral
O Jarvis é um assistente pessoal para gerenciar tarefas e alarmes através de uma interface de chat natural. O usuário interage por texto ou voz, e o aplicativo interpreta comandos em linguagem natural para criar, listar, editar e excluir itens.

## Orientação de Design
- **Formato**: Portrait (9:16)
- **Uso**: Uma mão
- **Padrão**: Seguir Apple Human Interface Guidelines (HIG)
- **Estilo**: Limpo, minimalista, focado em usabilidade

## Lista de Telas

| Tela | Descrição |
|------|-----------|
| **Chat Principal** | Interface de chat com histórico de mensagens, campo de entrada de texto e botão de microfone |
| **Lista de Tarefas** | Visualização organizada de tarefas por período (Hoje, Semana, Sem data) |
| **Lista de Alarmes** | Visualização de alarmes ativos com opções de editar/excluir |
| **Detalhes de Tarefa** | Tela de edição/visualização de tarefa individual |
| **Detalhes de Alarme** | Tela de edição/visualização de alarme individual |
| **Configurações** | Preferências do aplicativo (tema, notificações, etc.) |

## Conteúdo e Funcionalidade por Tela

### 1. Chat Principal (Home)
**Conteúdo:**
- Histórico de mensagens (usuário à direita, Jarvis à esquerda)
- Mensagens do Jarvis com ícones de confirmação/sucesso
- Campo de entrada de texto na parte inferior (fixo)
- Botão de microfone ao lado do campo de texto
- Botão de envio (ícone de seta)

**Funcionalidade:**
- Enviar mensagem de texto
- Capturar áudio via microfone
- Exibir resposta do Jarvis
- Scroll automático para última mensagem
- Confirmações visuais (loading, sucesso, erro)

### 2. Lista de Tarefas
**Conteúdo:**
- Abas ou seções: "Hoje", "Semana", "Sem data"
- Cards de tarefa com título, data/hora (se houver), status
- Ícone de checkbox para marcar como concluída
- Ícone de lixeira para excluir
- Botão flutuante para criar nova tarefa (abre chat)

**Funcionalidade:**
- Filtrar tarefas por período
- Marcar/desmarcar como concluída
- Excluir tarefa
- Editar tarefa (abre detalhes)
- Visualizar contagem de tarefas por período

### 3. Lista de Alarmes
**Conteúdo:**
- Cards de alarme com hora, descrição, status (ativo/inativo)
- Toggle para ativar/desativar alarme
- Ícone de edição
- Ícone de lixeira para excluir
- Indicador de recorrência (diário/semanal)

**Funcionalidade:**
- Listar alarmes ativos
- Ativar/desativar alarme
- Excluir alarme
- Editar alarme (abre detalhes)
- Visualizar próximo alarme agendado

### 4. Detalhes de Tarefa
**Conteúdo:**
- Campo de título (editável)
- Campo de data (seletor de data)
- Campo de hora (seletor de hora, opcional)
- Status (pendente/concluída)
- Botão de salvar
- Botão de excluir

**Funcionalidade:**
- Editar título, data, hora
- Marcar como concluída
- Salvar alterações
- Excluir com confirmação

### 5. Detalhes de Alarme
**Conteúdo:**
- Campo de descrição (editável)
- Campo de data (seletor de data)
- Campo de hora (seletor de hora)
- Opção de recorrência (nenhuma/diária/semanal)
- Toggle de ativo/inativo
- Botão de salvar
- Botão de excluir

**Funcionalidade:**
- Editar descrição, data, hora
- Configurar recorrência
- Ativar/desativar
- Salvar alterações
- Excluir com confirmação

### 6. Configurações
**Conteúdo:**
- Tema (claro/escuro/automático)
- Notificações (ativadas/desativadas)
- Som de alarme (seletor)
- Vibração (ativada/desativada)
- Sobre o aplicativo

**Funcionalidade:**
- Alternar tema
- Ativar/desativar notificações
- Selecionar som de alarme
- Ativar/desativar vibração

## Fluxos de Usuário Principais

### Fluxo 1: Criar Tarefa via Chat
1. Usuário abre app (Chat Principal)
2. Digita ou fala: "Adicionar tarefa: estudar Excel"
3. Jarvis identifica: título = "estudar Excel", sem data
4. Jarvis pergunta: "Quando você quer fazer isso?"
5. Usuário responde: "amanhã"
6. Jarvis confirma: "Tudo certo! Tarefa 'estudar Excel' criada para amanhã."
7. Tarefa aparece na aba "Semana" da Lista de Tarefas

### Fluxo 2: Criar Alarme via Chat
1. Usuário abre app (Chat Principal)
2. Digita ou fala: "Me lembre de pagar o cartão amanhã às 10h"
3. Jarvis identifica: descrição = "pagar o cartão", data = amanhã, hora = 10:00
4. Jarvis confirma: "Confirma o alarme para amanhã às 10h?"
5. Usuário responde: "sim" ou toca em botão de confirmação
6. Jarvis responde: "Alarme criado com sucesso! 👍"
7. Alarme aparece na Lista de Alarmes

### Fluxo 3: Listar Tarefas
1. Usuário pergunta: "O que tenho para hoje?"
2. Jarvis lista tarefas de hoje
3. Usuário pode tocar em uma tarefa para editar ou marcar como concluída

### Fluxo 4: Excluir Alarme
1. Usuário pergunta: "Excluir alarme das 6h"
2. Jarvis pergunta: "Tem certeza que quer excluir o alarme das 6h?"
3. Usuário confirma
4. Jarvis responde: "Alarme excluído."

## Paleta de Cores

| Elemento | Cor (Light) | Cor (Dark) |
|----------|------------|-----------|
| **Primária** | #0a7ea4 (Azul) | #0a7ea4 |
| **Background** | #ffffff | #151718 |
| **Surface** | #f5f5f5 | #1e2022 |
| **Foreground** | #11181C | #ECEDEE |
| **Muted** | #687076 | #9BA1A6 |
| **Border** | #E5E7EB | #334155 |
| **Success** | #22C55E | #4ADE80 |
| **Warning** | #F59E0B | #FBBF24 |
| **Error** | #EF4444 | #F87171 |

## Tipografia

- **Títulos**: 24-28px, bold
- **Subtítulos**: 18-20px, semibold
- **Body**: 16px, regular
- **Small**: 14px, regular
- **Tiny**: 12px, regular

## Componentes Reutilizáveis

- **MessageBubble**: Bolha de mensagem (usuário/Jarvis)
- **TaskCard**: Card de tarefa com checkbox e ações
- **AlarmCard**: Card de alarme com toggle e ações
- **ConfirmationModal**: Modal de confirmação
- **InputField**: Campo de entrada de texto
- **DatePicker**: Seletor de data
- **TimePicker**: Seletor de hora
- **Tab**: Abas para filtrar conteúdo

## Interações e Feedback

- **Sucesso**: Ícone de checkmark verde + mensagem
- **Erro**: Ícone de X vermelho + mensagem de erro
- **Loading**: Spinner/skeleton enquanto processa
- **Confirmação**: Modal com botões "Sim" e "Não"
- **Haptic**: Feedback tátil em ações principais (criar, excluir, confirmar)

## Acessibilidade

- Botões com tamanho mínimo de 44x44pt
- Contraste de cores adequado (WCAG AA)
- Labels claros para campos de entrada
- Suporte a VoiceOver (iOS) e TalkBack (Android)
- Respostas do Jarvis em texto e opcionalmente em áudio
